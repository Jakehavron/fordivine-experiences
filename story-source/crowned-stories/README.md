# Crowned Stories landing page

Edit index.html and deferred-media.js here, then run `npm install` and `npm run build` with Node.js. The build reads shared fonts.css/deferred-media.css, inlines and minifies CSS, and generates responsive WebP carousel derivatives from the preserved root originals. It writes the public crowned-stories/index.html, media/deferred-media-v2.js, and media/performance-v1/ assets.

The 3:4, center-top image crops match the existing carousel's object-fit: cover presentation. Variant widths are 300/450/600/900, capped at source resolution; sizes matches the 286px mobile/333px desktop maximum image frame. Original files remain unchanged for other pages. Change the asset version directory if derivatives change after publishing (images use immutable caching).

The first testimonial poster is rendered in HTML with eager/high priority. The page-specific media script reuses it and batches placeholder insertions. Viewport player initialization and video settings are preserved. The reflow attributed to Embed.run belongs to the third-party player; this change intentionally does not rewrite the player or change loading behavior.

The Source Sans 3 fallback uses Arial's average ASCII letter/digit advance (85.1184% size-adjust) and the target font's 1024/-400/0 metrics, normalized against 1000 units per em and that size adjustment. Source Sans 3 remains preloaded and font-display: swap is preserved.

Validation: compare content and metadata to the previous build, verify carousel buttons/keyboard controls, expanded stories and FAQs, video controls, responsive layout at 390px and desktop, and all image URLs. No captions or security headers are changed.

## Collection organization (2026-10-09)

The hub and `collections/*.html` are the editable sources for the four collection pages. The hub source was synchronized with production to preserve the shared navigation, footer, favicons, FAQ schema, and optimized media added after the previous source build. Run `node build-collections.cjs` for collection-only changes; the original media build is still available when regenerating images. `collections.json` documents membership and the approved card text; edit rendered HTML alongside this inventory when changing a collection.

Existing URLs stay stable. Individual story HTML/media are outside this build. Original testimonials remain verbatim. Each woman belongs to one primary collection only; her story and any supporting testimonials stay in that collection. The hub retains all nine stories.

`collection-tracking-v1.js` emits `crowned_category_click`, `crowned_story_click`, `crowned_discover_click`, and `crowned_navigation_click` to the existing GA4 property G-Q8TH5MKKZ0. Parameters include source_page, link_destination, story_slug, story_category, link_placement, and card_position. No internal UTM parameters are added. A session-only story-click assist expires after 24 hours and is read by the existing attribution helper on discovery/scheduler events. It indicates a click, never a confirmed story view or completed booking. GA4 custom dimensions/report configuration are outside this source deployment; event receipt should be checked in the property's DebugView/Realtime.

Full-story category breadcrumbs, return links, same-topic next-story cycles, and navigation events are maintained by `apply-story-navigation.cjs` and `story-navigation-v1.css/js`. Run `node apply-story-navigation.cjs` after changing collection membership. The three modern story finalizers call the same HTML transformation; legacy exports are patched by this idempotent command. Individual narrative content is preserved.

The six legacy stories use `story-ending.html` and `story-ending-v1.css` for the approved universal closing card. The navigation transform removes the retired desktop/tablet/phone inquiry variants, inserts this single responsive ending, and places category/next-story navigation inside it. The ending's opaque background and stacking level keep legacy sticky hero imagery from overlapping the closing cards. The three modern story finalizers retain their existing closing cards.
