---
title: 'SystemVerilog Course at Scale'
date: 2026-03-15 20:45:00
last_modified_at: 2026-03-15 20:45:00
categories:
  - 'Teaching'
  - 'Projects'
tags:
  - 'Community Work'
  - 'Teaching'
  - 'SoC'
  - 'AXI'
permalink: /systemverilog-course/
---

![]({{ site.content_base_url }}/images/2026/sv_first_page.png)

In 2020 November, I conducted a free, open, and independent hands-on webinar.

- It was widely successful, with 170+ attending from 9 institutes in Sri Lanka, India, and Sweden.
- Zoom recording was downloaded over 2300 times.
- [Feedback](https://bit.ly/sv-feedback) about the [content, visuals](http://bit.ly/sv-slides), and teaching style was overwhelmingly positive.
- [GitHub Repo with example](https://github.com/SkillSurf/systemverilog)

I have iteratively delivered this course **3 times: in 2020, 2024, and 2025**.

![]({{ site.content_base_url }}/images/2026/sv_fir.png)

![]({{ site.content_base_url }}/images/2026/sv_p2s.png)


## The Story

When I TA'd for the digital design course in Sri Lanka, I noticed that several students find digital design counterintuitive. They approach HDLs with the software programming mindset, and write RTL code with a lot of nested in-conditions and convoluted state machines. In addition, our program does not teach an HDL explicitly but expects students to pick up from Verilog basics and learn as they go. As a result, many are unaware of the advanced features of SystemVerilog that make their lives easy by reducing bugs and saving time.

During COVID lockdowns, I started reading SystemVerilog books by Stuart Sutherland and Chris Spear on the language and took notes. When I returned, I rebuilt Kraken using the advanced features I had learned. I wanted to pass this knowledge on to the students. So, I picked this as the first topic of my initiative: Missing Semester, inspired by [MIT's namesake](https://missing.csail.mit.edu/2020/version-control/). 

Later, Kithmin and I delivered similar workshops in other areas like Robotics and Embedded Systems. Dr. Subodha joined us to make this into a standalone startup, delivering many more courses. We partnered with Synopsys for two of the iterations. They provided access to their tools and sent many of their engineers to get trained.

My goals for each course are:
- Little to no prerequisites (knowledge about logic gates should be enough)
- Content applicable for beginners to intermediate level
- Hands-on, with real world examples
- Concise, clean code
- Open-source tools (Icarus Verilog, Verilator)
- Interactive - students ask questions throughout the session

## Selected Feedback

The course received overwhelmingly positive feedback across all its iterations:

> "What I feel is that this session was the cream of the HDL extracted from internet and every references. If you can do this kind of dedications, it would really helpful for the new comers to the field."

> "The things I learned from this course - the insights, tactics, and guidance - felt more valuable than everything else I gained. Hats-off to the entire team... These kind of initiatives deserves to reach much more audience."

> "The course was very interesting, and I was a total beginner for the SystemVerilog. But, at the end with the help of the teachers and the instructors I was able to grab the content in my best. I am willing to join future courses and waiting for them."

## My Teaching Method

I structured the course into modular, hands-on labs with increasing complexity. For each circuit, I explained the background, the problem, how it is designed, then implementation and verification constraints. [GitHub Repo with example](https://github.com/SkillSurf/systemverilog)

#### Combinational Circuits
- **full_adder**: Introduces assignments, logic operators, assertions, and variables.
- **n_bit_adder**: Ripple carry adder showing parameters, `for` loops, and simple constraints (`std::randomize`).
- **alu**: ALUs with `signed` types, `if-else` vs `unique case`, and 4-state vs 2-state variables.
- **function_lut**: Demonstrates lookup tables, recursive functions, arrays, and synthesis impact.
- **decoder**: Streamlining a 435-line verbose instruction decoder into 95-lines utilizing "last assignment wins" feature of verilog.

#### Sequential Circuits
- **counter**: N-bit counters, synchronous active-high resets, and non-blocking assignments (`always_ff`).
- **fir_filter**: FIR filters, shift registers, retiming.

#### Advanced SoC & Interconnects
- **p2s**: Parallel-to-Serial converter with a simple state machine.
- **uart_rx & uart_tx**: UART modules with AXI-Stream interfaces to connect the outside world to the FPGA.
- **skid_buffer**: Breaking combinational paths in the `ready` of AXI-Stream interfaces.
- **matvec_mul**: Parameterized adder trees and 2D packed arrays representing matrix operations.
- **mvm_uart_system**: The final capstone system connecting a UART terminal (PC) to an AXI-Matrix Multiplier instantiated on an FPGA!

[Teaching Method](https://www.youtube.com/watch?v=Lr4yGma89oE)

## References

1. **RTL Modeling with SystemVerilog for Simulation and Synthesis: Using SystemVerilog for ASIC and FPGA Design** by Stuart Sutherland  
   Primary reference material I used for the slides. Especially for synthesizable RTL design features of SystemVerilog
2. **SystemVerilog for Verification: A Guide to Learning the Testbench Language Features** by Chris Spear  
   I referred to this to understand the simulation features (OOP, assertions) of SystemVerilog
3. **Zynq Training** by Mohammad S. Sadri [[YouTube playlist](https://www.youtube.com/playlist?list=PLLAhvA_pexcxXi9BDwja4Bd9t2aVeVPkK)]   
   Excellent guide on AXI4 protocol and SoC design with Vivado. Play at 1.25x speed
4. **Parallel Programming for FPGAs** by Ryan Kastner [[free download](https://github.com/KastnerRG/pp4fpgas/raw/gh-pages/main.pdf)]  
   Notes from UCSD (University of California San Diego) on parallelizing algorithms and implementing them with Vivado HLS (C-based HDL). I'm reading this now
5. **Computer Organization and Design:**   
   **The Hardware/Software Interface, RISC-V Edition** by David A Patterson  
   One of the most popular books. Especially on processor design. I haven't read it yet.


