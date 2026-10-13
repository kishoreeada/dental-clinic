# Stackly Dental — static frontend project

A 26-page responsive dental clinic concept website with local WebP imagery, a shared design system, GSAP/ScrollTrigger, AOS, Font Awesome, and client/admin workspace demonstrations.

## Run it

- **Preview:** `npm start`, then open `http://127.0.0.1:4173`.
- **Regenerate HTML:** `npm run build`.
- **Validate references and structure:** `npm run check`.

Node.js is needed for the commands above; the generated static pages do **not** require an npm installation, a bundler, or a framework. You can also open `index.html` directly. All active fonts, image assets, icons, and animation libraries are included locally.

## Project structure

```text
Stackly-Dental/
├── index.html, about.html, services.html, blog.html, contact.html
├── login.html, signup.html, 404.html
├── article-*.html                      # Six journal article pages
├── client-*.html                       # Six client workspace pages
├── admin-*.html                        # Six admin workspace pages
├── CSS/
│   ├── site.css                        # Foundation and shared components
│   ├── navigation.css                  # Desktop/mobile nav and footer
│   ├── premium.css                     # Page layouts, themes, motion styling
│   └── sections.css                    # Distinct landing-page sections
├── JS/
│   ├── site.js                         # Forms, navigation, workspace behaviors
│   └── premium.js                      # Page-specific interactions and animation
├── assets/
│   ├── images/                         # WebP photographs and manifest
│   ├── icons/                          # Stackly logos and favicon
│   └── vendor/                         # Bundled GSAP, AOS, fonts, icons, licenses
├── scripts/
│   ├── build.mjs                       # Canonical HTML generator
│   ├── check.mjs                       # Structural and local-reference audit
│   ├── server.mjs                      # Local static preview
│   └── pages/                          # Public page templates
├── docs/                               # Source/asset and verification notes
├── PROJECT-STANDARDS.md                # Requirements retained from original
└── package.json
```

This preserves the multi-page HTML structure shown in the supplied reference documentation while keeping the existing dental design and source-generator architecture. The stylesheet/script folders use `CSS/` and `JS/` and third-party/media resources remain under `assets/`. Styles are organized by existing responsibility, rather than arbitrarily creating empty per-page stylesheets.

## Safe editing and deployment

**Do not modify generated root HTML files as your source of truth.** The main page templates are in `scripts/pages/` and the shared templates (accounts, workspaces, articles, header/footer) are in `scripts/build.mjs`. Modify those and run `npm run build` followed by `npm run check`. CSS/JS and the assets can be edited directly.

For static hosting, publish only the root `.html` files, `CSS/`, `JS/`, and `assets/`. Development source (`scripts/`), `docs/`, and Markdown specifications need not be published. Keep root paths and folder capitalization intact; the relative URLs intentionally work for root-hosted static pages.

## What is and is not implemented

- **Implemented:** public pages and navigation; article links; Login/Signup frontend validation; Client/Admin selection and page routing; dashboards with representative sample data; live UI filters, tabs, motion controls, responsive menus, accessibility affordances, and visual feedback.
- **Not implemented:** real identity verification, secure login, persistent client accounts, appointments, payments, contact-form delivery, or a clinic backend. Login routing is intentionally a *frontend demonstration* and is not suitable for real patient data.
- No browser persistence is used for account state, and the sample workspace records are illustrative. Don't publish as a real patient portal without backend/security/privacy work and verified practice information.

## Verification

`npm run build` generates 26 pages; `npm run check` audits links, assets, CSS font references, image usage, navigation, metadata, DOM targets, and disallowed browser storage references. See `docs/VERIFICATION.md` for the latest verification performed during restructuring.

See `docs/ASSETS.md`, `docs/REDESIGN-ASSETS.md`, and `docs/PHOTO-PROMPTS.json` for image/license provenance.
