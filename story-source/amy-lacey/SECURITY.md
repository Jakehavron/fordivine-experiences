# Amy story response policy

The static finalizer calculates SHA-256 hashes from the exact shipped interaction script and JSON-LD. The script receives an integrity attribute. The publisher synchronizes those hashes into the three Amy document routes in vercel.json. Always run the finalizer and publisher together after rebuilding; do not edit generated HTML or script files independently.

CSP uses strict-dynamic to trust the hashed entrypoint and scripts that it loads, including the journal and the current Vidalytics loader. Media, connections, fonts, images and styles permit this site and the required Vidalytics origins; data/blob are enabled only for resource types used by the player. Inline script handlers and eval remain disallowed. Inline CSS is retained for the static export, journal animation and player styles.

SAMEORIGIN framing and same-origin opener protection apply only to Amy's document. No rules on other pages were changed.

## Compatibility decisions, September 24, 2026

A local report-only trial included require-trusted-types-for script. It reported incompatible string sinks in Vidalytics loader/player and StPageFlip, as well as the dynamic loaders. Do not enforce Trusted Types until these integrations support it. Do not introduce a permissive default policy merely to silence Lighthouse.

Vercel already serves HSTS max-age=63072000 (two years). HSTS is host-wide even when sent on one page. includeSubDomains/preload were deliberately not changed in this page-scoped work; those require a separate domain/subdomain review.

Enforced preview checks covered Vidalytics loading, desktop/mobile playback and mute, native reel playback, journal turns, result toggles, and absence of CSP errors. No media, copy, layout or player settings changed.
