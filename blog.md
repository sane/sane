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
        {% if post.content contains "<!-- more -->" %}
          {{ post.content | split:"<!-- more -->" | first % }}
        {% else %}
          {{ post.content | strip_html | truncatewords: 90 }}
        {% endif %}
      </div>
      <p class="read-more"><a href="{{ site.baseurl }}{{ post.url }}" class="read-more">Read More...</a></p>
    </article>
  {% endfor %}
</div>