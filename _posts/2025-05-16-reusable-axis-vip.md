---
title: 'Reusable AXI-stream verification IPs in SystemVerilog'
date: 2025-05-16 20:25:00
categories:
  - 'Projects'
tags:
  - 'SoC'
  - 'AXI'
permalink: /reusable-axis-vip/
---

![]({{ site.content_base_url }}/images/2026/axis.svg)

AXI Stream is my favorite protocol for custom designs. It's dead simple (just `tvalid` and `tready`), yet can be made extremely performant and flexible. There are also several open source DMAs to bridge full AXI and AXI Stream, allowing quick SoC deployment.

Before integrating a DMA, we need to verify our IP follows AXI Stream perfectly. Transaction level testbenches with randomized drivers and monitors are the way to go. Building this for every IP is pretty repetitive. I built this VIP to make it modular, clean, and highly reusable.

## Features

- Configurable AXI-Stream Source and Sink blocks.
- Simple API (`file_tb` and `nofile_tb` examples provided).
- Queues-based abstraction: simply push or pop data arrays into the VIP and let it handle the bus signaling.
- Built-in randomization of valid/ready backpressure signals and `s_last`, `s_keep` assertions.
- Functions to easily load from or dump out to text/binary test vector files.

## Technical Details

I have two SV modules: Sink and Source. I pass in SystemVerilog queues containing the packets to be driven, and a task runs an infinite loop pushing data synchronously to the clock. I injected parameterized probabilities for stalling the interface (randomized `tvalid` gaps, randomly de-asserting `tready`). 

```verilog
  task automatic axis_push_packet(input logic signed [WORD_W-1:0] packet [$]);
    int total_words = packet.size();
    int n_beats = `CEIL(total_words, WORDS_PER_BEAT);
    int i_words = 0;

    for (int ib=0; ib < n_beats; ib++) begin
      // Between beats: keep outputs deasserted in the next cycle
      s_valid_d = 0; s_last_d = 0; s_keep_d = '0; s_data_d = 'x;

      // Random wait to inject tvalid gaps (simulating partial starvation)
      while ($urandom_range(0,99) >= PROB_VALID) @(posedge clk);
      
      // Assign payload structure
      s_valid_d = 1;
      s_last_d  = (ib == n_beats-1);
      
      // ... payload assignment ...
      
      // Wait for handshake (AXI protocol)
      @(posedge clk); 
      while (!s_ready) @(posedge clk);
    end
  endtask
```

Getting it to work without #1ps delays, on Verilator, Icarus and Xsim was a pain. But it was a one-time pain, and now I reuse this everywhere.

Repo: [GitHub - axis_vip](https://github.com/abarajithan11/axis_vip)
