---
layout: single
title: "Abarajithan Gnaneswaran"
permalink: /
classes: wide
author_profile: true
---

I am a PhD student in Kastner Research Lab @ UCSD CSE, focusing on hardware security and verification, building robust hardware/software co-designs, and accelerating AI/ML at the edge. Welcome to my personal blog, where I document my technical explorations, projects, and thoughts.

## Tech Stack

* **Languages:** SystemVerilog (RTL, DV, SVA), Python, C/C++, Bash, Tcl
* **EDA Tools:** AMD/Xilinx Vivado, Cadence Genus, Cadence Innovus, Synopsys Design Compiler
* **Verification:** Verilator, VCS, Xsim, Questa Formal, SymbiYosys, cocotb
* **Other:** Git, Docker, LaTeX, GitHub Actions

## Projects

* **SoC Fuzzing Benchmark:**
  A standardized testbed to evaluate hardware fuzzers like Intel PreSiFuzz and RFuzz. Maps their bytestreams into AXI and test them on SoC IPs with automatically injected bugs. **[[more...]](/soc-fuzzing-benchmark/)**

* **CGRA4ML:**
  An open-source, automated framework for scientific edge computing. Maps DNNs from Python to custom, parameterizable SystemVerilog CGRAs with C firmware, targeting FPGAs and custom ASICs. **[[more...]](/cgra4ml/)**
  
* **FireBridge:**
  A framework to enable rapid Firmware/Hardware co-development at the system-level. Bridges SystemVerilog AXI subsystems to real C firmware via DPI-C, without simulating a CPU. **[[more...]](/firebridge/)**

* **SystemVerilog Course for 300 students:**
  64-hour short course, collaborating with Synopsys, covering RTL design, randomized transactional testbenches, AXI protocol design, FPGA & ASIC flow labs. **[[more...]](/systemverilog-course/)**

* **Lightweight Formal AXI VIP:**
  A reusable Formal VIP for AXI4 and AXI5 protocols and for complex IPs like interconnects being built and tested against both open-source and commercial tools. **[[more...]](/formal-axi/)**

* **AXI Stream Systolic Array:**
  A lightweight, highly parameterizable systolic array in SV, integrated with Ibex-SoC via AXI DMAs, a custom DMA controller, and corresponding C firmware. Currently being formally verified. **[[more...]](/axis-systolic-array-testbed/)**

## Publications

* CGRA4ML: A Hardware/Software Framework to Implement Neural Networks for Scientific Edge Computing. **G Abarajithan**, Z Ma, R Munasinghe, F Restuccia, R Kastner. *ACM Transactions on Reconfigurable Technology and Systems, 2026/2024.* **[[link]](https://dl.acm.org/doi/10.1145/3801097)**
* Within-Camera Multilayer Perceptron DVS Denoising. A Rios-Navarro, S Guo, **G Abarajithan**, K Vijayakumar, et al. *Proceedings of the IEEE/CVF Conference on Computer Vision and Pattern Recognition Workshops, 2023.* **[[link]](https://arxiv.org/abs/2304.07543)**
* Kraken: An Efficient Engine with a Uniform Dataflow for Deep Neural Networks. **G Abarajithan**, CUS Edussooriya. *arXiv preprint arXiv:2112.02793, 2021.* **[[link]](https://arxiv.org/abs/2112.02793)**

## Contact Me
{: #contact-me }

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
