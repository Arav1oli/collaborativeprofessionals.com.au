# Southern Sydney Collaborative Professionals

A code-first rebuild of `collaborativeprofessionals.com.au`. The site has no
CMS or visual back end: pages, copy and member details live in this repository
and can be changed directly (or by asking Codex to change them).

## Where to edit

- `content/site.ts` — home-page copy, objectives, process steps and contact
  details
- `content/members.json` — the member directory, condensed biographies and
  profile-source links
- `content/faqs.json` — process FAQs
- `content/articles.json` — all migrated news and resource articles
- `app/` — page components and layouts
- `app/globals.css` — the complete visual design
- `public/media/legacy/` — locally preserved images, logos, brochures and
  article attachments
- `public/media/members/` — locally stored, source-verified member portraits

## Local preview

This project requires Node 22.13 or newer.

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Build and checks

```bash
npm test
```

The normal build targets the private Sites staging deployment. GitHub Pages
uses the repository workflow in `.github/workflows/pages.yml` and runs:

```bash
npm run build:github
```

## Refresh the WordPress archive

The original WordPress site has been preserved under `legacy-archive/` and
`public/media/legacy/`. To capture it again and regenerate the editable content
files:

```bash
python3 scripts/archive-wordpress.py
python3 scripts/build-content.py
```

Existing curated member biographies and portraits are preserved when the
archive content is regenerated. Review newly imported members and article data
before publishing.

## Contact form

The new contact form opens a pre-addressed message in the visitor's email
application. There is no form database, third-party form processor or stored
personal data.

See `MIGRATION.md` for the legacy form endpoint and domain cutover notes.
