import StoryExperience from './story-experience';
import SocialCarousel from './social-carousel';
import SiteFooter from './site-footer';
import './site-footer.css';
const Arrow = () => <span className="story-arrow" aria-hidden="true">↗</span>;
const schema = { '@context': 'https://schema.org', '@graph': [
  { '@type': 'Article', headline: 'From no personal brand or online presence to now getting consulting clients and paid speaking inquiries.', description: 'How Michelle Roby made her experience visible through personal-brand positioning, visual identity, and a website with FORDIVINE.', author: {'@type':'Organization',name:'FORDIVINE',url:'https://www.fordivine.com/'}, publisher:{'@type':'Organization',name:'FORDIVINE',url:'https://www.fordivine.com/'}, about:{'@type':'Person',name:'Michelle Roby',url:'https://michelleroby.com/',jobTitle:'Founder of Electric Rays Tanning'}, inLanguage:'en-US', articleSection:'Crowned Stories' },
  {'@type':'BreadcrumbList',itemListElement:[{'@type':'ListItem',position:1,name:'FORDIVINE',item:'https://www.fordivine.com/'},{'@type':'ListItem',position:2,name:'Crowned Stories',item:'https://www.fordivine.com/crowned-stories'},{'@type':'ListItem',position:3,name:'Michelle Roby'}]}
]};
export default function StoryPage() {
return <>
  <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,'\\u003c')}}/>
  <a className="skip" href="#story">Skip to Michelle’s story</a>
  <header className="header"><a href="https://www.fordivine.com/discover" className="wordmark" aria-label="FORDIVINE home"><img src="/crowned-stories/michelle-roby/images/fordivine-logo.webp" alt="FORDIVINE" width="1287" height="201"/></a><nav className="site-nav" aria-label="Main navigation"><a href="https://www.fordivine.com/about-us">About Us</a><a href="https://www.fordivine.com/crowned-stories">Crowned Stories</a><a href="https://www.fordivine.com/discover">Contact</a><a href="https://www.fordivine.com/discover">Services</a></nav><details className="mobile-menu"><summary>Menu <span aria-hidden="true">+</span></summary><nav aria-label="Mobile navigation"><a href="https://www.fordivine.com/about-us">About Us</a><a href="https://www.fordivine.com/crowned-stories">Crowned Stories</a><a href="https://www.fordivine.com/discover">Contact</a><a href="https://www.fordivine.com/discover">Services</a></nav></details></header>
<main id="story" className="michelle-story" tabIndex={-1}>
<article>
      <div className="identity-masthead wrap"><a className="back-link" href="https://www.fordivine.com/crowned-stories">All Crowned Stories <Arrow/></a><p className="client-name">Michelle Roby</p><p className="client-role"><span>Founder of Electric Rays Tanning</span><span aria-hidden="true">⊹</span><span>Small Business Owner</span></p></div>
<section className="hero" id="overview" aria-labelledby="story-title">
  <div className="hero-layout">
    <div className="hero-copy"><p className="eyebrow"><span className="section-number" aria-hidden="true">00</span><span className="section-label">The transformation</span></p><h1 id="story-title"><span>From no personal brand</span> <span>or online presence to now</span> <span>getting consulting clients</span> <span>and paid speaking inquiries.</span></h1>
    <p className="hero-intro">Michelle had built a successful business, but her personal presence online revealed little of the woman behind it. Together, we gave her experience a clear message, a distinctive identity, and a place for people to discover how to work with her.</p></div>
    <figure className="hero-portrait" data-asset="hero-portrait"><img src="/crowned-stories/michelle-roby/images/michelle-roby-portrait-800.webp" srcSet="/crowned-stories/michelle-roby/images/michelle-roby-portrait-480.webp 480w, /crowned-stories/michelle-roby/images/michelle-roby-portrait-600.webp 600w, /crowned-stories/michelle-roby/images/michelle-roby-portrait-800.webp 800w" sizes="(max-width: 700px) 320px, 400px" alt="Michelle Roby smiling in a black top" width="1254" height="1254" fetchPriority="high"/></figure>
  </div>
  <div className="snapshot" aria-label="Her Transformation at a Glance"><h2>Her Transformation at a Glance</h2><div className="snapshot-fields">
    <div><h3>Starting point</h3><p>An established small business owner with:</p><ul><li>No clarity on brand message or voice</li><li>No personal brand</li><li>No digital presence or ranking</li><li>No secondary revenue verticals</li></ul></div>
    <div><h3>What we built</h3><ul><li>Clear Brand Strategy</li><li>Business + Marketing Blueprint</li><li>Full Visual Identity</li><li>Premium Social Content</li><li>Personal Website (Digital HQ)</li></ul></div>
    <div><h3>The Results</h3><ul><li>New Consulting Deals</li><li>Multiple (paid) Speaking Inquiries</li><li>Increased Social Engagement</li><li>More Company Leads + Job Applications</li></ul></div>
  </div></div>
