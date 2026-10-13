# Shared requirements — dental theme

The requirements recovered from “Polish all site pages” apply to this local dental project.

- Distinct dental identity: warm ivory, charcoal, muted terracotta accents, champagne and sandstone surfaces, contemporary editorial typography and architectural imagery. The October 12 palette replaces the earlier blue/green direction.
- Primary navigation labels must always be exactly Home, About, Services, Blog, Contact, pointing to index.html, about.html, services.html, blog.html, contact.html. The same standard applies when this document is carried to future themes. Header account actions are Sign Up and Login.
- Use the mental-health theme's original Stackly logo and symbol, recolored for this palette. Match its full-height mobile menu with centered primary links, circular hamburger/close control and bottom Sign Up/Login actions. Keep keyboard focus within the open menu and lock background scrolling.
- Highlight the current page in desktop navigation, mobile navigation and the footer; article pages highlight Blog. Dashboard pages must not include a “Back to website” button.
- Main pages must have different compositions within a coherent visual system.
- Include Home, About, Services/Treatments, Blog/Journal, Contact, Login, Signup, 404, separate Client and Admin dashboards, and individual pages for every dashboard sidebar destination.
- Use local imagery, fonts, GSAP, ScrollTrigger, AOS and Font Awesome icons.
- Purposeful motion: coordinated hero entrance, scroll-driven text emphasis, image-mask reveals, a care-journey progress line, layered background rings, interactive panels and polished hover states. GSAP and AOS must not animate the same elements. Provide a page-level decorative-motion pause control and reduced-motion support.
- Respect reduced motion. Keep content readable without animation libraries. Provide visible keyboard focus, meaningful form labels and accessible navigation.
- Main navigation, journal and account links retain their intended destinations. Marketing and social actions go to 404.
- Account pages have different imagery and no public navigation header or demo-access banner.
- Login includes Client/Admin selection, email validation, alphanumeric password rules and matching workspace routing. Signup validates matching passwords and routes to Login.
- No application persistence of any kind: no localStorage, sessionStorage, IndexedDB, cookies or window.name. Do not transfer personal details through URLs. Account routing remains functional without persistence. Dashboard identity defaults to Guest; settings may preview an email/avatar on the current page only and must reset on reload/navigation. This replaces the earlier email-storage requirement.
- Every editorial photograph or generated raster asset appears in exactly one location across the entire website. The shared brand symbol/favicon and functional icon system remain consistent. Check final rendered HTML, including hidden panels and account pages, for duplicate image use.
- Implement and check each main page in order: Home, About, Services, Blog, Contact. Within each, work through the sections sequentially. Use the mental-health project as the structural reference while keeping a distinct dental design.
- Dashboard pages use sample data, responsive navigation drawers and meaningful frontend interactions.
- 404 prominently says “404 NOT FOUND” and has working Home/Previous Page controls without clipping.
- Verify narrow mobile, mobile, tablet and desktop, plus forms, navigation, filters, imagery, runtime errors and reduced motion.
- Deliver complete source, a ZIP and a concise verification report. Clearly distinguish frontend functionality from unimplemented backend services.
