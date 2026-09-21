export default function ProfileComparison() {
  const images = '/crowned-stories/michelle-roby/images/';
  return <figure className="profile-comparison" aria-label="Michelle’s Instagram before and after">
    <div className="profile-compare-labels"><button type="button" data-profile-position="0">Before</button><button type="button" data-profile-position="100">After</button></div>
    <div className="profile-compare-stage">
      <img className="profile-compare-before" src={`${images}michelle-instagram-before-original-v1.webp`} width="880" height="1788" alt="Before: Michelle’s personal Instagram with family photos, 6 posts and 722 followers." loading="lazy" decoding="async" draggable={false}/>
      <img className="profile-compare-after" src={`${images}michelle-instagram-after-original-v1.webp`} width="880" height="1788" alt="After: Michelle’s business guidance profile with branded posts, 41 posts and 1,269 followers." loading="lazy" decoding="async" draggable={false}/>
      <div className="profile-compare-divider" aria-hidden="true"><span><svg viewBox="0 0 32 20" fill="none" stroke="currentColor" strokeWidth="2"><path d="m10 4-6 6 6 6M22 4l6 6-6 6"/></svg></span></div>
      <input className="profile-compare-range" type="range" min="0" max="100" step="1" defaultValue="50" aria-label="Reveal Michelle’s after profile" aria-valuetext="50% after profile revealed" aria-describedby="profile-compare-help"/>
    </div>
    <figcaption id="profile-compare-help">Drag left or right to see the transformation.<span>Before reconstructed from prior profile details.</span></figcaption>
  </figure>;
}
