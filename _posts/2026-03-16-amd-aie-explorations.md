---
title: 'AI Engine Experiments'
date: 2026-03-16 20:40:00
categories:
  - 'Engineering'
  - 'My Work'
tags:
  - 'Technical Projects'
permalink: /amd-aie-explorations/
---

![]({{ site.content_base_url }}/images/2026/aie_tiles.png)

![]({{ site.content_base_url }}/images/2026/aie_wave.jpg)

AMD AI Engine development usually involves three pieces:

1. **Kernel code** (C++)
2. **Graph code** (C++ or Python)
3. **Host code** (C++ or Python)

For kernels, I have explored the lower-level side of the stack:

- **Intrinsics**: direct programming of AIE vector/MAC operations
- **APIs**: C++ wrappers around intrinsics from AMD

For graph design, the options are:

- **Vitis graph flow** in C++
- **MATLAB/Simulink-based flow**
- **IRON** in Python

## Early work: intrinsics + MATLAB

My first AIE experiments started with **intrinsics + MATLAB** in this repo: **[amd_aie_matlab](https://github.com/abarajithan11/amd_aie_matlab)**.

This repo includes small matrix/vector experiments such as `gemv`, `gemv_opt`, and `gemv_opt_i8`, along with MATLAB/Simulink files and AIE kernel code. The flow was simple: generate test data, run the model, and compare the simulated output against a golden result.

![]({{ site.content_base_url }}/images/2026/aie_autoenc_matlab.png)

That work later evolved into this repository where some undegrad students work on optimizing intrinsics for GEMV and GEMM: **[aie-intrinsics-nn](https://github.com/KastnerRG/aie-intrinsics-nn)**. This effort moved toward a more structured intrinsics-based workflow for small neural-network style building blocks. The focus was on reusable kernels and a clearer path from GemV-style experiments toward denser NN-style compositions.

## Lightweight backend work for hls4ml

The next step was this repo: **[hls4ml-backend](https://github.com/KastnerRG/hls4ml-backend)**, for mapping small neural-network style computations onto AIE as an effort to create a backend for the popular python based tool `hls4ml`. It includes quickstart and `run_workload.py`, serving as a sandbox for experimenting with how small physics NN layers could be laid out across AIE resources.

![]({{ site.content_base_url }}/images/2026/aie_stream_window.png)

## Teaching material

I also worked as a Teaching Assistant (TA) for the AI Engine portion of Ryan's **CSE237C** course. The public assignment and starter material are here:

- **[Assignment page](https://pp4fpgas.readthedocs.io/en/latest/project_aie.html)**
- **[Starter files](https://github.com/KastnerRG/Read_the_docs/tree/master/project_files/aie-project)**


This material introduces the AIE programming model through:

- host / graph / kernel separation
- IRON-based Python graph construction
- tiled matrix multiplication
- single-core and whole-array examples
- small NN-style exercises built from these pieces

The assignment code includes files like `basic_mm.py`, `matmul.cc`, `passthrough.py`, and `nn.py`.

![]({{ site.content_base_url }}/images/2026/aie_project.webp)
