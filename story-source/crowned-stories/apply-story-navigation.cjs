const fs=require('node:fs');
const path=require('node:path');
const data=require('./collections.json');
const root=path.resolve(__dirname,'../../fordivine-upload-to-github/crowned-stories');
const esc=s=>s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/"/g,'&quot;');
function storyNavigation(html,slug){
 html=html.replace(/<nav class="next-story"[^>]*>[\s\S]*?<\/nav>/g,'');
 const category=data.categories.find(([id])=>data.members[id].includes(slug));
 if(!category)throw Error('Unknown story '+slug);
 const [id,label]=category,members=data.members[id],next=members[(members.indexOf(slug)+1)%members.length];
 const name=data.stories[slug].name,nextName=data.stories[next].name,url='/crowned-stories/'+id;
 html=html.replace(/<!-- fd-story-breadcrumb -->[\s\S]*?<!-- \/fd-story-breadcrumb -->/g,'').replace(/<!-- fd-story-navigation -->[\s\S]*?<!-- \/fd-story-navigation -->/g,'');
 const attrs=(placement,story='')=>`data-story-nav="${placement}" data-cs-category="${id}"${story?` data-cs-story="${story}"`:''}`;
 const crumb=`<!-- fd-story-breadcrumb --><nav class="fd-story-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/crowned-stories" ${attrs('breadcrumb')}>Crowned Stories</a></li><li><a href="${url}" ${attrs('breadcrumb')}>${esc(label)}</a></li><li><span aria-current="page">${esc(name)}</span></li></ol></nav><!-- /fd-story-breadcrumb -->`;
 const nav=`<!-- fd-story-navigation --><nav id="fd-story-explore" class="fd-story-navigation" aria-label="Explore more Crowned Stories"><a href="${url}" ${attrs('category_return')}>← Explore more ${esc(label)} stories</a><a class="fd-story-next" href="/crowned-stories/${next}" ${attrs('next_story',next)}>Next story: ${esc(nextName)} →</a></nav><!-- /fd-story-navigation -->`;
 if(html.includes('<article>'))html=html.replace('<article>','<article>'+crumb);
 else {const header=html.indexOf('</header>');if(header<0)throw Error('Missing header');html=html.slice(0,header+9)+crumb+html.slice(header+9);}
 // Remove the retired legacy next-story block, then place navigation after the closing CTA.
 function endOfElement(start,tag){let depth=0;const re=new RegExp('<'+tag+'\\b[^>]*>|<\\/'+tag+'>','g');re.lastIndex=start;let m;while((m=re.exec(html))){depth+=m[0].startsWith('</')?-1:1;if(!depth)return re.lastIndex;}throw Error('Unclosed '+tag+' in '+slug);}
 const legacy=/<div\b[^>]*data-framer-name="CTA More work"[^>]*>/g.exec(html);
 if(legacy){const end=endOfElement(legacy.index,'div');html=html.slice(0,legacy.index)+html.slice(end);}
 // Replace every retired responsive inquiry variant with one stable shared ending.
 const oldInquiry=/<div\b[^>]*class="[^"]*\bfd-inquiry-(?:desktop|tablet|phone)\b[^"]*"[^>]*>/g;
 let inquiry, firstInquiry=-1;
 while((inquiry=oldInquiry.exec(html))){
  if(firstInquiry<0)firstInquiry=inquiry.index;
  const end=endOfElement(inquiry.index,'div');
  html=html.slice(0,inquiry.index)+html.slice(end);oldInquiry.lastIndex=inquiry.index;
 }
 if(firstInquiry>=0)html=html.slice(0,firstInquiry)+fs.readFileSync(path.join(__dirname,'story-ending.html'),'utf8')+html.slice(firstInquiry);
 if(html.includes('class="fd-story-ending"')&&!html.includes('/story-ending-v1.css'))html=html.replace('</head>','<link rel="stylesheet" href="/crowned-stories/media/story-ending-v1.css"></head>');
 const closing=/<section\b[^>]*class="closing"[^>]*>/g.exec(html);
 let insertion;
 if(closing)insertion=endOfElement(closing.index,'section');
 else {
  const variants=Array.from(html.matchAll(/<div\b[^>]*class="[^"]*\bfd-inquiry-(?:desktop|tablet|phone)\b[^"]*"[^>]*>/g));
  if(!variants.length)throw Error('Missing closing CTA in '+slug);
  insertion=endOfElement(variants[variants.length-1].index,'div');
 }
 html=html.slice(0,insertion)+nav+html.slice(insertion);
 let found=false;
 const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[['Crowned Stories','https://www.fordivine.com/crowned-stories'],[label,'https://www.fordivine.com'+url],[name,'https://www.fordivine.com/crowned-stories/'+slug]].map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))};
 html=html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g,(tag,json)=>{let d;try{d=JSON.parse(json)}catch{return tag}function visit(x){if(!x||typeof x!=='object')return;if(x['@type']==='BreadcrumbList'){x.itemListElement=schema.itemListElement;found=true;}for(const v of Object.values(x))if(v&&typeof v==='object')visit(v);}visit(d);return tag.replace(json,JSON.stringify(d));});
 if(!found)html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
 if(!html.includes('/story-navigation-v1.css'))html=html.replace('</head>','<link rel="stylesheet" href="/crowned-stories/media/story-navigation-v1.css"></head>');
 if(!html.includes('/story-navigation-v1.js'))html=html.replace('</body>','<script src="/crowned-stories/media/story-navigation-v1.js" defer></script></body>');
 html=html.replace(/story-navigation-v1\.css(?:\?[^"]*)?/g,'story-navigation-v1.css?v=20261009-below-cta');
 return html;
}
module.exports={storyNavigation};
if(require.main===module){
 fs.mkdirSync(path.join(root,'media'),{recursive:true});
 for(const slug of Object.keys(data.stories)){const f=path.join(root,slug,'index.html');fs.writeFileSync(f,storyNavigation(fs.readFileSync(f,'utf8'),slug));}
 for(const asset of ['story-navigation-v1.css','story-navigation-v1.js','story-ending-v1.css'])fs.copyFileSync(path.join(__dirname,asset),path.join(root,'media',asset));
 console.log('Updated navigation on all nine stories.');
}
