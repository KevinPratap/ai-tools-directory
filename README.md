# AI Tools Directory

A static directory of **1,236 AI tools**, built with Next.js 16 (App Router) and exported
as a static site to GitHub Pages.

Live: <https://kevinpratap.github.io/ai-tools-directory/>

Data is sourced from bestofai.io and lives in this repo — no API or database at runtime.

## Routes

| Route | What it renders |
| --- | --- |
| `/` | Search plus category, pricing and career-cluster filters over the full tool list |
| `/tools/<slug>/` | Tool detail page (description, tags, pricing, alternatives, category link) |
| `/categories/<slug>/` | Every tool in one category |

Slugs are derived from the tool's `category` / `slug` fields by lowercasing and replacing
anything that is not `a-z0-9` with `-`. Category and career-cluster counts are computed at
runtime from the tool list, so they cannot drift out of date.

## Data

`src/data/tools.json` is the single source of truth:

```jsonc
{
  "tools": [ { "slug": "01-ai", "name": "01.AI", "category": "Models", "pricing": "Free", "url": "https://01.ai", "tags": [], "professions": [] /* … */ } ],
  "categories": [],                                  // empty on purpose, see below
  "meta": { "total_tools": 1236, "total_categories": 0, "source": "bestofai.io" }
}
```

The `categories` array is intentionally empty: `getAllCategories()` in `src/lib/tools.ts`
groups the tools by their `category` field and sorts by count, so categories never need to
be maintained by hand. The same file also maps professions onto career clusters
(`CAREER_CLUSTERS`).

### Adding a tool

1. Append an object to `tools` with the fields listed in the `Tool` type in `src/lib/tools.ts`.
2. Bump `meta.total_tools` to match `tools.length` (the homepage hero prints `tools.length`).
3. `npm run build` — a mismatch here is the usual cause of a red build.

## Development

```bash
npm install
npm run dev      # http://localhost:3000/ai-tools-directory/
npm run build    # static export to out/
npm run lint     # eslint
```

Because `next.config.ts` sets `basePath` and `assetPrefix` to `/ai-tools-directory`, the dev
server serves the app under that prefix, not at the site root, and `next build` writes a
static `out/` directory (`output: "export"`, `trailingSlash: true`, unoptimized images).

## Deploy

Pushing to `main` triggers `.github/workflows/deploy.yml` (Deploy to GitHub Pages): it runs
`npm ci`, `npm run build`, uploads `out/` and deploys it to the `github-pages` environment.
No secrets or environment variables are required.

## Theming

Light/dark is a `dark` class on `<html>`. The stored preference is applied by an inline
script in `src/app/layout.tsx` before hydration, so the correct theme is painted on the
first frame (`suppressHydrationWarning` on `<html>`).

## Working on this repo with an AI agent

See `AGENTS.md` (`CLAUDE.md` imports it): this Next.js version may differ from an agent's
training data, so read the bundled docs in `node_modules/next/dist/docs/` before writing code.
