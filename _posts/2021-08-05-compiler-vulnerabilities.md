---
title: 'How safe are our compilers?'
date: 2021-08-05 14:59:00
last_modified_at: 2022-01-19 02:35:26
categories:
  - 'Other'
tags:
  - 'Thoughts'
permalink: /compiler-vulnerabilities/
---

![]({{ site.content_base_url }}/images/2021/11/compiler-issues-compiler-t2mkn8.jpg)

An important argument placed against e-voting machines is that there is absolutely no way to prevent large-scale fraud. Even if the firmware is open-source, how do you verify it's the same code programmed into the machine? Even if it was compiled in front of your eyes, how do you know the compiler itself is safe?  
  
GCC, the most popular C/C++ compiler itself is actually written in C. Then how is it compiled? Using older versions of itself. This fact was used by Ken Thompson, the legend who designed and implemented UNIX, the OS on which Linux (hence all android phones, data centers, mars rovers) and macOS are built upon.  
  
When he wrote the 'login' program of UNIX (during early days), he put a backdoor for debugging purposes. That is, given his secret password, any UNIX machine would unlock. But anyone else who reads the source code of login would notice this and panic. So, he hid that backdoor in the compiler, such that if the login program is compiled, it would insert the backdoor into the binary (assembly), else it would compile other programs normally.   
  
But, wouldn't people read compiler's source code? For that, he first built the backdoor in the compiler roughly as follows. If future compiler code is given to the compiler, it would generate a binary for a rigged compiler with the above back door. Else, it would compile other programs normally.   
  
He then compiled the compiler into binary and then removed the backdoor from the compiler's source code. Now the backdoor is practically invisible. it only exists as 1s and 0s in the binary. Anyone who reads the source code of the compiler sees it's perfectly fine. But when they add features to future versions of compiler code & compile it with his rigged compiler, it generates a new, rigged compiler binary. When they compile the login source code with that rigged compiler in the future, it would place the back door into the login binary.   
  
Anyway, it was temporary, he never got caught and he revealed it when he received the Turing Award. However, this is an interesting phenomenon, and any kind of malware could be injected like this since we usually apt-get / download .exe of the compiler, which was in fact compiled by the older version of the same compiler.  
  
Btw, this is pretty common. Recently I heard from a podcast, that few years ago hackers infiltrated a company that makes network-security software. They injected their virus into their development toolchain. In the next release, that got into the software and was distributed to all their customers, who are big software companies and the US govt itself. It was found months later.

[Strange Loops: Ken Thompson and the Self-referencing C Compiler | ScienceBlogs](https://scienceblogs.com/goodmath/2007/04/15/strange-loops-dennis-ritchie-a)

#### First posted on Facebook:

[Abarajithan Gn](https://web.facebook.com/abarajithan11/posts/10223048594314768)
