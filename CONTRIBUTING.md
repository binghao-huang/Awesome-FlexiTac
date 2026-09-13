# Contributing to Awesome FlexiTac

The gallery in [`index.html`](index.html) is the single source of truth. The per-paper pages under [`papers/`](papers/) are **generated** from it — never edit them by hand.

## 1. Add the card

Copy an existing `<article>` block in [`index.html`](index.html) and update the teaser media (`static/`), title, authors and links. Then set two attributes that must agree:

- `data-category` on the `<article>` — comma-separated for multiple categories.
- `data-flexitac="sensor|built|inspired|prior"` on the `<article>`, **and** the matching `<div class="ft-tag ft-tag-<tier>">` eyebrow above the `<h3>`.

`data-flexitac` also drives the hero's "Papers built on FlexiTac have been published at …" sentence, which is rebuilt from the cards at runtime — so it stays correct on its own.

Prior works go last in the gallery, after the current research.

## 2. Register the slug

Add the slug to `SLUGS` in [`tools/build_papers.py`](tools/build_papers.py), **in the same position as the card** in `index.html`. The list is positional — a mismatch pairs a page with the wrong paper. Use `None` for an external card that links straight to a third-party site and has no detail page.

## 3. Abstract *(optional)*

Add an entry to [`tools/abstracts.json`](tools/abstracts.json), keyed by slug. Without one the page renders an "Abstract coming soon" placeholder. Quote the abstract verbatim from the paper and record where it came from in the `notes` field.

## 4. Hero image *(optional)*

Each detail page uses the paper's **first page** as its hero, rendered from the PDF; papers without one fall back to their gallery teaser.

```bash
# add "<slug>|<pdf url>" to the MAP in tools/fetch_firstpages.sh, then:
bash tools/fetch_firstpages.sh     # -> static/paper_firstpage/<slug>.jpg
```

Requires `pdftoppm` (poppler) and `convert` (ImageMagick). Existing images are skipped; pass `-f` to re-render. You can also drop a `static/paper_firstpage/<slug>.jpg` in by hand.

## 5. Regenerate

```bash
python3 tools/build_papers.py
```

Rewrites `papers/<slug>.html` for every card and re-links each card's image and title to its detail page. Idempotent, no third-party dependencies.

## Teaser media

Keep teasers small — they all autoplay on the gallery page. Target well under 1 MB:

```bash
ffmpeg -i in.mp4 -vf scale=960:-2 -c:v libx264 -crf 30 -preset slow -an -movflags +faststart out.mp4
```

16:9 fills the card exactly; other ratios letterbox inside it.
