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
  A standardized testbed to evaluate hardware fuzzers like Intel PreSiFuzz and RFuzz. Maps their bytestreams into AXI and test them on SoC IPs with automatically injected bugs.

* **[CGRA4ML](/cgra4ml/)**
  An open-source, automated framework for scientific edge computing. Maps DNNs from Python to custom, parameterizable SystemVerilog CGRAs with C firmware, targeting FPGAs and custom ASICs.
  
* **[FireBridge](/firebridge/)**
  A framework to enable rapid Firmware/Hardware co-development at the system-level. Bridges SystemVerilog AXI subsystems to real C firmware via DPI-C, without simulating a CPU.

* **[SystemVerilog Course for 300 students](/systemverilog-course/)**
  64-hour short course, collaborating with Synopsys, covering RTL design, randomized transactional testbenches, AXI protocol design, FPGA & ASIC flow labs.

* **[Formal AXI Verification Stack](/formal-axi/)**
  A reusable Formal VIP for AXI4 and AXI5 protocols and for complex IPs like interconnects being built and tested against both open-source and commercial tools.

* **[AXI Stream Systolic Array](/axis-systolic-array-testbed/)**
  A lightweight, highly parameterizable systolic array in SV, integrated with Ibex-SoC via AXI DMAs, a custom DMA controller, and corresponding C firmware. Currently being formally verified.

## Publications

* **[CGRA4ML: A Hardware/Software Framework to Implement Neural Networks for Scientific Edge Computing](https://dl.acm.org/doi/10.1145/3801097)**. G Abarajithan, Z Ma, R Munasinghe, F Restuccia, R Kastner. *ACM Transactions on Reconfigurable Technology and Systems, 2026/2024.*
* **[Within-Camera Multilayer Perceptron DVS Denoising](https://arxiv.org/abs/2304.07543)**. A Rios-Navarro, S Guo, G Abarajithan, K Vijayakumar, et al. *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops, 2023.*
* **[Kraken: An Efficient Engine with a Uniform Dataflow for Deep Neural Networks](https://arxiv.org/abs/2112.02793)**. G Abarajithan, CUS Edussooriya. *arXiv preprint arXiv:2112.02793, 2021.*

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