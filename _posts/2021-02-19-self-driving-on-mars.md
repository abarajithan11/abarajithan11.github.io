---
title: 'Self Driving on Mars: Computer vision on Xilinx FPGAs'
date: 2021-02-19 00:00:00
last_modified_at: 2021-11-20 15:59:02
categories:
  - 'Other'
tags:
  - 'Thoughts'
permalink: /self-driving-on-mars/
---

![]({{ site.content_base_url }}/images/2021/11/mars-rover-pixl-sensor---nasa-.jpg)

Our final year project, my research area and my current job are centred around "Computer Vision on FPGA", which is a relatively new field. I'm super glad this field is gaining traction. Read on for some ExplainLikeImFive...

### Why computer vision?

Perseverance, the $2.7 billion, SUV sized rover that autonomously landed on Mars today does a lot of cool stuff. Since it takes over 5 minutes for signals to reach Mars, they cannot control it like flying an RC drone. Unlike previous rovers, this time the landing algorithm autonomously matched the images of the landing site for precise landing.  
  
Also, the rover is able to drive around by autonomously planning the path using CV algorithms and by processing other data. This makes it the fastest rover ever. With about 200m a day average speed.

### Why FPGAs?

Images are a bunch of large matrices. Computer vision is basically doing millions of repetitive calculations on them, to finally detect objects...etc. With normal CPUs with few big cores, this will take forever. So, we use GPUs, which have hundreds of tiny, dumb cores. But GPUs are power-hungry (gaming PCs serve a dual purpose as room heaters).  
  
Edge systems, like Mars rovers, are limited in power. So, RTL designers design custom digital circuits (verilog) to create hundreds of custom cores to parallelize their computations. Since we can optimize the cores to our particular need, the power consumption is super low.   
  
If you have enough demand, you can fabricate chips (ASIC) from these. When u make millions of chips (like those u put in mobile / computer), the per-chip price comes down to few dollars - super cheap. But since you don't make a million mars rovers, they put the custom circuit in a pre-built, reconfigurable canvas: an FPGA.  
  
Unlike Curiosity, Perseverance has a few Xilinx-made Virtex 5 FPGAs to perform all the CV needed for autonomous landing and self-driving. They can use the same chip to now do RGB images optimally, then change the circuit inside and do 3D images optimally. I'm glad to see this field is booming.  
  
Hardcore info: [fierceelectronics.com/electronics/nasa-mars-rover-perseverance-launches-thursday-to-find-evidence-life-red-planet](https://www.fierceelectronics.com/electronics/nasa-mars-rover-perseverance-launches-thursday-to-find-evidence-life-red-planet?fbclid=IwAR32GQkm1smKsisFtgK1ia9cgoybw8rUmjn9sUjUDqiix1u9P8VJ7pHWEr0)

First posted on Facebook: [facebook.com/abarajithan11/posts/10221852292447969](https://web.facebook.com/abarajithan11/posts/10221852292447969)
