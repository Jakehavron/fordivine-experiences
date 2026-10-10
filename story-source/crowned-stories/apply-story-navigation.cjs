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
 html=html.replace(/<!-- fd-story-breadcrumb -->[\s\S]*?<!-- \/fd-story-breadcrumb -->/g,'').replace(/<!-- fd-story-navigation -->[\s\S]*?<!-- \/fd-story-navigation -->/g,'<!-- fd-story-nav-slot -->');
 const attrs=(placement,story='')=>`data-story-nav="${placement}" data-cs-category="${id}"${story?` data-cs-story="${story}"`:''}`;
 const crumb=`<!-- fd-story-breadcrumb --><nav class="fd-story-breadcrumb" aria-label="Breadcrumb"><ol><li><a href="/crowned-stories" ${attrs('breadcrumb')}>Crowned Stories</a></li><li><a href="${url}" ${attrs('breadcrumb')}>${esc(label)}</a></li><li><span aria-current="page">${esc(name)}</span></li></ol></nav><!-- /fd-story-breadcrumb -->`;
 const nav=`<!-- fd-story-navigation --><nav id="fd-story-explore" class="fd-story-navigation" aria-label="Explore more Crowned Stories"><a href="${url}" ${attrs('category_return')}>← Explore more ${esc(label)} stories</a><a class="fd-story-next" href="/crowned-stories/${next}" ${attrs('next_story',next)}>Next story: ${esc(nextName)} →</a></nav><!-- /fd-story-navigation -->`;
 if(html.includes('<article>'))html=html.replace('<article>','<article>'+crumb);
 else {const header=html.indexOf('</header>');if(header<0)throw Error('Missing header');html=html.slice(0,header+9)+crumb+html.slice(header+9);}
 const legacy=/<div\b[^>]*data-framer-name="CTA More work"[^>]*>/g.exec(html);
 if(html.includes('<!-- fd-story-nav-slot -->'))html=html.replace('<!-- fd-story-nav-slot -->',nav);
 else if(legacy){let depth=0,end=0;const re=/<div\b[^>]*>|<\/div>/g;re.lastIndex=legacy.index;let m;while((m=re.exec(html))){depth+=m[0]==='</div>'?-1:1;if(!depth){end=re.lastIndex;break;}}if(!end)throw Error('Unclosed next story navigation');html=html.slice(0,legacy.index)+nav+html.slice(end);}
 else if(html.includes('<section class="closing"'))html=html.replace('<section class="closing"',nav+'<section class="closing"');
 else { // Reapply to legacy exports where the original navigation was already replaced.
  const marker=html.indexOf('fd-inquiry-desktop');
  if(marker<0)throw Error('Missing navigation insertion point for '+slug);
  const start=html.lastIndexOf('<div',marker);html=html.slice(0,start)+nav+html.slice(start);
 }
 let found=false;
 const schema={'@context':'https://schema.org','@type':'BreadcrumbList',itemListElement:[['Crowned Stories','https://www.fordivine.com/crowned-stories'],[label,'https://www.fordivine.com'+url],[name,'https://www.fordivine.com/crowned-stories/'+slug]].map(([name,item],i)=>({'@type':'ListItem',position:i+1,name,item}))};
 html=html.replace(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/g,(tag,json)=>{let d;try{d=JSON.parse(json)}catch{return tag}function visit(x){if(!x||typeof x!=='object')return;if(x['@type']==='BreadcrumbList'){x.itemListElement=schema.itemListElement;found=true;}for(const v of Object.values(x))if(v&&typeof v==='object')visit(v);}visit(d);return tag.replace(json,JSON.stringify(d));});
 if(!found)html=html.replace('</head>',`<script type="application/ld+json">${JSON.stringify(schema)}</script></head>`);
 if(!html.includes('/story-navigation-v1.css'))html=html.replace('</head>','<link rel="stylesheet" href="/crowned-stories/media/story-navigation-v1.css"></head>');
 if(!html.includes('/story-navigation-v1.js'))html=html.replace('</body>','<script src="/crowned-stories/media/story-navigation-v1.js" defer></script></body>');
 return html;
}
module.exports={storyNavigation};
if(require.main===module){
 fs.mkdirSync(path.join(root,'media'),{recursive:true});
 for(const slug of Object.keys(data.stories)){const f=path.join(root,slug,'index.html');fs.writeFileSync(f,storyNavigation(fs.readFileSync(f,'utf8'),slug));}
 for(const asset of ['story-navigation-v1.css','story-navigation-v1.js'])fs.copyFileSync(path.join(__dirname,asset),path.join(root,'media',asset));
 console.log('Updated navigation on all nine stories.');
}
