# Refactor verification — 13 October 2026

## Scope

Reorganized only the application stylesheet and script locations while retaining the root HTML page URLs, existing CSS names/order, image assets, vendor dependencies and JavaScript source. Removed outdated generated `outputs/` reports, Windows-specific screenshot/legacy QA utilities and a PNG-image preparation script whose original PNG inputs were not included in the submitted ZIP.

### Relocation map

| Original | Current |
| --- | --- |
| `assets/css/site.css` | `CSS/site.css` |
| `assets/css/navigation.css` | `CSS/navigation.css` |
| `assets/css/premium.css` | `CSS/premium.css` |
| `assets/css/sections.css` | `CSS/sections.css` |
| `assets/js/site.js` | `JS/site.js` |
| `assets/js/premium.js` | `JS/premium.js` |

Font URLs inside `CSS/site.css` were updated from `../vendor/fonts/...` to `../assets/vendor/fonts/...`, preserving the same font files. Template-generated HTML references were changed correspondingly. The canonical `scripts/build.mjs` and `scripts/check.mjs` were updated, and the 26 root HTML pages regenerated.

### Verification results

- `npm run build` **passed** — 26 generated HTML pages.
- `npm run check` **passed** — no broken local HTML or CSS asset references, duplicate image use, missing DOM targets, or navigation requirement violations.
- Regenerated HTML compared to the original archive: **all 26 pages match byte-for-byte after substituting the CSS and JS resource paths**. No page markup, copy, hierarchy or routing was otherwise modified.
- Browser layout smoke checks: **104 / 104** (26 pages at 1440, 768, 390 and 320px) with no horizontal overflow, broken images or JS page errors in the isolated test sessions.
- Targeted interactions: **5 / 5** (Home comfort selection, About values, Services tabs, Blog filters, mobile-menu open state).

The browser test used Chromium with page assets and scripts embedded locally for test execution because browser network navigation was blocked in the verification environment. This checks layout and client-side JavaScript execution but is not equivalent to a complete hosted production/end-to-end acceptance test. The static link checker validates path existence separately. The original page content and compiled JS source are otherwise unchanged.

### Post-deployment checklist

After deploying to your target host, check that all 26 URLs are reachable with the correct MIME types and directory capitalization, plus keyboard/mobile interactions, CSP/resource loading, reduced-motion behavior and performance on real devices. Real authentication, privacy controls and backend features must be implemented before accepting real client information.
