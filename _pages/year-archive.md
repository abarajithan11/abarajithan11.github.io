---
title: "All Posts"
permalink: /posts/
layout: single
author_profile: true
classes: wide
---

{% assign posts_by_year = site.posts | group_by_exp: "post", "post.date | date: '%Y'" %}

{% for year in posts_by_year %}
  <section class="year-archive-section">
    <h2 class="year-archive-heading">{{ year.name }}</h2>
    {% include post-grid.html posts=year.items %}
  </section>
{% endfor %}
