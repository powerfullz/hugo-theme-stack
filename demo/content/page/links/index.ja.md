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

## カテゴリ形式（推奨）

オブジェクト形式を使用し、key をカテゴリ名、value をそのカテゴリのリンク配列にします：

```json
{
    "友達": [
        {
            "title": "GitHub",
            "description": "GitHub は世界最大のソフトウェア開発プラットフォームです。",
            "website": "https://github.com",
            "image": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
        }
    ],
    "便利なリソース": [
        {
            "title": "TypeScript",
            "description": "TypeScript は JavaScript のスーパーセットで、純粋な JavaScript にコンパイルされます。",
            "website": "https://www.typescriptlang.org",
            "image": "ts-logo-128.jpg"
        }
    ]
}
```

## フラット形式（旧バージョン互換）

配列形式もサポートしており、カテゴリタイトルなしの単一グリッドとしてレンダリングされます：

```json
[
    {
        "title": "GitHub",
        "description": "GitHub は世界最大のソフトウェア開発プラットフォームです。",
        "website": "https://github.com",
        "image": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    }
]
```

## サポートされているフィールド

| フィールド    | 必須   | 説明                                           |
| ------------- | ------ | ---------------------------------------------- |
| `title`       | はい   | リンクの表示名                                 |
| `website`     | はい   | リンク先 URL                                   |
| `description` | いいえ | 説明文。未指定の場合は URL が表示されます      |
| `image`       | いいえ | アバター画像。ローカルファイル名または外部 URL |
| `alt`         | いいえ | アバター画像の alt テキスト                    |

多言語サイトでは言語ごとにファイルを作成してください：`links.en.json`、`links.ja.json` など。各カテゴリ内のリンクはページ読み込みのたびにランダムな順序で表示されます。
