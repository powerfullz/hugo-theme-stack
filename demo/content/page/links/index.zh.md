---
title: "链接"
layout: links
menu:
    main:
        weight: -50
        params:
            icon: link
comments: false
---

要使用此功能，请在页面 front matter 中添加 `layout: links`，然后在同一页面 bundle 目录下创建 `links.<语言>.json` 文件。

## 分类格式（推荐）

使用对象格式，key 为分类名，value 为该分类下的链接数组：

```json
{
    "好伙伴": [
        {
            "title": "GitHub",
            "description": "GitHub 是世界上最大的软件开发平台。",
            "website": "https://github.com",
            "image": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        }
    ],
    "有用的资源": [
        {
            "title": "TypeScript",
            "description": "TypeScript 是 JavaScript 的一个超集，它可以编译成纯 JavaScript。",
            "website": "https://www.typescriptlang.org",
            "image": "ts-logo-128.jpg"
        }
    ]
}
```

## 扁平格式（兼容旧版）

也支持纯数组格式，将作为无分类标题的单一网格渲染：

```json
[
    {
        "title": "GitHub",
        "description": "GitHub 是世界上最大的软件开发平台。",
        "website": "https://github.com",
        "image": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    }
]
```

## 支持的字段

| 字段          | 必填 | 说明                           |
| ------------- | ---- | ------------------------------ |
| `title`       | 是   | 友链名称                       |
| `website`     | 是   | 目标 URL                       |
| `description` | 否   | 简介，未填时显示 URL           |
| `image`       | 否   | 头像，支持本地文件名或外部 URL |
| `alt`         | 否   | 头像图片的 alt 文本            |

多语言站点请为每种语言单独创建文件：`links.en.json`、`links.zh.json` 等。每个分类内的友链在每次加载页面时随机排序。
