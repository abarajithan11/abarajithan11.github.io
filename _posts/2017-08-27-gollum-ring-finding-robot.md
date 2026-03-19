---
title: 'Gollum - Ring Finding Robot: [GPS, obstacle avoiding, wall following, color detection, parallel alignment]'
date: 2017-08-27 00:00:00
last_modified_at: 2021-11-21 08:31:48
categories:
  - 'Projects'
tags:
permalink: /gollum-ring-finding-robot/
---

![]({{ site.content_base_url }}/images/2021/11/20170719_115907.jpg)

Through this project we built Gollum, an outdoor mobile robot to perform GPS following, obstacle avoiding, wall following, color detection, parallel alignment and robotic arm manipulation. I was responsible for designing the algorithm and programming the robot (1,200 lines of code)

Code: [github.com/abarajithan11/gollum-robot](https://github.com/abarajithan11/gollum-robot)

![]({{ site.content_base_url }}/images/2021/11/20170719_051255.jpg)

## Task:

The robot starts from within the starting circle of 1m in radius. Out of three pre-defined target locations, one location is chosen at random and give to us in the start. We input the target location using a keypad/set of 3 switches. The robot should the follow GPS and visit the target, which is 20m away. On the way, there is a "forest" of obstracles (30 cm cubes) which the robot should avoid. Target is marked by a circle of white line (3cm thickness) 2m in radius around the target point.

At the target point, lies a cylindar, 50cm in radius. The cyclindar has 40 cm wide entrance on one side.The robot should find the cylindar, move to meet it, follow the wall around it, find the entrance, move in. Inside the cylindar lies a 5 cm high, 40cm diameter plate that contains a metal ring og 6cm diameter anywhere in it. The robot should be able to search and pick up the ring with an arm.

Then then robot should return to the starting location and stop.

![]({{ site.content_base_url }}/images/2021/11/20170714_165003-2.jpg)

![]({{ site.content_base_url }}/images/2021/11/20170714_165459.jpg)

I took Gollum to one of my basic robotics workshop as an inspiration. Some school students mishandled him, he fell down and the perspex body was broken in half.

![]({{ site.content_base_url }}/images/2021/11/20170718_043006.jpg)

![]({{ site.content_base_url }}/images/2021/11/20170718_051529.jpg)

![]({{ site.content_base_url }}/images/2021/11/20170718_152055.jpg)

![]({{ site.content_base_url }}/images/2021/11/20170719_051246.jpg)

![]({{ site.content_base_url }}/images/2021/11/20170719_115814.jpg)

![]({{ site.content_base_url }}/images/2021/11/20170719_115907-1.jpg)


