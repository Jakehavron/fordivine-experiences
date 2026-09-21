import {readFile, writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
// This route is published as static HTML, not as a Next.js runtime application.
// Its only JS behaviors live in story-interactions.js; including scroll-responsive results and the Instagram carousel.
const script = await readFile(new URL('./story-interactions.js', import.meta.url), 'utf8');
const hash = createHash('sha256').update(script).digest('hex').slice(0,12);
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
html = html.replace('</body>', `<script src="/crowned-stories/stephanie-byerly/${scriptName}" defer></script></body>`);
await writeFile('out/index.html', html);
console.log(`Static story: ${Buffer.byteLength(html)} HTML bytes, ${Buffer.byteLength(script)} JS bytes. Structured data preserved.`);
