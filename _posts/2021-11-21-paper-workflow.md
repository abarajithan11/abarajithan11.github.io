---
title: 'My Paper-Writing Workflow [Inkscape, Python, Mendeley, VSCode, Git]'
date: 2021-11-21 06:32:20
last_modified_at: 2022-01-31 04:00:40
categories:
  - 'Other'
tags:
  - 'Technical Projects'
permalink: /paper-workflow/
---

![]({{ site.content_base_url }}/images/2021/11/53-3.png)

I'm quite used to LaTeX, thanks to our department encouraging students to make assignments and reports in LaTeX from the sophomore level. Through countless such submissions, I have tried multiple workflows: TexMaker, Overleaf, VSCode + Latex Workshop and more.

This year, I began writing my first paper (Kraken), targeting a journal. Since it was on my personal, passion project, wrote the entire paper, drew all diagrams, made all figures and revised it several times, before handing it over to my advisor, who reviewed it. Because this is my first paper, I wanted everything: the diagrams, graphs, their text styles and all to be perfect. I experimented and learned a lot on the way to craft my own workflow for this and my future publications.

[Kraken: An Efficient Engine with a Uniform Dataflow for Deep Neural Networks](https://arxiv.org/abs/2112.02793)

In a nutshell,

- I draw diagrams with Inkscape, save them as EPS (without text) + TEX (text only), such that text is rendered in latex for a uniform style.
- I use the python ecosystem to handle data. Pandas for spreadsheets, Matplotlib and Seaborn for beautiful plots. SciencePlots to conform to IEEE style.
- I manage my references with Mendeley, sync them across my devices. I use Resilo to sync my handwritten notes on papers between my tablet and laptop
- I write pure LaTeX with VSCode + LaTeX workshop, compile it with MiKTeX, version control everything with git and sync it to overleaf via GitHub for my supervisor.

## Drawings - Inkscape

Which one looks better?

![]({{ site.content_base_url }}/images/2021/11/Figure-8---conv_unit--2--1.png)

![]({{ site.content_base_url }}/images/2021/11/kraken-1.png)

LEFT: one I drew with draw.io for our patent, RIGHT: one I drew with Inkscape for my paper

Tools like [draw.io](https://app.diagrams.net/) lack precision. Also, the size and style of their fonts do not match the rest of the LaTeX text. Inkscape [[get]](https://inkscape.org/release/inkscape-1.1.1/) is a professional vector graphics tool, a fully-functional, lightweight, free and open-source alternative to Adobe Illustrator. Therefore, I learnt it to draw the two diagrams in the paper.

First, find the column/text width of your LaTeX document with **\the\columnwidth**in points (1 pt = 1/72.27 inch)*.* Then set the Inkscape canvas size in *File > Document Properties > Page > Custom Size.* You can create a grid, either rectangular or isometric, in *File > Document Properties > Grid*. You can start drawing with Bezier Curve tool [B], organize the drawing by layers...etc

### Adding Text

Text can be added in multiple ways using the Text tool [T]. You can simply add text, but that will get rendered with the image, resulting in any font/size you want. But I wanted the text to be rendered in LaTeX, such that it has uniform size and style, to match the rest of the document. For this, I type the text, with any required latex symbols as follows, and save a copy of the image as EPS+LaTeX. This creates an .eps file without text and a .tex file with text only. Make sure to keep the master copy of your drawing updated in the default SVG format (only save a copy in the EPS+TEX format) to avoid data loss.

![]({{ site.content_base_url }}/images/2021/11/11-1.png)

![]({{ site.content_base_url }}/images/2021/11/12.png)

(1) select the text, adjust the alignment. Inkscape has a bug here. You need to check few times that it is aligned correctly. (2) *File > Save a Copy > EPS > Omit Text in PDF*. This will create a pair of files.

Then add the tex file into your LaTeX document using either include or import:

![]({{ site.content_base_url }}/images/2021/11/13-1.png)

Since this renders text seperately, the text might have moved slightly. Make nessasary adjustments, and recheck the text alignment to make it work.

The first figure (this one) took me over 10 days to make. To learn inkscape from scratch, try like five different text insertion methods and finally get it right. The next figure (following one) took me just a few hours.

![]({{ site.content_base_url }}/images/2021/11/21.png)

## Line, bar, pie charts - Python Ecosystem

If you prefer Matlab, skip this. I, on the other hand, love the python stack. Numpy is the best in manipulating like 6,7-dimensional arrays, and the object-oriented and intuitive nature of python libraries make them a treat to use. I also found this awesome package: SciencePlots [[get]](https://github.com/garrettj403/SciencePlots), which works on top of other packages and makes IEEE & Science style plots with ease.

![]({{ site.content_base_url }}/images/2021/11/image-17.png)

![]({{ site.content_base_url }}/images/2021/11/image-18.png)

Science + Nature vs Science + IEEE styles

To build the spreadsheet, I populate a pandas dataframe with some regular python code. Yes, I had to spend a few days learning pandas for this, but it's a great investment. Then I use matplotlib to make plots and seaborn to make them prettier.

![]({{ site.content_base_url }}/images/2021/11/32.png)

![]({{ site.content_base_url }}/images/2021/11/31.png)

![]({{ site.content_base_url }}/images/2021/11/34.png)

![]({{ site.content_base_url }}/images/2021/11/33.png)

My code

![]({{ site.content_base_url }}/images/2021/11/35.png)

Drawings in my paper

## Reference Management - Mendeley

I had to read and summarize like hundred papers for a literature review. Keeping them organized is a nightmare with regular file manager. Which one do you prefer among the following?

![]({{ site.content_base_url }}/images/2021/11/41.png)

![]({{ site.content_base_url }}/images/2021/11/42.png)

![]({{ site.content_base_url }}/images/2021/11/43-1.png)

(1) Regular file manager (2,3) Mendeley

Mendeley is available on Web, Windows, Mac and iOS. It has tons of features, including the following.

- Add references as you browse the internet. Install the Mendeley extension and click it from arXiv, IEEE, ResearchGate, Springer, raw PDF...etc. It will fetch the data (author, journal, year, abstract, possibly pdf) and save it to its Web version. You can sync that to all your devices.
- Group by labels, sort by author/year...etc.
- Search within your references fast
- Highlight and add comments using the built-in PDF tool. You may take notes as well. Everything will be synced between all your devices.
- Easily export bibliography as LaTeX. Select a set of references, right-click, copy as BibTeX, then paste into your .bib file.

I summarize the papers into a Google / Online Excel Sheet, so my supervisor also can have a look.

![]({{ site.content_base_url }}/images/2021/11/51.png)

## Sync Handwriting between Tablet and PC

I prefer drawing on the papers and writing stuff on them with my Android tablet and pen. Mendeley does not work with Android and I'm not sure if its iOS version supports handwriting. Therefore, to sync documents, I use Resilio Sync. It can be installed in both PC [[get]](https://www.resilio.com/platforms/desktop/) and tablet [[get]](https://www.resilio.com/platforms/mobile/). Folders from the PC can be connected to those in the tablet, such that any changes made on either are reflected in another one within minutes.

I use Xodo [[get]](https://play.google.com/store/apps/details?id=com.xodo.pdf.reader&hl=en&gl=US), an excellent PDF manager on my tablet to draw on the papers. These then reflect in the PC (and within Mendeley).

![]({{ site.content_base_url }}/images/2021/11/43-2.png)

## Pure LaTeX, but faster! - VSCode

> "What's wrong with Overleaf?"   
> "Oh you're a simpleton happy with LyX!"

Nope, I write pure LaTeX. Overleaf is great, but I hate web-based tools. I prefer something local, more responsive (thanks to my shitty connection) and with proper version control. Since I wrote the entire journal paper alone, all 15 pages of it, and revised it like ten times, I had the freedom to develop my own workflow. When I finally passed it on to my supervisor for final revision, I synced it with Overleaf so he can work with it comfortably and his changes will be reflected in my local machine. To compile LaTeX locally, you need a compiler like MiKTeX: [miktex.org](https://miktex.org/).

### VSCode + Latex Workshop

Maintained by Microsoft, yet free and open-source, VSCode [[get]](https://code.visualstudio.com/download) is the best editor/IDE out there for almost any language, hands-down. Unless you are a vim user, of course. By installing the right extensions, you can make it into a super-powerful, IDE of any language. Latex Workshop [[get]](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop) is the extension we need. Coupled with VScode's native features, it provides a killer LaTeX experience. Check out some of its coolest features below. More features are listed [here](https://marketplace.visualstudio.com/items?itemName=James-Yu.latex-workshop). The theme I use is One Dark Pro Monokai Darker [[get]](https://marketplace.visualstudio.com/items?itemName=eserozvataf.one-dark-pro-monokai-darker).

![]({{ site.content_base_url }}/images/2021/11/53-2.png)

Multiple tabs, symbols pane, preview equations on hover, ultra-fast intelligent autocomplete, easy-on-eyes dark theme, pretty colors (theme can be chosen independently), seamless git

### Version Control - git

Git is a pain to a lot of people. It was the same to me, until mid-2020. When I was stranded in New Delhi due to COVID lockdowns amidst my solo backpacking, I started reading some books on git. Then I figured that it's what I have been missing all my life.

![]({{ site.content_base_url }}/images/2021/11/image-20.png)

Git is a version control tool. Basically, a time machine that helps you to move to any point in the development, compare two points (diff), manage them collaboratively...etc. It guarantees that "commits" (aka snapshots) of your folder are immutable and non-deletable, giving you the confidence to clean up your code and try new things after each commit.

It has a horrible interface. The commands barely make sense. But underneath, it has a beautiful data model. Once I understood that deeply, I was able to recall or google commands at will and use git like a pro. Now I'm addicted to the safety it provides. Even for a personal project, I start tracking it with git. Note, a git is a local tool. You don't need an internet connection to use it.

[An awesome MIT video that explains git beautifully. This video changed my life.](https://www.youtube.com/watch?v=2sjqTHE0zok)

[Version Control (Git)](https://missing.csail.mit.edu/2020/version-control/)

Okay, how do I use git for paper-writing? Well, simple. Once you understand git, start tracking all your TEX, EPS, SVG, BIB, python, ipynb files using git. You will feel confidence and power. When you add something and save (recompile) successfully, make a commit with an appropriate commit message (eg: "Modify table horz\_conv, to add circles around y").

### Overleaf Sync

Right, all good. But my supervisor is not familiar with git and Mendeley. What do I do? He is very familiar with overleaf though. So, I set up sync to overleaf via Github. I had to purchase a student account for $8/month.

First, create a GitHub repo (remote), connect overleaf to that empty repo, push your local repo to remote, then import changes into overleaf. When the supervisor changes something, I can push that from overleaf to GitHub and pull it into the local repo. Following is a tutorial

[How do I connect an Overleaf project with a repo on GitHub, GitLab or BitBucket?](https://www.overleaf.com/learn/how-to/How_do_I_connect_an_Overleaf_project_with_a_repo_on_GitHub%2C_GitLab_or_BitBucket%3F#:~:text=You%20can%20configure%20your%20Overleaf,Then%20follow%20the%20prompts.)

## Conclusion

Yeah, I had to learn 80% of this over several weeks to set up my workflow. But I believe this is a worthy investment, as I can continue to write future papers with this easily.

If you think I am taking this too far, here's what I aspire to be. This mathematics freshman takes lecture notes with LaTeX using vim (yep) while drawing all mathematical drawings in real-time (as the prof draws on blackboard) on Inkscape.

[How I’m able to take notes in mathematics lectures using LaTeX and Vim](https://castel.dev/post/lecture-notes-1/)
