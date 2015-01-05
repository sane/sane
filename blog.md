---
layout: default
title: Blog
permalink: /blog/
---

<link  href='/stylesheets/blog.css' rel='stylesheet'>

{% include recent-posts-sidebar.html %}
<div class="content posts">
  {% for post in site.posts %}
    <article class="post">    
      
      <h1><a href="{{ site.baseurl }}{{ post.url }}">{{ post.title }}</a></h1>

      <div class="entry">
        {{ post.content | truncatewords: 90}}
      </div>
      <br>
      <br>
      <a href="{{ site.baseurl }}{{ post.url }}" class="read-more">Read More...</a>
    </article>
  {% endfor %}
</div>