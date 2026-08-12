# Portfolio — yugeshweb.com

Personal portfolio of Yugesh K — web developer, UI/UX designer and cybersecurity enthusiast.

**Live:** [yugeshweb.com](https://yugeshweb.com)

## About

A hand-built static site with no framework and no build step. The design is a
graph-paper theme: a fine hairline grid, paper-white panels, ink-toned type and
a single red accent.

## Stack

- Semantic HTML5
- CSS with custom properties, Grid and Flexbox — no preprocessor
- Vanilla JavaScript, no dependencies
- Hosted on Netlify

## Structure

```
.
├── index.html          # About
├── skills.html         # Skills
├── education.html      # Education
├── career.html         # Career
├── gallery.html        # Gallery
├── hobbies.html        # Hobbies
├── contact.html        # Contact (Netlify Forms)
├── 404.html
├── Assets/             # Images, resume, favicon
├── SRC/
│   ├── style/style.css
│   └── script/script.js
├── netlify.toml        # Headers, redirects, caching
├── robots.txt
└── sitemap.xml
```

## Features

- Clean URLs (`/skills` rather than `/skills.html`)
- Responsive from 320px upward
- JSON-LD structured data (`Person`, `WebSite`, `ProfilePage`)
- Open Graph and Twitter Card metadata
- Content Security Policy with hash-allowlisted inline scripts
- Subresource Integrity on all third-party assets
- Contact form via Netlify Forms with a honeypot
- Respects `prefers-reduced-motion`

## Local development

Clean URLs need a server that resolves extensionless paths:

```bash
npx netlify-cli dev
```

Opening the files directly, or using a plain static server, will 404 on
`/skills` because that routing comes from `netlify.toml`.

## Licence

Code is free to reference. Content, images and branding are © Yugesh K.
