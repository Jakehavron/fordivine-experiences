# Crowned Stories landing page

Edit index.html and deferred-media.js here, then run `npm install` and `npm run build` with Node.js. The build reads shared fonts.css/deferred-media.css, inlines and minifies CSS, and generates responsive WebP carousel derivatives from the preserved root originals. It writes the public crowned-stories/index.html, media/deferred-media-v2.js, and media/performance-v1/ assets.

The 3:4, center-top image crops match the existing carousel's object-fit: cover presentation. Variant widths are 300/450/600/900, capped at source resolution; sizes matches the 286px mobile/333px desktop maximum image frame. Original files remain unchanged for other pages. Change the asset version directory if derivatives change after publishing (images use immutable caching).

The first testimonial poster is rendered in HTML with eager/high priority. The page-specific media script reuses it and batches placeholder insertions. Viewport player initialization and video settings are preserved. The reflow attributed to Embed.run belongs to the third-party player; this change intentionally does not rewrite the player or change loading behavior.

The Source Sans 3 fallback uses Arial's average ASCII letter/digit advance (85.1184% size-adjust) and the target font's 1024/-400/0 metrics, normalized against 1000 units per em and that size adjustment. Source Sans 3 remains preloaded and font-display: swap is preserved.

Validation: compare content and metadata to the previous build, verify carousel buttons/keyboard controls, expanded stories and FAQs, video controls, responsive layout at 390px and desktop, and all image URLs. No captions or security headers are changed.
