export default function Arrow({ direction = 'diagonal' }: { direction?: 'diagonal' | 'left' | 'right' }) {
  const path = direction === 'left' ? 'M20 12H4m0 0 7-7m-7 7 7 7' : direction === 'right' ? 'M4 12h16m0 0-7-7m7 7-7 7' : 'M5 19 19 5M5 5h14v14';
  return <span className="story-arrow" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" focusable="false"><path d={path}/></svg></span>;
}
