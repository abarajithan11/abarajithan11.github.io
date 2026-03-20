---
title: "How GPT works: 15-minute intuition"
date: 2024-02-20 22:11:27 -0800
last_modified_at: 2024-02-20 22:11:27 -0800
categories:
  - "Other"
tags:
  - "Thoughts"
---

Karpathy was an OpenAI co-founder and the Tesla autopilot vision team lead. Between Tesla and OpenAI, he released this gem of a guide.

## Key Takeaways
- Attention is a communication mechanism. Each token (sub-word) "searches" for information from the past. It says something like "I am a vowel, looking for consonants, in these positions"
- This happens in a data-dependent manner
- You can chop any data (images, sounds...) into chunks, mark the positions, and feed into the same architecture and it works
- GPT is a decoder model. It doesn't have memory or internal state. It only looks at a fixed context of input to generate outputs. GPT-4 Turbo takes in 128k input tokens and only looks at those.

## Why the transformer architecture matters
- It can "learn" during inference
- The architecture has not changed much in the past 6 years, since the 2017 "Attention is All You Need". Many are trying to improve it, but it has remained resilient.

[My simplified code](https://github.com/abarajithan11/nanoGPT)

![]({{ site.content_base_url }}/images/2026_from_fb/nanoGPT.png)
