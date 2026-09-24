import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
// This route is published as static HTML, not as a Next.js runtime application.
// Its only JS behaviors live in story-interactions.js; including scroll-responsive results and the video carousel.
const script = await readFile(new URL('./story-interactions.js', import.meta.url), 'utf8');
const hash = createHash('sha256').update(script).digest('hex').slice(0,12);
const integrity = 'sha256-' + createHash('sha256').update(script).digest('base64');
const scriptName = `story-interactions-${hash}.js`;
await writeFile(`out/${scriptName}`, script);
let html = await readFile('out/index.html', 'utf8');
if (!html.includes('id="social-posts"') || !html.includes('class="mobile-menu"')) throw Error('Static interaction markup is missing');
let schemaCount = 0;
html = html.replace(/<script\b([^>]*)>[\s\S]*?<\/script>/gi, (tag, attrs) => {
  if (/type=["']application\/ld\+json["']/i.test(attrs)) { schemaCount++; return tag; }
  return '';
});
html = html.replace(/<link\b[^>]*>/gi, tag => /\bas=["']script["']|\brel=["']modulepreload["']/i.test(tag) ? '' : tag);
if (!schemaCount || /<script[^>]*\bsrc=["'][^"']*\/_next\//i.test(html)) throw Error('Static HTML validation failed');
html = html.replace('</body>', `<script src="/crowned-stories/amy-lacey/${scriptName}" integrity="${integrity}" defer></script></body>`);
// Hash-based CSP keeps the exported static page strict without reusable nonces.
// strict-dynamic lets this trusted entrypoint load the journal and Vidalytics.
const schemaHashes = [...html.matchAll(/<script\b[^>]*type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)]
  .map(match => "'sha256-" + createHash('sha256').update(match[1]).digest('base64') + "'");
const csp = [
  "default-src 'self'",
  `script-src '${integrity}' ${schemaHashes.join(' ')} 'strict-dynamic' 'self' https://*.vidalytics.com`,
  "script-src-attr 'none'",
  "style-src 'self' 'unsafe-inline' https://*.vidalytics.com",
  "img-src 'self' data: blob: https://*.vidalytics.com",
  "font-src 'self' data: https://*.vidalytics.com",
  "media-src 'self' blob: https://*.vidalytics.com",
  "connect-src 'self' https://*.vidalytics.com",
  "worker-src 'self' blob: https://*.vidalytics.com",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'none'",
  "form-action 'self'",
  "frame-ancestors 'self'",
  "upgrade-insecure-requests"
].join('; ');
await writeFile('out/security-headers.json', JSON.stringify([
  {key: 'Content-Security-Policy', value: csp},
  {key: 'X-Frame-Options', value: 'SAMEORIGIN'},
  {key: 'Cross-Origin-Opener-Policy', value: 'same-origin'}
], null, 2) + '\n');
await writeFile('out/index.html', html);
console.log(`Static story: ${Buffer.byteLength(html)} HTML bytes, ${Buffer.byteLength(script)} JS bytes. Structured data preserved.`);
