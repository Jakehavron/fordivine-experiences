# Static story publishing

Next.js renders this route at build time. `pnpm build` then runs `finalize-static.mjs`, preserving the HTML, inline CSS, responsive image/font preloads, metadata, and JSON-LD while replacing React hydration with `story-interactions.js`.

The menu and carousel are the only scripted behaviors. Results use native HTML details. Add future browser interactions to the standalone script; client React components will not hydrate in the published export. Verify the exported `out/` page (not only `next dev`) before publishing.

Publish the exported directory at `/crowned-stories/michelle-roby/`. The script filename is content-hashed for cache invalidation. Original portrait and responsive variants live in the deployed images directory; retain them when rebuilding the source mirror.
