# Crowned Stories QA Checklist

This checklist governs edits to the six FORDIVINE Crowned Stories URL pages. It is designed for the static GitHub/Vercel version of the pages and assumes Framer runtime hydration remains disabled.

## Pages in scope

| Story | Production path |
|---|---|
| Ali Marie | `/crowned-stories/ali-marie/` |
| Beth Clifford | `/crowned-stories/beth-clifford/` |
| Christa Crawford | `/crowned-stories/christa-crawford/` |
| Colette VanPaemel | `/crowned-stories/colette-vanpaemel/` |
| Lauren Fields | `/crowned-stories/lauren-fields/` |
| Roni Lavenia | `/crowned-stories/roni-lavenia/` |

## Required local checks before publishing

Every change should be checked locally before it is committed and pushed. At minimum, review each page at desktop width and mobile width, then verify that the shared enhancement layer is active.

| Area | Required check | Pass standard |
|---|---|---|
| Page load | Each story loads from the local static server. | No blank pages, missing shared assets, or blocking script failures. |
| Native mobile drawer | Open and close the drawer on every story page. | Drawer opens flush right, traps focus, closes with Escape, and shows the current Crowned Stories state. |
| Hero mobile fit | Review each mobile hero, with special attention to long names. | No awkward word breaks, clipped titles, or horizontal overflow. |
| Scroll progress | Scroll each page from top to bottom. | Thin progress marker advances smoothly and does not cover core content. |
| Proof panels | Capture at least one proof-panel section on desktop and mobile. | Panels remain readable, visible, and correctly polished. |
| Media shells | Check Ali Marie and Beth Clifford self-hosted videos. | Videos receive shell styling, loading/ready state, muted autoplay, loop, and playsinline attributes. |
| Tickers | Verify all four ticker bands on each page. | Tickers are marked ready and do not create horizontal overflow. |
| Reduced motion | Test at least one page with reduced motion enabled. | Reveal elements become visible immediately and marquee/media motion is minimized. |
| Console and network | Review errors and failed requests. | No local page asset failures. Analytics beacons or headless-browser warnings may be documented as benign if they do not affect page behavior. |

## Required visual evidence

For meaningful review, percentage-scroll screenshots alone are not enough. The recurring visual evidence package should include the following contact sheets.

| Contact sheet | Required viewports | Purpose |
|---|---|---|
| Top section | Desktop and mobile | Confirms hero/header stability and mobile title fit. |
| Mobile drawer open | Mobile | Confirms the native drawer and active state across all six pages. |
| Targeted proof panel | Desktop and mobile | Confirms mid-page proof polish in the actual enhanced sections. |
| Targeted media shell | Desktop and mobile for Ali/Beth | Confirms self-hosted video treatment and loading/ready styling. |
| Progress marker | Desktop and mobile | Confirms the progress marker is present but unobtrusive. |

## Publishing gate

Do not publish, push, or trigger a Vercel deployment until Jake has explicitly approved the locally verified changes. After publishing, run the same production verification against the live `www.fordivine.com` URLs and document any third-party analytics artifacts separately from true page failures.
