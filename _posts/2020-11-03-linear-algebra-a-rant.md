---
title: 'Linear Algebra in our Education: A Rant'
date: 2020-11-03 00:00:00
last_modified_at: 2021-11-20 22:22:03
categories:
  - 'Other'
tags:
  - 'Thoughts'
permalink: /linear-algebra-a-rant/
---

Grade 8: Here is a matrix, just a few numbers in a box. You can add, subtract boxes. And you can multiply two boxes in this very complicated weird way. But why? DON'T ASK QUESTIONS. It's just the way it is. And wait, you can't divide those boxes.

Then come vectors in A/Ls, after years of struggling to multiply those stupid boxes. They actually show some geometric intuition of vectors. But they never connect the vectors to matrices.

Then, we have Linear algebra in Universities. "Transformation A applied to vector x is Ax. Here are a bunch of dry theorems about the composition, commutativity, and inversion of transformations."

This is outrageous. The whole point of a matrix is that it transforms a vector from one space to another. Nothing about matrices make sense without this fact. They should be introduced in ALs, after finishing vectors. Our math education is full of such examples of putting Descartes before the horse (got it?).

![]({{ site.content_base_url }}/images/2021/11/1010596732-disc001-file001-frame00180-size-original.jpg)

## Matrix Multiplication

Matrix multiplication ONLY makes sense with an understanding of dot products. Why are two boxes multiplied like that? Cuz those are two transformations and we want their product to be the resultant transformation. Why is a matrix inverse so weird? Because we are trying to find a matrix, when "applied" to the "output vector", that gives the "input vector"

[Embedded media](https://www.youtube.com/watch?v=XkY2DOUCWMU)

## Gaussian Elimination

Remember blindly adding rows and columns of a matrix to solve a set of equations? That has a beautiful intuition.

[Embedded media](https://www.youtube.com/watch?v=bnC848ie16Q)

## Eigen-what?

Eigenvectors and eigenvalues are typically introduced as "Yeah, someone calls this eigenvector and if we ask in the exam, this is how you should find it. That's all you need to know".

God, eigen-things are the fingerprint of any transformation (matrix).

1. A wavefunction (that gives all information about a particle -- electron) is the eigenfunction (eigenvector in discrete case) of its energy (I'm simplifying here. Check comments for details). This is what that scary Time Independent Schrodinger's Equation says.
2. PCA / SVD (statistics, ML) is basically decorrelating the data to extract the strongest features. Those decorrelated features and their strengths are the eigenvectors and eigenvalues of the data matrix. Your JPEG and MP4 files are made this way, by approximating the PCA of image blocks (KLT) by DCT or Wavelet transforms and storing only the strongest features.
3. Natural frequencies of a vibrating object are the eigenfrequencies (eigenvalues) are the natural frequencies the eigenvectors are the shapes of these vibrational modes. They allow decoupling of the differential equations.

## Okay, how do I develop intuition?

For those who are interested in a good intuition of Linear Algebra, the following playlist is the best:

[Embedded media](https://www.youtube.com/watch?v=videoseries)

First posted on Facebook: [facebook.com/abarajithan11/posts/10221074444962268](https://web.facebook.com/abarajithan11/posts/10221074444962268)

---

## Points from the discussion that followed

One major reason why the average student loses interest is putting the cart before the horse. Limits before differentiation...etc. Once we connect them to real-world applications and visualizations, they start paying attention.

For example, the first chapter (Atomic Structure) of AL chemistry was taught as a religion. Okay, students don't know enough math to understand quantum mechanics. But you can at least say "This is Schrödinger's equation. Can you see how this looks like the simple harmonic motion equation? That's because it is a simple harmonic motion, in 3D space, not in time. If we solve it in 1D, you get sinusoidal waves, in 2D, you get waves in a plate (still intuitive), in 3D, we get this. That are the atomic orbitals." This doesn't teach them anything about QM. It's a piece of trivia, which I'm sure most would find interesting and might kindle interest.

![]({{ site.content_base_url }}/images/2021/11/123507979_10221084996146041_411012220279237656_n.jpg)

Time independent Schrodinger's equation (solutions of which are the atomic orbitals) is an SHM in space

To nitpick:

The wavefunction is not necessarily an eigenfunction of the Hamiltonian. The more accurate word would be 'atomic orbital' or something similar. Wavefunctions (i.e. electron states) can be almost anything (are a much bigger class). A special few of them are eigenfunctions of the Hamiltonians. These few electron states (i.e. wavefunctions which are also eigenfunctions) have the special property that they have definite energy (which are the corresponding eigenvalues).

However, any wavefunction can be written as a linear combination of the eigenvectors (because of a special property of the Hamiltonian, which is not completely relevant here). In summary, if wavefunctions are vectors (say in 3D space), then the eigenfunctions are an orthonormal basis set. So you see, the error is just that you have written 'wavefunction' instead of 'orbital'. It's tiny, but it confused me at first glance.

See more in the comments: [facebook.com/abarajithan11/posts/10221074444962268](https://web.facebook.com/abarajithan11/posts/10221074444962268)
