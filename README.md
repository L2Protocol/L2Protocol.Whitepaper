# L2 Protocol Litepaper

The litepaper for the L2P presale. One static page, English only, built to be served from
Cloudflare Pages with no build step and no server-side code.

## Why this is a litepaper and not a whitepaper

The presale stays under EUR 1,000,000 over twelve months, so it is exempt under Article 4(2)(b)
MiCAR from drawing up, notifying and publishing a crypto-asset white paper. Article 4(8) says that if
a white paper is nevertheless drawn up voluntarily, Title II applies after all. The previous
whitepaper on this site (17 sections and four appendices, still in the git history) was close enough
to the Annex I layout to be read as exactly that.

This page is therefore a **marketing communication** under Article 7, and it must keep looking like
one:

- It is labelled as a marketing communication at the top and carries the Article 7(1)(e) statement
  word for word, in English and in Dutch, taken from the official texts on EUR-Lex. Do not rephrase
  either.
- It says plainly that it is not a crypto-asset white paper, cites the exemption, and says that no
  white paper was drawn up or notified to the AFM.
- It covers only the offer: who offers, what you buy, the terms, the right of withdrawal, the risks
  and what the money is for.

Keep out of it, because they are what makes a document recognisable as a white paper:

- a summary, the Article 6 statements, the Annex I part structure, a climate and environmental
  section, team profiles, history and financial information;
- technical depth (architecture, tokenomics tables, emission schedule, governance parameters): that
  belongs on [docs.l2protocol.com](https://docs.l2protocol.com);
- anything about expected price, returns, staking yields, "safe", or a coming listing. Under Article
  4(4) the exemption is lost as soon as any communication makes known an intention to seek admission
  to trading, so listings are not mentioned either.

Text that still has to be supplied before publication is wrapped in `<span class="fill">`, which
renders as a dashed amber box. Search for `class="fill"`; there must be none left when the page goes
live.

## What is here

```
index.html              The litepaper
404.html                Not-found page
css/site.css            Site styling on top of the shared L2 Protocol theme
js/theme-init.js        Applies the stored light/dark theme before first paint
js/litepaper.js         Theme switch, contents rail, scroll spy, copy buttons, read progress
theme/                  The shared L2 Protocol theme (compiled Bootstrap + Sora, Anek Telugu, Artemus)
lib/font-awesome/       Icon font
images/                 Logo (light and dark) and the Open Graph image
_headers                Cloudflare Pages security, cache and no-index headers
robots.txt
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

The litepaper is written directly in `index.html`. Each section is a
`<section class="doc-section" id="...">` inside `article.doc-body`, and the contents rail in
`nav#doc-rail` links to those ids. When a section or a subheading is added, add the matching rail
link as well; the scroll spy in `js/litepaper.js` matches rail links to section and `h3` ids by
`href`, so nothing else needs changing.

Raise the version number and the date in the hero and in the foot note with every change to the
content.

## Kept out of search engines

The site must not be indexed anywhere. This is done in three places:

- `_headers` sends `X-Robots-Tag: noindex, nofollow, noarchive, nosnippet, noimageindex, notranslate`
  on every path, so it also covers images, the favicon, CSS and JS, not only the HTML.
- `index.html` and `404.html` carry the same directives in `<meta name="robots">`, which still
  works if the page is served without `_headers` (another host, a local copy, a cache).
- There is no sitemap and no `canonical` tag.

`robots.txt` deliberately **allows** crawling. A crawler that is blocked by `robots.txt` never
fetches the page, so it never sees the `noindex`, and the bare URL can still end up in search results
when other sites link to it. Do not add `Disallow: /` there.

The `og:` and `twitter:` tags are kept so that links shared in chat apps and on social media still
show a preview; they do not cause indexing.
