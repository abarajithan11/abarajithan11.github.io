---
title: 'FireBridge: Verifying SoC Subsystems with Real Firmware Without Simulating a CPU'
date: 2026-11-10 20:00:00
categories:
  - 'Engineering'
  - 'My Work'
tags:
  - 'Technical Projects'
permalink: /firebridge/
---

![]({{ site.content_base_url }}/images/2026/firebridge.png)

Verifying hardware accelerators at the system level is a classic headache. We first verify the RTL design using transaction level testbenches, then write firmware to control them, then put them together on an FPGA and bang our heads wondering why they hang. Getting the firmware and hardware to work together often takes weeks of iterative debugging. On the other hand, simulating a full CPU + accelerator as an SoC takes forever.

I wanted to quickly co-develop SystemVerilog hardware and C firmware. This led me to build **FireBridge** as part of a **CGRA4ML** project. 

### Features of FireBridge

- Allows transactional verification of an SoC with real C firmware.
- Completely removes the need to simulate the entire CPU.
- Seamlessly integrates with Ibex and typical RISC-V toolchains.
- Supports randomized ready/valid throttling, which uncovers subtle corner cases.

### How to use

C Firmware:

```c
fb_reg_t *cfg0 = (fb_reg_t*)0xA0000000u;  // slave window 0
fb_reg_t *cfg1 = (fb_reg_t*)0xA1000000u;  // slave window 1

fb_write_reg(cfg0 + 1, 10); // write 10 to the 2nd register in slave 0
fb_write_reg(cfg1 + 5, 20); // write 20 to the 6th register in slave 1
```

SystemVerilog Testbench:

```verilog
module tb;
  localparam int S_COUNT = 2, M_COUNT = 2;

  // VIP -> DUT slave windows (MMIO)
  logic [S_COUNT-1:0][ID_W  -1:0] s_axi_awid;
  logic [S_COUNT-1:0][ADDR_W-1:0] s_axi_awaddr;
  ...
  // DUT masters -> VIP DDR
  logic [M_COUNT-1:0][ID_W  -1:0] m_axi_arid;
  logic [M_COUNT-1:0][ADDR_W-1:0] m_axi_araddr;
  ...

  // Two slave base addrs. Concatenation corresponds to indices [1], [0].
  localparam [S_COUNT-1:0][31:0] S_BASE = {
    32'hA100_0000,  // s=1 (window 1)
    32'hA000_0000   // s=0 (window 0)
  };

  fb_axi_vip #(
    .S_COUNT(S_COUNT),
    .M_COUNT(M_COUNT),
    .S_AXI_BASE_ADDR(S_BASE),
    ...
  ) FB (.*);

  my_ip DUT (
    .clk(clk), .rstn(rstn), ...
    .s_axi0_awaddr (s_axi_awaddr[0]), ...
    .s_axi1_awaddr (s_axi_awaddr[1]), ...
    .m_axi0_araddr (m_axi_araddr[0]), ...
    .m_axi1_araddr (m_axi_araddr[1]), ...
  );

  initial begin
    repeat (2) @(posedge clk);
    rstn = 1;
    wait (firebridge_done);
    $finish;
  end
endmodule
```

### Technical Details

I built an SV + C harness that behaves in simulation as an AXI Interconnect + CPU. The C firmware is compiled and executed in the host machine (x86). The register writes & reads are mapped to SV tasks that drive the AXI slave interfaces. The AXI master ports of the subsystem read/write from the host machine's DDR through C functions.

```c
#ifdef SIM
  extern void fb_task_write_reg(uint64_t addr, uint64_t data);
  extern void fb_task_read_reg(uint64_t addr);
  extern uint64_t fb_fn_read_reg(void);

  static inline fb_reg_t fb_read_reg(fb_reg_t *addr) {
    fb_task_read_reg((uint64_t)(uintptr_t)addr);
    return (fb_reg_t)fb_fn_read_reg();
  }
  static inline void fb_write_reg(fb_reg_t *addr, fb_reg_t data) {
    fb_task_write_reg((uint64_t)(uintptr_t)addr, (uint64_t)data);
  }
#else
  static inline fb_reg_t fb_read_reg(fb_reg_t *addr) {
    return *addr;
  }
  static inline void fb_write_reg(fb_reg_t *addr, fb_reg_t data) {
    *addr = data;
  }
#endif
```

I built a Makefile flow to make this setup work with XSim and Xcelium. The entire setup is also containerized in Docker for reproducibility.

### Problems Faced and Solved

A real CPU stalls and cache misses. While FireBridge doesn't model these exact CPU stalls, I implemented randomized delays and randomized ready/valid backpressure on the AXI channels. This ended up being far more effective at catching timing bugs in the DMA and Systolic Array than standard CPU execution.

Integrating the full Ibex SoC for final validation proved this approach. The design verified via FireBridge worked as is on the actual Ibex-driven SoC simulation, and on FPGA with ARM-based Zynq SoC.

You can check out the testbed and the code here: [GitHub](https://github.com/abarajithan11/axis-systolic-array/tree/master/firebridge)
