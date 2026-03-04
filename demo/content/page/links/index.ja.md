---
title: "リンク"
layout: links
menu:
    main:
        weight: -50
        params:
            icon: link
comments: false
---

この機能を使用するには、ページの front matter に `layout: links` を追加し、同じページ bundle ディレクトリに `links.<言語>.json` ファイルを作成してください。

`links.ja.json` の例：

```json
[
    {
        "title": "GitHub",
        "description": "GitHub は世界最大のソフトウェア開発プラットフォームです。",
        "website": "https://github.com",
        "image": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    },
    {
        "title": "TypeScript",
        "description": "TypeScript は JavaScript のスーパーセットで、純粋な JavaScript にコンパイルされます。",
        "website": "https://www.typescriptlang.org",
        "image": "ts-logo-128.jpg"
    }
]
```

各エントリでサポートされているフィールド：

| フィールド    | 必須   | 説明                                           |
| ------------- | ------ | ---------------------------------------------- |
| `title`       | はい   | リンクの表示名                                 |
| `website`     | はい   | リンク先 URL                                   |
| `description` | いいえ | 説明文。未指定の場合は URL が表示されます      |
| `image`       | いいえ | アバター画像。ローカルファイル名または外部 URL |
| `alt`         | いいえ | アバター画像の alt テキスト                    |

多言語サイトでは言語ごとにファイルを作成してください：`links.en.json`、`links.ja.json` など。リンク一覧はページ読み込みのたびにランダムな順序で表示されます。