</section>
<section className="chapter" id="starting-point" tabIndex={-1} aria-labelledby="before-title">
  <p className="chapter-label"><span className="chapter-number" aria-hidden="true">01</span><span>Before the Crown</span></p>
  <h2 id="before-title"><span>An established business. An</span> <span>underdeveloped personal brand.</span></h2>
  <p className="intro">Michelle had built Electric Rays to 10 locations. Behind that accomplishment was a woman still questioning how her experience could translate into a public brand of her own.</p>
  <p>When she came to FORDIVINE:</p>
  <ul className="problem-list">
    <li><strong>Her expertise was difficult to discover.</strong> Her personal social presence consisted largely of older family photographs, with little about her business knowledge or leadership.</li>
    <li><strong>Trust was built only in-person.</strong> As her business expanded, she wanted prospective employees, clients, and partners to understand who was leading it.</li>
    <li><strong>Her next chapter lacked a clear shape.</strong> She wanted to help other business owners, but needed to define how her experience could become a consulting offer.</li>
    <li><strong>She questioned whether people would seek her out.</strong> Speaking interested her, but being recognized as a professional speaker still felt unfamiliar.</li>
  </ul>
  <p className="section-close">She brought substantial experience. What she needed was a clear way to communicate it and begin putting it to use beyond her existing businesses.</p>
</section>
<section className="chapter" id="the-work" tabIndex={-1} aria-labelledby="unveiling-title">
  <p className="chapter-label"><span className="chapter-number" aria-hidden="true">02</span><span>The Unveiling</span></p>
  <h2 id="unveiling-title">Three goals gave the work direction.</h2>
  <p className="intro">We began by drawing out Michelle’s experience, ambitions, and approach to business. That work helped us connect what she already knew with the opportunities she wanted to pursue.</p>
  <ol className="goal-grid" role="list">
    <li><span className="goal-number" aria-hidden="true">1</span><h3>Build trust beyond her physical presence.</h3><p>Michelle wanted people to understand her leadership without needing a personal introduction. We needed to make the woman behind Electric Rays more visible through clear positioning, messaging, and a consistent public presence.</p></li>
    <li><span className="goal-number" aria-hidden="true">2</span><h3>Turn her experience into a consulting offer.</h3><p>She wanted to help other business owners. We worked to organize her knowledge into signature methods and explain whom she could help, what she could help them with, and how to work with her.</p></li>
    <li><span className="goal-number" aria-hidden="true">3</span><h3>Be considered for speaking opportunities.</h3><p>Michelle wanted to share her knowledge with a wider audience. Her brand needed to make her expertise relevant to event organizers and give them a clear way to inquire.</p></li>
  </ol>
