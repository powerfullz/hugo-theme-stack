---
title: Shortcodes
date: 2026-01-26
description: Sample article showcasing various shortcodes supported by Stack theme.
categories:
    - Documentation
tags:
    - shortcodes
    - privacy
---

Stack theme also provides some custom shortcodes to enhance your content.

<!--more-->

## Quote

The `quote` shortcode allows you to display a quote with an author, source, and URL.

{{< quote author="A famous person" source="The book they wrote" url="https://en.wikipedia.org/wiki/Book">}}
Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
{{< /quote >}}

### Usage

```markdown
{{</* quote author="Author Name" source="Source Title" url="https://example.com" */>}}
Quote content here.
{{</* /quote */>}}
```

## Video

The `video` shortcode allows you to embed self-hosted or remote video files.

{{< video src="https://www.w3schools.com/html/mov_bbb.mp4" >}}

### Usage

```markdown
{{</* video src="https://example.com/video.mp4" */>}}
```

## Bilibili

Embed videos from Bilibili. Supports both `av` and `bv` IDs.

{{< bilibili "BV1634y1t7xR" >}}

### Usage

```markdown
{{</* bilibili "BV1634y1t7xR" */>}}
```

## YouTube

Hugo's built-in YouTube shortcode.

{{< youtube ZJthWmvUzzc >}}

### Usage

```markdown
{{</* youtube ZJthWmvUzzc */>}}
```

## Tencent Video

Embed videos from Tencent Video.

{{< tencent "u00306ng962" >}}

### Usage

```markdown
{{</* tencent "u00306ng962" */>}}
```

## GitLab Snippet

Embed snippets from GitLab.

{{< gitlab 2349278 >}}

### Usage

```markdown
{{</* gitlab 2349278 */>}}
```

## GitHub Repo Card

Show a repository card with build-time fetched GitHub metadata.

{{< github-repo repo="solstice23/argon-theme" variant="full" description="Argon - 一个轻盈、简洁的 WordPress 主题" homepage="https://archive-blog.s23.moe" stars="5465" forks="620" >}}

{{< github-repo repo="solstice23/hexo-theme-argon" variant="compact" description="Argon-Theme 的 Hexo 移植版" stars="321" >}}

### Usage

```markdown
{{</* github-repo repo="owner/name" variant="full" */>}}
{{</* github-repo repo="owner/name" variant="compact" */>}}
```

## Diagrams

Stack supports [Mermaid](https://mermaid.js.org/) diagrams out of the box.

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```

### Usage

Wrap your Mermaid code in a code block with the language set to `mermaid`.

<pre><code>```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```</code></pre>
