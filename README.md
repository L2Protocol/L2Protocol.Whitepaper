# L2 Protocol Whitepaper

The public whitepaper site for L2 Protocol, at chain ID 12216. One static page, English only,
built to be served from Cloudflare Pages with no build step and no server-side code.

## What is here

```
index.html              The whitepaper, sections 1-17 and appendices A-D
404.html                Not-found page
css/site.css            Site styling on top of the shared L2 Protocol theme
js/theme-init.js        Applies the stored light/dark theme before first paint
js/whitepaper.js        Theme switch, contents rail, scroll spy, copy buttons, read progress
theme/                  The shared L2 Protocol theme (compiled Bootstrap + Sora, Anek Telugu, Artemus)
lib/font-awesome/       Icon font
images/                 Logo (light and dark) and the Open Graph image
_headers                Cloudflare Pages security and cache headers
robots.txt, sitemap.xml
```

`theme/` is a copy of the `l2p-theme` repository (`css/bootstrap.css` plus `fonts/`), and
`lib/font-awesome/` is the same Font Awesome build the other L2 Protocol sites ship. Both are
vendored rather than loaded from a CDN so that the page is fully self-contained and the
`Content-Security-Policy` in `_headers` can stay at `'self'`.

## Running it locally

There is nothing to compile. Any static file server works:

```bash
python3 -m http.server 8080
```

Then open <http://localhost:8080>. Opening `index.html` straight from disk also mostly works, but
the root-relative asset paths mean a server is the accurate test.

## Deploying to Cloudflare Pages

Connect the repository and use:

- **Build command:** none
- **Build output directory:** `/` (the repository root)

`_headers` is picked up automatically by Pages and sets the CSP, the framing and sniffing
protections and the cache lifetimes. Fonts and icon webfonts are immutable for a year; `css/` and
`js/` revalidate hourly because their filenames are not content-hashed.

## Updating the theme

When `l2p-theme` changes, copy it in again:

```bash
cp ../l2p-theme/css/bootstrap.css theme/css/
cp ../l2p-theme/fonts/*.woff2 ../l2p-theme/fonts/Artemus.otf theme/fonts/
```

## Updating the text

The whitepaper is written directly in `index.html`. Each numbered section is a
`<section class="doc-section" id="...">` inside `article.doc-body`, and the contents rail in
`nav#doc-rail` links to those ids. When a section or a subheading is added, add the matching rail
link as well; the scroll spy in `js/whitepaper.js` matches rail links to section and `h3` ids by
`href`, so nothing else needs changing.

Four passages are marked with an "In progress" callout: the bridge (5.6), the audit position
(14.2), the regulatory review (15) and the roadmap (17). They stay visible on purpose, so the site
is open about what has not been published yet, and should be replaced with the real content rather
than deleted.

## Canonical URL

`index.html`, `robots.txt` and `sitemap.xml` assume the site is served at
`https://whitepaper.l2protocol.com/`. Change the `canonical` and `og:url` tags and both files if it
is published elsewhere.
