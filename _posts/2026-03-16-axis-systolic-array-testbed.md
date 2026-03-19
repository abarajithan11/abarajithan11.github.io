---
title: 'AXI-Stream Systolic Array → SoC Testbed'
date: 2025-12-10 20:15:00
categories:
  - 'Projects'
tags:
  - 'SoC'
  - 'AXI'
permalink: /axis-systolic-array-testbed/
---

![]({{ site.content_base_url }}/images/2026/axis-sa.png)

I built this during my [CGRA4ML project](/cgra4ml/). I created many SoC integration & verification methods to get CGRA4ML working, and I wanted to reuse that on many of my own projects and my friends' projects. So I extracted the SoC-specific parts and created this testbed. As a simple, yet usable core IP, I created a systolic array that performs matrix multiplication.

## Features

- Currently being formally verified.
- Fully parameterized AXI-Stream Systolic Array that performs (`y = k.T @ x + a`).
- Configurable AXI memory ports (up to 4 `M_AXI` interfaces and 1 `S_AXIL`).
- Custom DMA controller with a register bank custom-mapped to firmware.
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

Since the dataflow is quite delicate, I used my custom [SystemVerilog AXI-Stream VIP](/reusable-axis-vip/) to verify the AXI-Stream IP with transaction-level randomized verification. This stress-tests the design with highly randomized backpressure, randomly dropping `tready` and inserting arbitrary gaps in `tvalid`.

I then built my [FireBridge VIP](/firebridge/) around this, to do stress testing with real C firmware, emulating congestion in the full AXI ports (not just AXI Stream).

## Formal Verification with Ghost Abstractions

Currently, I am actively working on **formally verifying** this systolic array implementation. You can check my [formal testbench here](https://github.com/abarajithan11/axis-systolic-array/blob/master/formal/tb_axis_sa.sv).

I'm using the ghost abstraction method. I leave two input matrices unconstrained, so the tool can verify for all inputs. At an arbitrarily picked time, I wait for the current input packet to complete (`s_last_handshake`), then drive the selected input matrices on the slave side, after each handshake (`s_valid` is left arbitrary). On the output side, I compare every beat of the data to the expected matrix and set a flag. The SVA basically says "If input was seen, then output must be seen within X clock cycles". There are a few fairness assumptions to prevent the tool from just holding `m_ready` down forever and giving a trivial counterexample.

## SoC Design Elements

I used DMAs and the interconnect from Alex Forencich's [AXI repository](https://github.com/alexforencich/verilog-axi) to turn the AXI-Stream module into a full AXI module. I built a DMA controller for the four DMAs with a register bank that is written and read from the firmware. I have TCL scripts for Vivado to implement this on the FPGA, which I have tested on ZYNQ boards.

I then integrated this with Ibex-SoC to create a full SoC. The same C firmware compiles to RISC-V and runs on Ibex in simulation. 

I used my [FireBridge](/firebridge/) VIP to stress test the full AXI ports with real C firmware, emulating congestion.

## Fixing the SoC Deadlock due to Circular Dependency

I faced an AXI deadlock problem during Ibex integration. The systolic array does `y = k@x + a`, on 3 input matrices. All 4 interfaces are AXI-Stream (3 slaves, one master). I put 4 AXI DMAs on them, which gave 4 AXI masters. Then I used a crossbar across them to unify the 4 masters into one master, and connected that to the memory slave. I set the burst length to 1.

During simulation, the k-DMA kept sending requests, the crossbar kept sending that to the slave. At some point, the k-AXI-Stream got stalled by the SA, because the SA didn't have the a-stream, because the single AXI port was being used by the k-DMA. So now, the k-DMA cannot push data into the stream. But the slave was responding with rdata for its requests, and it cannot accept them. So the crossbar is stalled, waiting for the k-AXI port to accept the slave's responses before switching to another master. This is a deadlock because of this circular dependency.

One way to temporarily solve it is by using FIFOs of appropriate length on the AXI port. But that does not work when the matrix sizes and lengths of AXI packets are dynamic.

The real bug was that Alex Forencich's DMA was pre-fetching requests without having enough buffer to hold the responses of its outstanding requests when the output stream stalls. Fixing this within the IP is non-trivial, so I implemented a patch by gating the DMA's request port using the `ready` from the stream side. When the systolic array pulls `ready` down, the DMA thinks the crossbar has also pulled `arready` down and the crossbar thinks DMA has pulled `arvalid` down. This worked, although it is not strictly AXI compliant in a way where `valid` has to be held stable during an `arready` stall.

**[GitHub - axis-systolic-array](https://github.com/abarajithan11/axis-systolic-array)**


