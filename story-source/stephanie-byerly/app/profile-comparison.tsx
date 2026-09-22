function ProfileCounts({values}:{values:string[]}) {
  return <svg className="profile-counts" viewBox="0 0 880 1788" aria-hidden="true" focusable="false">
    {[273,435,623].map((x,i)=><g key={x}><rect x={x-2} y="315" width="115" height="34" fill="white"/><text x={x} y="342">{values[i]}</text></g>)}
  </svg>;
}
export default function ProfileComparison() {
  const images = '/crowned-stories/stephanie-byerly/images/';
  return <figure className="profile-comparison" aria-label="Stephanie’s Instagram before and after">
    <figcaption id="profile-compare-help"><strong>SLIDE TO SEE BEFORE/AFTER</strong></figcaption>
    <div className="profile-compare-stage">
      <div className="profile-compare-layer profile-compare-before"><img src={`${images}stephanie-instagram-before-original-v1.webp`} width="880" height="1788" alt="Before: Stephanie’s Instagram with her previous branding, 1,132 posts and 1,645 followers." loading="lazy" decoding="async" draggable={false}/><ProfileCounts values={["1,132", "1,645", "5,120"]}/></div>
      <div className="profile-compare-layer profile-compare-after"><img src={`${images}stephanie-instagram-after-original-v1.webp`} width="880" height="1788" alt="After: Stephanie’s coaching profile with her new branding, 1,236 posts and 2,960 followers." loading="lazy" decoding="async" draggable={false}/><ProfileCounts values={["1,236", "2,960", "5,338"]}/></div>
      <div className="profile-compare-divider" aria-hidden="true"><span><svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter"><path d="m10 7-5 5 5 5M5 12h9M30 7l5 5-5 5M26 12h9"/><path d="M20 6v12" opacity=".4"/></svg></span></div>
      <div className="profile-compare-range" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} aria-orientation="horizontal" aria-label="Before-and-after image divider" aria-valuetext="50% before, 50% after" aria-describedby="profile-compare-help"/>
    </div>
  </figure>;
}
