---
title: "鏈接"
layout: links
menu:
    main:
        weight: -50
        params:
            icon: link
comments: false
---

要使用此功能，請在頁面 front matter 中添加 `layout: links`，然後在同一頁面 bundle 目錄下建立 `links.<語言>.json` 檔案。

示例 `links.zh-hant-tw.json`：

```json
[
    {
        "title": "GitHub",
        "description": "GitHub 是世界上最大的軟體開發平台。",
        "website": "https://github.com",
        "image": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    },
    {
        "title": "TypeScript",
        "description": "TypeScript 是 JavaScript 的超集，可編譯為純 JavaScript。",
        "website": "https://www.typescriptlang.org",
        "image": "ts-logo-128.jpg"
    }
]
```

每個條目支援的欄位：

| 欄位          | 必填 | 說明                         |
| ------------- | ---- | ---------------------------- |
| `title`       | 是   | 友站名稱                     |
| `website`     | 是   | 目標 URL                     |
| `description` | 否   | 簡介，未填時顯示 URL         |
| `image`       | 否   | 頭像，支援本地檔名或外部 URL |
| `alt`         | 否   | 頭像圖片的 alt 文字          |

多語言網站請為每種語言單獨建立檔案：`links.en.json`、`links.zh.json` 等。友站清單每次載入頁面時隨機排序。