</section>
<section className="chapter blueprint-card" id="business-blueprint" aria-labelledby="blueprint-title">
  <p className="chapter-label"><span>The Business + Marketing Blueprint</span></p>
  <h2 id="blueprint-title" className="two-line-title"><span>The White Space</span> <span>Brand Positioning</span></h2>
  <div className="narrative"><p>We know how to extract the Brand DNA of who Michelle is while also researching the entire market so she can be authentically herself while not getting lost in the sea of noise or looking like everyone else.</p>
  <p>This is how you own your space as a Crowned Authority.</p></div>
  <figure className="brand-showcase strategy-image" data-asset="strategy-overview"><picture><source media="(max-width: 700px)" srcSet="/crowned-stories/michelle-roby/images/michelle-strategy-mobile.webp" width="819" height="1110"/><img src="/crowned-stories/michelle-roby/images/michelle-strategy-desktop.webp" alt="Brand strategy blueprint covering authority, brand strategy, ideal client, voice and message, story and sales message, offer suite, content pillars, and market position" width="1640" height="580" loading="lazy"/></picture></figure>
</section>
<section className="chapter" id="brand-identity" tabIndex={-1} aria-labelledby="building-title">
  <p className="chapter-label"><span className="chapter-number" aria-hidden="true">03</span><span>Building the Crown</span></p>
  <h2 id="building-title" className="two-line-title"><span>A visual identity</span> <span>that represented her.</span></h2>
  <p className="intro">The visual direction needed to reflect Michelle’s taste and the relationships she wanted to build. We translated that brief into an identity with three priorities:</p>
  <ul className="creative-list">
    <li><strong>Polished and luxurious.</strong> Reflect her personal style and give her expertise a considered, professional presentation.</li>
    <li><strong>Warm and approachable.</strong> Preserve the humanity of a leader who cares about people and wants to help other owners.</li>
    <li><strong>Personal and recognizable.</strong> Carry a consistent expression of Michelle across her brand materials and website, so each touchpoint feels connected to the same woman.</li>
  </ul>
  <p className="section-close">These choices gave the creative work a clear purpose. The resulting identity needed to feel natural to Michelle and make sense to the people she hoped to reach.</p>
  <figure className="brand-showcase brand-overview" data-asset="brand-bible"><img src="/crowned-stories/michelle-roby/images/michelle-brand-overview.webp" alt="Michelle Roby’s gold wordmark and monogram on a deep green textured background" width="1263" height="712" loading="lazy"/></figure>
  <div className="application-grid">
    <figure className="brand-showcase" data-asset="identity-application-1"><img src="/crowned-stories/michelle-roby/images/michelle-brand-monogram.webp" alt="Michelle Roby’s embossed green wordmark and gold business guidance seal" width="723" height="801" loading="lazy"/></figure>
    <figure className="brand-showcase" data-asset="identity-application-2"><img src="/crowned-stories/michelle-roby/images/michelle-business-cards.webp" alt="Green and cream Michelle Roby business cards displayed on a black tray" width="724" height="803" loading="lazy"/></figure>
    <figure className="brand-showcase" data-asset="identity-application-3"><img src="/crowned-stories/michelle-roby/images/michelle-branded-letter.webp" alt="Michelle Roby’s branded letter inside a deep green envelope with gold lettering" width="726" height="802" loading="lazy"/></figure>
    <figure className="brand-showcase" data-asset="identity-application-4"><img src="/crowned-stories/michelle-roby/images/michelle-brand-mission.webp" alt="Michelle Roby’s mission statement, portrait, and branded stationery in an editorial arrangement" width="722" height="801" loading="lazy"/></figure>
  </div>
</section>
<section className="chapter" id="stepping-into-view" tabIndex={-1} aria-labelledby="activation-title">
  <p className="chapter-label"><span className="chapter-number" aria-hidden="true">04</span><span>THE BRAND ASSETS</span></p>
  <p className="asset-eyebrow">Personal Website That Converts</p>
  <h2 id="activation-title">Let Your Ideal Client Find You First</h2>
  <p className="intro">Through an optimized website, people searching on Google or asking their AI for solutions that Michelle provides, she will be the one that shows up and makes it clear she’s the right fit.</p>
  <figure className="brand-showcase" data-asset="digital-hq"><img src="/crowned-stories/michelle-roby/images/michelle-digital-hq.webp" alt="Michelle Roby’s Digital HQ website, featuring her portrait and the headline Build a business that works for your real life" width="1574" height="948" loading="lazy"/></figure>
  <p className="caption">A digital HQ for people to understand her experience and take the next step in working with her.</p>
