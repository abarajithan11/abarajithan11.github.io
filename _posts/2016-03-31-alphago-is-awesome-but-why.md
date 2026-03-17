---
title: 'AlphaGo is Awesome! But Why?'
date: 2016-03-31 00:00:00
last_modified_at: 2021-11-21 02:11:37
categories:
  - 'Other'
tags:
  - 'Thoughts'
permalink: /alphago-is-awesome-but-why/
---

![]({{ site.content_base_url }}/images/2021/11/mar16-18-515343878-03.jpg)

[Embedded media](https://www.youtube.com/watch?v=WXuK6gekU1Y)

The main difference between go and other complex games like chess is, all other games have some way of calculating the winning probability in the middle of the game. Because all these games have too many possibilities to be solved by brute force, a computer always NEEDs such an algorithm to find that rough probability and make the next move. In chess, one such algorithm is, we can add up the weighted values of each player's pieces present on board and calculate a winning probability (this is not 100% accurate, but it is fairly accurate, it seems). Then we can code the program to follow that path.

But that is impossible in go. They say, at the middle of a go game between two experts, even other experts who look at the board cannot predict the outcome of the game! Means, there's absolutely no way known to man to find the probability in the mid of the game. The probability doesn't depend on number of coins or territory or anything. It depends on the emerging pattern, or relative positions of coins.

Because no human knows how to predict this, there's really no way to code the program about how to win in go. Solution? Alphago developers chose to use deep learning and reinforcement learning here. Feed the computer with thousands of well played go games and let the computer play with itself to create millions of more games. Now the computer analyses all the games, finds patterns and by itself "discovers" an algorithm to find the winning probability at the middle of a game. Note that this algorithm is NOT KNOWN to any man, not even to the developers. Now, a simple program can use this new algorithm to make moves and win at go against any human.

This shows why Alphago is more powerful than the professional go players and how it came up with that seemingly beautiful move. Alphago learnt just like a man, by observing more and more games, it got an idea, then by practicing the game over and over agn, by learnin frm mistakes, it became an expert. And because the program can play a game millions of times faster than a human, Alphago is now like a man who has practiced go day and night for thousands of years.

After all, practice makes a perfect AI. :-D

Thanks to Ruwantha for computerphile video. Gotta watch more now.

[Embedded media](https://www.youtube.com/watch?v=5oXyibEgJr0)

First posted on Facebook: [facebook.com/abarajithan11/posts/10207771021945007](https://web.facebook.com/abarajithan11/posts/10207771021945007)
