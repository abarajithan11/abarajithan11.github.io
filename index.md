---
layout: single
title: "Abarajithan Gnaneswaran"
permalink: /
classes: wide
author_profile: true
---

I am a PhD student in Kastner Research Lab @ UCSD CSE, focusing on hardware security and verification, building robust hardware/software co-designs, and accelerating AI/ML at the edge. Welcome to my personal blog, where I document my technical explorations, projects, and thoughts.

## Tech Stack

* **Languages:** SystemVerilog (RTL, DV, SVA), Python, C/C++, OpenCL, Bash, Tcl
* **EDA Tools:** AMD/Xilinx Vivado, Cadence Genus, Cadence Innovus, Synopsys Design Compiler
* **Verification:** Verilator, VCS, Xsim, Questa Formal, SymbiYosys, cocotb
* **Other:** Git, Docker, LaTeX, GitHub Actions

## Projects

* **[SoC Fuzzing Benchmark](/soc-fuzzing-benchmark/)**
  A framework to evaluate hardware verification methods by automatically injecting bugs into SoC IPs, providing a standardized testbed for fuzzers like Intel PreSiFuzz and RFuzz against industrial AXI cores.

* **[CGRA4ML](/cgra4ml/)**
  An open-source, automated framework for mapping DNNs from Python to custom parameterizable SystemVerilog CGRAs with C Firmware on FPGA and ASIC targets for scientific edge computing.
  
* **[FireBridge](/firebridge/)**
  A framework for transactional verification of AXI subsystems in SystemVerilog with real C firmware through DPI-C without simulating a CPU, enabling rapid FW/HW co-development.

* **[Formal AXI Verification Stack](/formal-axi/)**
  A reusable Formal VIP for AXI4 and AXI5 protocols and for complex IPs like interconnects being built and tested against both open-source and commercial tools.

* **[Formally Verified AXI Stream Systolic Array](/axis-systolic-array-testbed/)**
  A lightweight, highly parameterizable systolic array in SystemVerilog, integrated with Ibex-SoC via AXI DMAs, a custom DMA controller and corresponding C firmware. I'm currently formally verifying this using ghost abstractions.

## Publications

* **CGRA4ML: A Hardware/Software Framework to Implement Neural Networks for Scientific Edge Computing**. G Abarajithan, Z Ma, R Munasinghe, F Restuccia, R Kastner. *ACM Transactions on Reconfigurable Technology and Systems, 2026/2024.*
* **Tailor: Altering Skip Connections for Resource-Efficient Inference**. O Weng, G Marcano, V Loncar, A Khodamoradi, G Abarajithan, et al. *ACM Transactions on Reconfigurable Technology and Systems 17 (1), 1-23, 2024.*
* **Within-Camera Multilayer Perceptron DVS Denoising**. A Rios-Navarro, S Guo, G Abarajithan, K Vijayakumar, et al. *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops, 2023.*
* **Kraken: An Efficient Engine with a Uniform Dataflow for Deep Neural Networks**. G Abarajithan, CUS Edussooriya. *arXiv preprint arXiv:2112.02793, 2021.*
* **A mostly-online CAS teaching experience**. C Wijenayake, K Wickremasinghe, G Abarajithan, A Madanayake, et al. *2022 IEEE International Symposium on Circuits and Systems (ISCAS), 1783-1787, 2022.*
* **Machine Learning on Heterogeneous, Edge, and Quantum Hardware for Particle Physics (ML-HEQUPP)**. J Gonski, J Ott, S Abbaszadeh, S Addepalli, M Cremonesi, J Dickinson, et al. *2026.*

## Contact Me

<div class="contact-form-wrap">
  <form
    action="https://formspree.io/f/mjgapveo"
    method="POST"
  >
    <label>
      Your email:
      <input type="email" name="email">
    </label>
    <label>
      Your message:
      <textarea name="message"></textarea>
    </label>
    <button type="submit">Send</button>
  </form>
</div>