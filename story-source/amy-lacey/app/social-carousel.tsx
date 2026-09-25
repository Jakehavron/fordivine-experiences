import Arrow from './arrow';
const reels = [
 {number:5,title:'Podcast Launch Creative',type:'Music + visual storytelling'},
 {number:2,title:'Beyond the cauliflower company',type:'Amy’s voice'},
 {number:3,title:'Creative brand film',type:'Music + visual storytelling'},
 {number:4,title:'Serve the person',type:'Amy’s voice'},
 {number:1,title:'Creative brand film',type:'Music + visual storytelling'},
 {number:6,title:'A conversation about balance',type:'Amy’s voice'},
];
export default function SocialCarousel() {
return <section className="chapter social-carousel" id="social-content" aria-labelledby="social-title" aria-roledescription="carousel">
<p className="chapter-label"><span>Social Activation Content</span></p><h2 id="social-title"><span className="heading-desktop">Eloquently bringing her message to the world.</span><span className="heading-mobile"><span>Eloquently bringing her</span><span>message to the world.</span></span></h2>
<p className="intro balanced-intro">We created a collection of content that gives Amy’s brand a voice and a visual presence. Creative films bring the feeling of her brand to life, while speaking reels let women hear her story and perspective in her own words.</p>
<div className="social-carousel-heading"><div className="social-controls"><button type="button" aria-label="Previous videos" aria-controls="social-posts" data-carousel-direction="-1" disabled><Arrow direction="left"/></button><button type="button" aria-label="Next videos" aria-controls="social-posts" data-carousel-direction="1"><Arrow direction="right"/></button></div></div>
<ul id="social-posts" className="social-track reel-track" aria-label="Six videos created for Amy, alternating creative films and speaking reels" tabIndex={0}>{reels.map((reel,index)=><li key={reel.number} className="social-card reel-card"><div className="reel-player"><video controls playsInline preload="none" data-poster={`/crowned-stories/amy-lacey/images/reels/amy-reel-${String(reel.number).padStart(2,'0')}-selected-frame.webp`} aria-label={reel.title} width="720" height="1280"><source src={`/crowned-stories/amy-lacey/videos/amy-reel-${String(reel.number).padStart(2,'0')}.mp4`} type="video/mp4"/>Your browser does not support embedded video.</video></div><div className="reel-caption"><span>{String(index+1).padStart(2,'0')} / {reel.type}</span><h3>{reel.title}</h3></div></li>)}</ul>
<p className="social-position" aria-live="polite" aria-atomic="true">6 videos</p>
</section>;
}
