---
layout: single
title: "About"
permalink: /about/
author_profile: true
---

Hi! I’m Abarajithan Gnaneswaran (Aba), a PhD candidate in Computer Engineering at UC San Diego. 
I build parameterized RTL subsystems (AXI SoCs, DMA controllers, accelerators) and work on end-to-end SoC integration across FPGA + ASIC flows. 
My current research develops Hyperflow-guided hardware security fuzzing with information-flow tracking to expose vulnerabilities in out-of-order CPUs and SoC fabrics.

## Research interests
- Digital design & verification (RTL → integration → verification)
- SoC systems engineering (AXI, DMA, interconnects, accelerators)
- Hardware security (fuzzing, info-flow, microarchitectural states)

## Current projects
### Hyperflow-guided hardware fuzzing (in progress)
- Extracts signal connectivity and flow conditions from RTL as **Hyperflow graphs**
- Combines **static graph structure** with **dynamic information-flow tracking** to measure progress and guide fuzzing
- Develops security metrics (connectivity/proximity, path activation, local information-flow rate) to steer toward rare states and asset→sink flows
- Evaluating on open-source OoO CPUs and SoC security IPs

### CGRA4ML — hardware/software workflow for DNNs on edge platforms
- Full-stack workflow: **Python library + SystemVerilog hardware + TCL flows + C runtime**
- Python front-end to build/train models, run fixed-point inference, and generate SV/TCL/C headers
- Parameterized, dynamically reconfigurable AXI compute engine (SV) with FPGA and ASIC flows
- Integrated into an SoC platform and runs end-to-end firmware control
- Reported targets: **250 MHz on FPGA (ZCU104)** and **~1 GHz on 65 nm LP**

### FireBridge — AXI subsystem testbed (SV + C + TCL)
- Compact AXI-Stream systolic-array accelerator with RTL DMAs + controller
- Packaged as a highly-parameterized SystemVerilog IP with multiple AXI master ports and a matching C driver/firmware stack
- Enables running “real firmware” and generating randomized transaction traffic **without simulating a full CPU** for faster iteration
- Integrated end-to-end with a RISC-V SoC platform; automated board packaging via TCL

### YOLOv2 object detection for road-traffic control (FPGA + ARM PSoC)
- FPGA/ARM Zynq deployment with accelerator for convolution layers
- Built vehicle tracking + traffic metrics (flow, speed, headway) and signal-timing optimization
- Awarded **gold (national)** and **silver (Asia-Pacific ICT Awards)**

## Education
- **PhD, Computer Engineering** — UC San Diego (Sep 2022 – 2027, anticipated)  
  Coursework includes computer architecture, VLSI flow, low-power VLSI for ML, UVM, and HLS.
- **BSc, Electronics & Telecom Engineering (First Class Honors)** — University of Moratuwa, Sri Lanka (Dec 2015 – Feb 2020)  
  GPA: 3.92/4.2 (≈ 3.86/4.0)

## Industry experience
- **AMD (San Jose)** — R&D Intern (Jun 2024 – Sep 2024)  
  Benchmarked/prototyped runtime mechanisms for partially switching AI Engine dataflow configurations; profiled bottlenecks across HW/SW.
- **Qualcomm (San Diego)** — Interim Intern, GSoC Integration (Jun 2023 – Sep 2023)  
  Feasibility analysis for migrating SoC IP from AHB to a proprietary serialized bus; designed a parameterized software interface IP with NoC bridge + automation; tested with UVM VIPs.
- **Lemurian Labs (Canada)** — RTL Design Engineer, R&D (Dec 2020 – Aug 2022)  
  First hire; designed the foundational compute core for ML acceleration with a novel arithmetic system; collaborated closely with PD + DV teams.
- **CSIRO (Australia)** — R&D Intern (Jul 2018 – Dec 2018)  
  Built an end-to-end pipeline to train DNNs on a supercomputer, optimize with TensorRT, and deploy on an NVIDIA Jetson TX2 robot (ROS), as early work for DARPA SubT.

## Publications
- **Within-Camera Multilayer Perceptron DVS Denoising** — CVPR Workshops (2023)  
- **Tailor: Altering Skip Connections for Resource-Efficient Inference** — ACM TRETS (2023)

## Teaching & talks
- **SystemVerilog for ASIC/FPGA Design & Verification** (2021, 2023, 2025) — 64-hour hands-on short course; 271 participants across 13 countries
- **A Hands-on Introduction to Computer Architecture** (2025–ongoing) — builds a single-cycle RISC-V CPU, then pipelines + forwarding; FPGA implementation
- **Modern C++: Clean & Performant Code** — talk in workshops & university short courses

## Skills
- **Platforms:** Chipyard, BOOM/SonicBOOM, FuseSoC, Ibex-SoC, Caliptra  
- **Digital design:** SystemVerilog, TCL, Cadence Genus/Innovus, Xilinx Vivado/Vitis  
- **Verification:** Verilator, VCS, Xcelium, Cocotb  
- **Software:** C/C++, Docker, Git, GitHub Actions, LaTeX  
- **ML/AI:** QKeras, PyTorch, TensorFlow/Keras, TensorRT (C++/Python)

## Contact
- Email: agnaneswaran@ucsd.edu
- GitHub: [github.com/abarajithan11](http://github.com/abarajithan11)
- LinkedIn: [linkedin.com/in/abarajithan11](http://linkedin.com/in/abarajithan11)
- Blog: [aba-blog.xyz](http://aba-blog.xyz)
