---
title: 'AXI-Stream Systolic Array → SoC Testbed'
date: 2025-12-10 20:15:00
categories:
  - 'Engineering'
  - 'Projects'
tags:
permalink: /axis-systolic-array-testbed/
---

![]({{ site.content_base_url }}/images/2026/axis-sa.png)

I built this during my [CGRA4ML project](/cgra4ml/). I created many SoC integration & verification methods to get CGRA4ML working, and I wanted to reuse that on many of my and my friends' projects. So I extracted the SoC specific parts and created this testbed. As a simple, yet usable core IP, I created a systolic array that performs matrix multiplication.

## Features

- Currently being formally verified.
- Fully parameterized AXI-Stream Systolic Array that performs (`y = k.T @ x + a`).
- Configurable multiple AXI memory ports (up to 4 `M_AXI` interfaces and 1 `S_AXIL`).
- Custom DMA controller with a register bank custom mapped to firmware.
- Baremetal TCL implementation scripts for Xilinx ZCU104/ZCU102 boards.
- Ibex-SoC integration.

**[GitHub - axis-systolic-array](https://github.com/abarajithan11/axis-systolic-array)**

## Systolic Array Dataflow

The most interesting part was designing the propagation of control signals. To avoid heavy routing congestion and timing violations, standard AXI `valid` and `last` signals cannot be globally broadcast. Instead, they must move **diagonally** through the array during the multiply-accumulate phase. Then, when a compute matrix is complete, the results shift **linearly** to the right to be streamed out of the AXI ports.

```verilog
  // Delay control signals diagonally across the array's computed length (LM+LA+D)
  n_delay #(.N(LM+LA+D), .W(1)) VALID (.clk, .e(en_mac), .i(s_valid           ), .d(valid));
  n_delay #(.N(LM+LA+D), .W(1)) VLAST (.clk, .e(en_mac), .i(s_valid && s_last ), .d(vlast));

  // Output Register Control - Linear shifting of results 
  for (d=0; d<D; d=d+1) begin
    if (d==0)
      assign r_last[0] = r_valid[0];
    else
      always_ff @(posedge clk)
        if (!rstn)
            r_last[d] <= 0;
        else if (en_shift) 
          if (d >= C-1 && m_last) 
            r_last[d] <= 0;            // At the last AXI beat, clear all diagonal regs beyond C
          else
            r_last[d] <= r_last[d-1];  // On non-last beats, shift the validation bits right linearly
  end
```

## Simulation via AXI-Stream VIP

Since the dataflow is quite delicate, I used my custom [SystemVerilog AXI-Stream VIP](/reusable-axis-vip/) to verify the AXI-Stream IP with transaction level randomized verification. This stress-tests the design with highly randomized backpressure, randomly dropping `tready` and inserting arbitrary gaps in `tvalid`.

I then built my [FireBridge VIP](/firebridge/) around this, to do stress testing with real C firmware, emulating congestion in the full-AXI ports (not just AXI Stream).

## Formal Verification with Ghost Abstractions

Currently, I am actively working on **formally verifying** this systolic array implementation. You can check my [formal testbench here](https://github.com/abarajithan11/axis-systolic-array/blob/master/formal/tb_axis_sa.sv).

I'm using the ghost abstraction method. I leave two input matrices unconstrained, so the tool can verify for all inputs. At an arbitarily picked time, I wait for the current input packet to complete (`s_last_handshake`), then drive the selected input matrices on the slave side, after each handshake (`s_valid` is left arbitary). On the output side, I compare every beat of the data to the expected matrix and set a flag. The SVA basically says "If input was seen, then output must be seen within X clock cycles". There are a few fairness assumptions to prevent the tool from just holding `m_ready` down forever and giving a trivial counterexample.

## SoC Design Elements

I used DMAs and the Interconnet from Alex Forencich's [AXI repository](https://github.com/alexforencich/verilog-axi) to turn the AXI-Stream module into a full AXI module. I built a DMA controller for the four DMAs with a register bank that is written and read from the firmware. I have TCL scripts for Vivado to implement this on the FPGA, which I have tested on ZYNQ boards.

I then integrated this with Ibex-SoC to create a full SoC. The same C firmware compiles to RISC-V and runs on Ibex in simulation. 

I used my [FireBridge](/firebridge/) VIP to stress test the full AXI ports with real C firmware, emulating congestion.

**[GitHub - axis-systolic-array](https://github.com/abarajithan11/axis-systolic-array)**


