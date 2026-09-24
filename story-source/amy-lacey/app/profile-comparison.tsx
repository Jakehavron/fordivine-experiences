export default function ProfileComparison() {
  const images = '/crowned-stories/amy-lacey/images/';
  return <figure className="profile-comparison" aria-label="Amy’s Instagram before and after">
    <figcaption id="profile-compare-help"><strong>SLIDE TO SEE BEFORE/AFTER</strong></figcaption>
    <div className="profile-compare-stage">
      <div className="profile-compare-layer profile-compare-before"><img src={`${images}amy-before.svg`} width="880" height="1788" alt="Placeholder for Amy’s Instagram before the brand work" loading="lazy" decoding="async" draggable={false}/></div>
      <div className="profile-compare-layer profile-compare-after"><img src={`${images}amy-after.svg`} width="880" height="1788" alt="Placeholder for Amy’s Instagram after the brand work" loading="lazy" decoding="async" draggable={false}/></div>
      <div className="profile-compare-divider" aria-hidden="true"><span><svg viewBox="0 0 40 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="square" strokeLinejoin="miter"><path d="m10 7-5 5 5 5M5 12h9M30 7l5 5-5 5M26 12h9"/><path d="M20 6v12" opacity=".4"/></svg></span></div>
      <div className="profile-compare-range" role="slider" tabIndex={0} aria-valuemin={0} aria-valuemax={100} aria-valuenow={50} aria-orientation="horizontal" aria-label="Before-and-after image divider" aria-valuetext="50% before, 50% after" aria-describedby="profile-compare-help"/>
    </div>
  </figure>;
}
