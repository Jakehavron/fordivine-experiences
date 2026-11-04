import Script from "next/script";

type NavigatorSection = { id: string; navLabel: string };
export default function ArticleNavigator({ sections, readMinutes }: { sections: NavigatorSection[]; readMinutes: number }) {
  return <aside className="article-toc article-tree-toc" aria-label="Article contents">
    <details className="tree-disclosure" open>
      <summary className="tree-summary"><span>In this article</span><span className="tree-summary-meta">{readMinutes} min<span className="tree-chevron" aria-hidden="true">⌄</span></span></summary>
      <div className="tree-panel">
        <nav className="tree-nav" aria-label="Article sections" data-tree-nav>
          <div className="tree-rail" aria-hidden="true"><span className="tree-rail-base" /><span className="tree-terminal" /><span className="tree-rail-accent" /><span className="tree-marker" /></div>
          <span className="tree-pill" aria-hidden="true" />
          <ol>{sections.map(({ id, navLabel }, index) => <li key={id} className={index === 0 ? "is-active" : ""}>
            <a href={`#${id}`} aria-current={index === 0 ? "location" : undefined}>{navLabel}</a>
          </li>)}</ol>
        </nav>
        <a className="toc-top" href="#article">Return to top ↑</a>
      </div>
    </details>
    <Script src="/article-tree-nav.js" strategy="afterInteractive" />
  </aside>;
}
