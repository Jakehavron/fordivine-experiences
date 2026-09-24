import {readFile,writeFile,cp,mkdir} from 'node:fs/promises';
import {fileURLToPath} from 'node:url';
import path from 'node:path';
const source=fileURLToPath(new URL('../',import.meta.url));
const target=path.resolve(source,'../../fordivine-upload-to-github/crowned-stories/amy-lacey');
const html=await readFile(path.join(source,'out/index.html'),'utf8');
if(/noindex|REVIEW PREVIEW|Image placeholder|SLIDE TO SEE BEFORE/.test(html))throw Error('Draft content remains');
await mkdir(target,{recursive:true});
await cp(path.join(source,'public'),target,{recursive:true,filter:p=>!/^amy-.*\.svg$/.test(path.basename(p))});
await writeFile(path.join(target,'index.html'),html);
const script=html.match(/src="\/crowned-stories\/amy-lacey\/(story-interactions-[a-f0-9]+\.js)"/)[1];
await cp(path.join(source,'out',script),path.join(target,script));
console.log('Published static output:',target);

// Keep the exact script hashes in the response policy synchronized on every build.
const configPath=path.resolve(target,'../../vercel.json');
const config=JSON.parse(await readFile(configPath,'utf8'));
const headers=JSON.parse(await readFile(path.join(source,'out/security-headers.json'),'utf8'));
for(const route of ['/crowned-stories/amy-lacey','/crowned-stories/amy-lacey/','/crowned-stories/amy-lacey/index.html']){
 const rule=config.headers.find(rule=>rule.source===route);
 if(rule)rule.headers=[...rule.headers.filter(header=>!headers.some(next=>next.key.toLowerCase()===header.key.toLowerCase())),...headers];
 else config.headers.unshift({source:route,headers});
}
await writeFile(configPath,JSON.stringify(config,null,2)+'\n');
