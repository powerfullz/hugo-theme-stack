# Early Hints Support

This theme supports generating a `_headers` file for Cloudflare Pages and Netlify, which enables HTTP 103 Early Hints for the main stylesheet. This allows the browser to start downloading the CSS before the full HTML response is received, reducing render-blocking time.

## Enabling Early Hints

Add `"HEADERS"` to the `home` output formats in your site's `hugo.toml`:

```toml
[outputs]
    home = ["HTML", "RSS", "HEADERS"]
```

After building, a `_headers` file will be generated in your `public/` directory with the following content (the hash will match your build):

```
/*
  Link: </scss/style.min.[hash].css>; rel=preload; as=style
```

## Cloudflare Pages

Cloudflare Pages automatically reads the `_headers` file and converts `Link: ...; rel=preload` headers into HTTP 103 Early Hints responses. No additional configuration is needed.

## Netlify

Netlify also supports the `_headers` file format. The `Link` header will be sent with every response, but Netlify does not currently support HTTP 103 Early Hints natively — it will still function as a standard `Link` preload header.

## Conflict with Existing `_headers`

If you already have a `static/_headers` file in your project, Hugo will conflict when trying to output the generated `_headers` file. To resolve this:

1. Delete your `static/_headers` file.
2. Create a custom `layouts/index.headers` in your project (this overrides the theme's template).
3. In your custom template, include both your existing rules and the theme's Early Hints logic:

```
{{- $style := partial "head/style-resource.html" . -}}
/*
  Link: <{{ $style.RelPermalink }}>; rel=preload; as=style

# Your custom rules below:
/api/*
  X-Custom-Header: value
```
