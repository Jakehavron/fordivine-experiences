'use client';

import { useEffect, useRef, useState } from 'react';

const posts = ['DYnxxobCe_k','Dbtxh3Xkbkx','DZ5_KvWj1_P','DVhoNTzD34e','DchXYEePH2U','Db_uNvQSPdQ','DdJk0gxG7Lu','DU7EQdbiVCq'];

export default function SocialCarousel() {
  const track = useRef<HTMLUListElement>(null);
  const [position, setPosition] = useState({first:1,last:4,start:true,end:false});
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => {
      const cards = [...el.children] as HTMLElement[];
      const step = cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : el.clientWidth;
      const first = Math.round(el.scrollLeft / step) + 1;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const visible = Math.max(1, Math.round((el.clientWidth + gap) / step));
      const atEnd = el.scrollLeft >= el.scrollWidth - el.clientWidth - 2;
      setPosition({first, last:atEnd ? posts.length : Math.min(posts.length,first + visible - 1),start:el.scrollLeft < 2,end:atEnd});
    };
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener('scroll',update,{passive:true});
    update();
    return () => { observer.disconnect(); el.removeEventListener('scroll',update); };
  },[]);
  const move = (direction:number) => {
    const el=track.current;
    if(!el) return;
    const cards=[...el.children] as HTMLElement[];
    const step=cards[1].offsetLeft-cards[0].offsetLeft;
    const count=innerWidth>1000?4:innerWidth>700?2:1;
    el.scrollBy({left:direction*step*count,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});
  };
  return <section className="chapter social-carousel" id="social-content" aria-labelledby="social-title" aria-roledescription="carousel">
    <p className="chapter-label"><span>Activation Social Content</span></p>
    <h2 id="social-title">A Clear Message Brought Online</h2>
    <p className="intro balanced-intro">Michelle brought her contrarian message onto social media that established her authority and is now being sought after for business and speaking opportunities.</p>
    <div className="social-carousel-heading"><div className="social-controls"><button type="button" aria-label="Previous Instagram posts" aria-controls="social-posts" disabled={position.start} onClick={()=>move(-1)}>←</button><button type="button" aria-label="Next Instagram posts" aria-controls="social-posts" disabled={position.end} onClick={()=>move(1)}>→</button></div></div>
    <ul id="social-posts" ref={track} className="social-track" aria-label="Michelle’s Instagram posts" tabIndex={0} onKeyDown={event=>{if(event.key==='ArrowRight'||event.key==='ArrowLeft'){event.preventDefault();move(event.key==='ArrowRight'?1:-1);}if(event.key==='Home'||event.key==='End'){event.preventDefault();track.current?.scrollTo({left:event.key==='Home'?0:track.current.scrollWidth,behavior:'auto'});}}}>
      {posts.map((id,index)=><li key={id} className="social-card"><a href={`https://www.instagram.com/p/${id}/`} target="_blank" rel="noopener noreferrer" aria-label={`View on Instagram: Michelle’s post ${index+1} of ${posts.length} (opens in a new tab)`}><img src={`/crowned-stories/michelle-roby/images/michelle-post-${String(index+1).padStart(2,'0')}.webp`} alt={`Cover of Michelle Roby’s Instagram post ${index+1}`} width="1080" height="1350" loading="lazy"/><span className="social-card-label">View on Instagram <span aria-hidden="true">↗</span></span></a></li>)}
    </ul>
    <p className="social-position" aria-live="polite" aria-atomic="true">{position.first===position.last?`Post ${position.first}`:`Posts ${position.first}–${position.last}`} of {posts.length}</p>
  </section>;
}
