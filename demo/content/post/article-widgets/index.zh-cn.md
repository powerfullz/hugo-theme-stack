---
title: 文章小组件示例：按钮与 CTA
date: 2026-02-27
description: 展示如何在文章中插入按钮与 CTA 区块。
categories:
    - Documentation
tags:
    - shortcode
    - widget
---

这篇文章演示两个基础小组件：`button` 和 `cta`。

<!--more-->

## 按钮（button）

普通按钮链接：

{{< button href="/page/about/" text="查看关于页面" />}}

外链按钮（自动新开标签页）：

{{< button href="https://gohugo.io/" text="访问 Hugo 官网" />}}

也可以用包裹写法：

{{< button href="/page/archives/" >}}查看归档{{< /button >}}

### 用法

```markdown
{{</* button href="/page/about/" text="查看关于页面" */>}}

{{</* button href="https://gohugo.io/" text="访问 Hugo 官网" */>}}

{{</* button href="/page/archives/" */>}}查看归档{{</* /button */>}}
```

## CTA（cta）

CTA 适合做“继续阅读 / 立即下载 / 订阅更新”这类引导。

{{< cta title="继续深入阅读" desc="如果你想继续了解 Stack 主题的更多能力，可以查看短代码与布局文档。" href="/post/shortcodes/" text="查看短代码文档" />}}

也支持在 CTA 内写一段补充说明：

{{< cta title="参与贡献" desc="欢迎提 Issue 或 PR。" href="https://github.com/CaiJimmy/hugo-theme-stack" text="前往 GitHub" >}}
你也可以先阅读项目结构与模板说明，再决定从哪一部分开始。
{{< /cta >}}

### 用法

```markdown
{{</* cta
    title="继续深入阅读"
    desc="如果你想继续了解 Stack 主题的更多能力，可以查看短代码与布局文档。"
    href="/post/shortcodes/"
    text="查看短代码文档"
*/>}}

{{</* cta title="参与贡献" desc="欢迎提 Issue 或 PR。" href="https://github.com/CaiJimmy/hugo-theme-stack" text="前往 GitHub" */>}}
你也可以先阅读项目结构与模板说明，再决定从哪一部分开始。
{{</* /cta */>}}
```
