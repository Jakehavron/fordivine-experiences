import Arrow from './arrow';

const posts = ['DYnxxobCe_k','Dbtxh3Xkbkx','DZ5_KvWj1_P','DVhoNTzD34e','DchXYEePH2U','Db_uNvQSPdQ','DdJk0gxG7Lu','DU7EQdbiVCq'];

export default function SocialCarousel() {
  return <section className="chapter social-carousel" id="social-content" aria-labelledby="social-title" aria-roledescription="carousel">
    <p className="chapter-label"><span>Activation Social Content</span></p>
    <h2 id="social-title">A Clear Message Brought Online</h2>
    <p className="intro balanced-intro">Michelle brought her contrarian message onto social media that established her authority and is now being sought after for business and speaking opportunities.</p>
    <div className="social-carousel-heading"><div className="social-controls"><button type="button" aria-label="Previous Instagram posts" aria-controls="social-posts" data-carousel-direction="-1" disabled><Arrow direction="left"/></button><button type="button" aria-label="Next Instagram posts" aria-controls="social-posts" data-carousel-direction="1"><Arrow direction="right"/></button></div></div>
    <ul id="social-posts" className="social-track" aria-label="Michelle’s Instagram posts" tabIndex={0}>
      {posts.map((id,index)=><li key={id} className="social-card"><a href={`https://www.instagram.com/p/${id}/`} target="_blank" rel="noopener noreferrer" aria-label={`View on Instagram: Michelle’s post ${index+1} of ${posts.length} (opens in a new tab)`}><img src={`/crowned-stories/michelle-roby/images/michelle-post-${String(index+1).padStart(2,'0')}.webp`} alt={`Cover of Michelle Roby’s Instagram post ${index+1}`} width="1080" height="1350" loading="lazy"/><span className="social-card-label">View on Instagram <Arrow/></span></a></li>)}
    </ul>
    <p className="social-position" aria-live="polite" aria-atomic="true"><span className="social-count-mobile">Post 1</span><span className="social-count-tablet">Posts 1–2</span><span className="social-count-desktop">Posts 1–4</span> of {posts.length}</p>
  </section>;
}
