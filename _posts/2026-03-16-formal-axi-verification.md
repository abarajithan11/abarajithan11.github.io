---
title: 'Building a lightweight formal AXI verification stack'
date: 2026-03-16 20:05:00
categories:
  - 'Engineering'
  - 'My Work'
tags:
  - 'Technical Projects'
permalink: /formal-axi/
---

![]({{ site.content_base_url }}/images/2026/axi.png)

A standard AXI interface has 5 channels, each with its own handshake protocol and inter-channel dependencies. It's incredibly easy to write a memory-mapped component that works 99% of the time, only to fail when a write response channel stalls irregularly or a read transaction is interleaved differently.

- Reusable formal checkers for AXI4, focusing on protocol properties and channel interactions.
- A formally proven Synchronous FIFO and Skid Buffer as foundational building blocks.
- Compatibility with open-source tools like SymbiYosys (SBY) as well as commercial tools like Questa Formal.

## Technical Details

AXI has both intra-channel rules and inter-channel rules. For example,

* Intra-channel: `araddr` should remain stable during a stall (when `ar_valid` && !`ar_ready`)
* Inter-channel: For narrow bursts, `wstrb` in each beat should match the `awlen`, `awsize`, `awburst` and `awaddr` of the corresponding `aw` beat.

Writing intra-channel SVAs are pretty easy, which I've already done. For inter-channel properties, we need to match the corresponding beats & packets between channels. I'm working on a FIFO abstraction to do this with minimal overhead. [GitHub - formal_fifo](https://github.com/abarajithan11/formal_fifo)

#### Package with properties

```verilog
  // pkg_axi_fvip.sv
  property stable_next_when(when_cond, signal);
    when_cond |=> $stable(signal);
  endproperty

  property burst_no_4kb_cross(valid, burst, addr, len, size);
    valid && burst == BURST_INCR |->
      (addr >> 12) == (end_byte(addr, len, size) >> 12);
  endproperty
```

#### Sub-FVIP for AR channel

```verilog
  // ar_fvip.sv

  `ifdef AXI_FVIP_SLAVE_AR
    `define ASSUME assert
    `define ASSERT assume
  `else
    `define ASSUME assume
    `define ASSERT assert
  `endif

  default clocking cb @(posedge clk); endclocking
  default disable iff (!rstn);
  wire stall = ar_valid && !ar_ready;
  wire hsk = ar_valid && ar_ready;

  a_addr_stall_stable:
    `ASSUME property (stable_next_when(stall, ar_addr));
  a_burst_no_4kb_cross:
    `ASSUME property (burst_no_4kb_cross(ar_valid, ar_burst, ar_addr, ar_len, ar_size));
```

#### Full AXI FVIP that can switch between master and slave

```verilog
  `ifdef MASTER
    `define AXI_FVIP_MASTER_AR
    `define MODNAME_AXI m_axi_fvip
    `define MODNAME_AR  m_ar_fvip
  `else
    `define AXI_FVIP_SLAVE_AR
    `define MODNAME_AXI s_axi_fvip
    `define MODNAME_AR  s_ar_fvip
  `endif
  `include "ar_fvip.sv"

  `MODNAME_AR #(
    .ADDR_W(ADDR_W), 
    .DATA_W(DATA_W), 
    .ID_W(ID_W), 
    .USER_W(USER_W), 
    .AXI_MAX_STALL_ENV(AXI_MAX_STALL_ENV), 
    .AXI_MAX_STALL_DUT(AXI_MAX_STALL_DUT)
    ) u_ar (.*);
```

#### User's testbench

```verilog
  `define MASTER
  `include "axi_sva/our/axi_fvip.sv"
  `undef MASTER

  `define SLAVE
  `include "axi_sva/our/axi_fvip.sv"
  `undef SLAVE
```

Code: [GitHub - formal_axi](https://github.com/abarajithan11/formal_axi)
