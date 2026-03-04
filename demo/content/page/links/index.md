---
title: Links
layout: links
menu:
    main:
        weight: 4
        params:
            icon: link

comments: false
---

To use this feature, add `layout: links` to the page's front matter, then create a `links.<lang>.json` file in the same page bundle directory.

Example `links.en.json`:

```json
[
    {
        "title": "GitHub",
        "description": "GitHub is the world's largest software development platform.",
        "website": "https://github.com",
        "image": "https://github.githubassets.com/images/modules/logos_page/GitHub-Mark.png"
    },
    {
        "title": "TypeScript",
        "description": "TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.",
        "website": "https://www.typescriptlang.org",
        "image": "ts-logo-128.jpg"
    }
]
```

Supported fields per entry:

| Field         | Required | Description                              |
| ------------- | -------- | ---------------------------------------- |
| `title`       | Yes      | Display name of the link                 |
| `website`     | Yes      | Target URL                               |
| `description` | No       | Short description; falls back to the URL |
| `image`       | No       | Avatar — local filename or external URL  |
| `alt`         | No       | Alt text for the avatar image            |

For multilingual sites, create one file per language: `links.en.json`, `links.zh.json`, etc. The links are shuffled randomly on each page load.
