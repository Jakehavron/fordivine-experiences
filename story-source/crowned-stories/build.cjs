// Run with Node.js and sharp 0.34.x / clean-css 5.3.x available.
// Keeps the editable HTML readable while generating minified production CSS.
const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');
const CleanCSS = require('clean-css');
const root = path.resolve(__dirname, '../../fordivine-upload-to-github');
const out = path.join(root, 'crowned-stories/media/performance-v1');
async function build() {
  fs.mkdirSync(out, { recursive: true });
  let html = fs.readFileSync(path.join(__dirname, 'index.html'), 'utf8');
  const fonts = fs.readFileSync(path.join(root, 'fonts.css'), 'utf8') + `
/* Arial fallback matched to Source Sans 3's average advance and vertical metrics. */
@font-face{font-family:'Source Sans 3 Fallback';src:local('Arial');size-adjust:85.1184%;ascent-override:120.303%;descent-override:46.9933%;line-gap-override:0%;}
`;
  html = html.replace('<style data-crowned-fonts></style>', '<style data-crowned-fonts>' + fonts + '</style>');
  html = html.replace('<style data-crowned-media></style>', '<style data-crowned-media>' + fs.readFileSync(path.join(root, 'deferred-media.css'), 'utf8') + '</style>');
  let images = 0, originals = 0, mobileBytes = 0;
  const pattern = /(<div class="proof-carousel-slide"[^>]*>\s*)(<img[^>]+>)/g;
  for (const match of [...html.matchAll(pattern)]) {
    const tag = match[2], src = tag.match(/src="([^"]+)"/)[1];
    const source = path.join(root, src.slice(1));
    const meta = await sharp(source).metadata();
    const maxWidth = Math.floor(Math.min(meta.width, meta.height * 0.75));
    const widths = [...new Set([300, 450, 600, 900].filter(w => w < maxWidth).concat(Math.min(maxWidth, 900)))];
    const stem = path.basename(src, path.extname(src));
    const variants = [];
    for (const width of widths) {
      const file = stem + '-' + width + '.webp';
      await sharp(source).resize(width, Math.round(width * 4 / 3), {fit: 'cover', position: 'north'}).webp({quality: 88, effort: 6}).toFile(path.join(out, file));
      variants.push({width, url:'/crowned-stories/media/performance-v1/' + file, bytes:fs.statSync(path.join(out,file)).size});
    }
    const preferred = variants.find(v => v.width >= 600) || variants.at(-1);
    let updated = tag.replace(/src="[^"]+"/, 'src="'+preferred.url+'" srcset="'+variants.map(v=>v.url+' '+v.width+'w').join(', ')+'" sizes="(max-width: 520px) 286px, 333px"');
    // Derivatives match the existing 3:4 frame and center-top object-fit crop.
    updated = updated.replace(/width="\d+"/, 'width="'+preferred.width+'"').replace(/height="\d+"/, 'height="'+Math.round(preferred.width*4/3)+'"');
    html = html.replace(match[0], match[1]+updated);
    images++; originals += fs.statSync(source).size; mobileBytes += preferred.bytes;
  }
  html = html.replace(/<style([^>]*)>([\s\S]*?)<\/style>/g, (_,attrs,css) => {
    const result = new CleanCSS({level:1, rebase:false}).minify(css);
    if(result.errors.length) throw new Error(result.errors.join('\n'));
    return '<style'+attrs+'>'+result.styles+'</style>';
  });
  fs.writeFileSync(path.join(root,'crowned-stories/index.html'), html);
  fs.copyFileSync(path.join(__dirname,'deferred-media.js'),path.join(root,'crowned-stories/media/deferred-media-v2.js'));
  console.log(JSON.stringify({images,originalBytes:originals,selected600pxBytes:mobileBytes,savedBytes:originals-mobileBytes}));
}
build().catch(error => {console.error(error);process.exitCode=1;});
