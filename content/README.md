# Content

Each folder here is editable. The static build (`node scripts/build-static.mjs`) reads every file in these folders and regenerates `docs/`.

```
content/
  essays/      one .md file per essay
  podcast/     one .md file per episode
  artwork/     one .md file per piece
  notebook/    one .md file per short note
  about.md     the About page
```

## File format

Every file uses **frontmatter + markdown body**:

```md
---
title: On Keeping a Notebook
date: March 14, 2026
readingTime: 7
cover: essay-1.jpg
tags: ["writing", "ritual"]
dek: Why the unfinished sentence may be the most honest one you'll write.
---

The body of the essay goes here. Blank lines = paragraph breaks.
Markdown is intentionally minimal — paragraphs only.
```

### Field rules

- Strings: plain text, no quotes needed.
- Numbers: plain digits (`readingTime: 7`).
- Arrays / objects: write as JSON (`tags: ["a","b"]`, `notes: [["00:00","Cold open"]]`).
- The **filename** (without `.md`) is the URL slug.
- Images: drop into `src/assets/`, then reference just the filename (`cover: essay-1.jpg`).

## Adding new items

1. Copy an existing file in the folder, rename it (the filename becomes the URL slug).
2. Edit frontmatter + body.
3. Run `node scripts/build-static.mjs` to regenerate `docs/`.
4. Commit & push — GitHub Actions publishes automatically.

## Ordering

Items are sorted **newest first** by the `date` field (or `number` for podcast episodes).

## Schemas

### Essay (`content/essays/<slug>.md`)
`title`, `dek`, `date`, `readingTime`, `cover`, `tags` (array)

### Podcast episode (`content/podcast/<slug>.md`)
`title`, `number`, `date`, `duration`, `cover`, `guest` (optional), `spotify`, `apple`, `youtube` (all optional embed URLs), `notes` (array of `["time","label"]` pairs). Body = episode description.

### Artwork (`content/artwork/<slug>.md`)
`title`, `year`, `medium`, `image`. Body = description.

### Note (`content/notebook/<slug>.md`)
`date`, `kind` (`thought` | `quote` | `observation` | `link`), `source` (optional). Body = the note itself.