</section>
<SocialCarousel/>
<section className="chapter brand-vault" id="brand-vault" aria-labelledby="vault-title">
  <p className="chapter-label"><span>THE BRAND VAULT</span></p>
  <h2 id="vault-title" className="two-line-title"><span>Keeping Your</span> <span>Brand Cohesive</span></h2>
  <p className="intro balanced-intro">Have everything housed in one place with clear guidelines, do’s and don’ts, and never have to wonder how to put your brand into action again.</p>
  <figure className="brand-showcase"><picture><source media="(max-width: 700px)" srcSet="/crowned-stories/michelle-roby/images/michelle-brand-vault-mobile.webp" width="652" height="1070"/><img src="/crowned-stories/michelle-roby/images/michelle-brand-vault-desktop.webp" alt="Michelle Roby’s Brand Vault with her brand bible, mission, mood board, color palette, logos, logo file types, fonts, brand pillars, mockups, and social media graphics" width="1515" height="516" loading="lazy"/></picture></figure>
</section>
<section className="chapter story-results" id="what-changed" tabIndex={-1} aria-labelledby="results-title">
  <p className="chapter-label"><span className="chapter-number" aria-hidden="true">05</span><span>Crowned Authority Reigning</span></p>
  <h2 id="results-title" className="two-line-title"><span>Real Results.</span> <span>Real Business Outcomes.</span></h2>
  <p className="intro balanced-intro">After Michelle began sharing her expertise and launched her website, people had a clearer way to discover what she offered. Two developments made that change tangible.</p>
  <div className="outcome-grid">
    <article className="outcome outcome-consulting"><p className="outcome-display"><span className="metric">5</span><span>MONTHS</span></p><h3>A consulting engagement through her website.</h3><p>An inquiry became a five-month engagement with a business leader seeking support with team and sales growth.</p></article>
    <article className="outcome outcome-speaking"><p className="outcome-display speaking-display"><span>PAID</span><span>SPEAKING</span></p><h3>An opportunity offered within weeks of launch.</h3><p>Michelle received speaking inquiries, including an offer for a paid speaking opportunity at a local business event.</p></article>
  </div>
</section>
<section className="chapter lesson" id="the-lesson" tabIndex={-1} aria-labelledby="lesson-title">
  <h2 id="lesson-title" className="chapter-label"><span className="chapter-number" aria-hidden="true">06</span><span>The Crowned Lesson</span></h2>
  <div className="testimonial-panel">
    <blockquote><p>“I had spent years building my business, but I struggled to see what I could offer beyond it.</p><p>Working with FORDIVINE helped me put that experience into words and build a brand that felt like me.</p><p>Seeing people reach out about consulting and speaking made those possibilities feel real.”</p></blockquote>
    <p className="quote-attribution">- Michelle Roby<span>Founder of Electric Rays Tanning</span></p>
  </div>
  <figure className="brand-showcase testimonial-media"><img src="/crowned-stories/michelle-roby/images/michelle-media-kit.webp" alt="Michelle Roby’s media kit featuring her portrait and her leadership of Electric Rays Tanning" width="1440" height="809" loading="lazy"/></figure>
</section>
</article><section className="closing" aria-labelledby="closing-title"><h2 id="closing-title">Is Your Personal Brand Limiting Your Business Growth?</h2><div className="closing-copy"><p>A scattered and unclear brand keeps you completely invisible in today’s digital landscape.</p><p>We build premium brand ecosystems for business women to get more <strong>clients</strong>, <strong>stages</strong>, &amp; <strong>business growth</strong>.</p></div><a className="button" href="https://www.fordivine.com/discover#book">Schedule Discovery Call Today <Arrow/></a></section>
<nav className="next-story" aria-label="Next Crowned Story"><a className="button" href="https://www.fordivine.com/crowned-stories/beth-clifford">View Next Crowned Story <Arrow/></a></nav>
</main>
  <StoryExperience/>
  <SiteFooter/>
</>;
}
