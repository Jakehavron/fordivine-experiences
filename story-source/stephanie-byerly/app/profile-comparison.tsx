export default function ProfileComparison() {
  const images = '/crowned-stories/stephanie-byerly/images/';
  return <figure className="profile-comparison" aria-label="Stephanie’s Instagram before and after">
    <div className="profile-compare-stage">
      <img className="profile-compare-before" src={`${images}stephanie-instagram-before-original-v1.webp`} width="880" height="1788" alt="Before: Stephanie’s Instagram with her previous branding, 1,132 posts and 1,645 followers." loading="lazy" decoding="async" draggable={false}/>
      <img className="profile-compare-after" src={`${images}stephanie-instagram-after-original-v1.webp`} width="880" height="1788" alt="After: Stephanie’s coaching profile with her new branding, 1,236 posts and 2,960 followers." loading="lazy" decoding="async" draggable={false}/>
      <div className="profile-compare-divider" aria-hidden="true"><span><svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter"><path d="m10 7-5 5 5 5M5 12h9M30 7l5 5-5 5M26 12h9"/><path d="M20 6v12" opacity=".4"/></svg></span></div>
      <div className="profile-compare-range" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} aria-orientation="horizontal" aria-label="Before-and-after image divider" aria-valuetext="50% before, 50% after" aria-describedby="profile-compare-help"/>
    </div>
    <figcaption id="profile-compare-help"><strong>SLIDE TO SEE BEFORE/AFTER</strong></figcaption>
  </figure>;
}
