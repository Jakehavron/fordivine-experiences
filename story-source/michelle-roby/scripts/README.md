# Static story publishing

Next.js renders this route at build time. `pnpm build` then runs `finalize-static.mjs`, preserving the HTML, inline CSS, responsive image/font preloads, metadata, and JSON-LD while replacing React hydration with `story-interactions.js`.

The menu, carousel, results accordion, and Instagram comparison use the standalone interaction script. Add future browser interactions to the standalone script; client React components will not hydrate in the published export. Verify the exported `out/` page (not only `next dev`) before publishing.

Publish the exported directory at `/crowned-stories/michelle-roby/`. The script filename is content-hashed for cache invalidation. Original portrait and responsive variants live in the deployed images directory; retain them when rebuilding the source mirror.

The Chapter 1 Instagram comparison uses lossless WebP assets made from the approved original screenshot crops. Both layers share one phone frame. Keep the original photo pixels when updating assets; do not regenerate them. A single pointer controller handles dragging without native range interference. Horizontal gestures reveal the images; vertical gestures scroll the page. The accessible slider supports arrow keys, Home/End, and Page Up/Down.
