"use client";

import { useEffect, useState } from "react";

type NavigatorSection = { id: string; navLabel: string };

export default function ArticleNavigator({ sections, readMinutes }: { sections: NavigatorSection[]; readMinutes: number }) {
  const [active, setActive] = useState(sections[0]?.id ?? "");
  const [readingProgress, setReadingProgress] = useState(0);

  useEffect(() => {
    const nodes = sections
      .map(({ id }) => document.getElementById(id))
      .filter((node): node is HTMLElement => Boolean(node));
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-18% 0px -68% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [sections]);

  useEffect(() => {
    let frame = 0;
    const updateProgress = () => {
      frame = 0;
      const articleBody = document.querySelector<HTMLElement>(".article-body");
      if (!articleBody) return;
      const start = articleBody.getBoundingClientRect().top + window.scrollY;
      const distance = Math.max(1, articleBody.offsetHeight - window.innerHeight);
      const nextProgress = Math.min(100, Math.max(0, ((window.scrollY - start) / distance) * 100));
      setReadingProgress(nextProgress);
    };
    const scheduleProgressUpdate = () => {
      if (!frame) frame = window.requestAnimationFrame(updateProgress);
    };
    updateProgress();
    window.addEventListener("scroll", scheduleProgressUpdate, { passive: true });
    window.addEventListener("resize", scheduleProgressUpdate);
    return () => {
      window.removeEventListener("scroll", scheduleProgressUpdate);
      window.removeEventListener("resize", scheduleProgressUpdate);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <aside className="article-toc" aria-label="Article contents">
      <div className="toc-heading">
        <p>In this article</p>
        <span className="toc-meta"><span>{readMinutes} min</span><span>{sections.length} sections</span></span>
      </div>
      <ol>
        {sections.map(({ id, navLabel }, index) => (
          <li key={id} className={active === id ? "is-active" : ""}>
            <a href={`#${id}`} aria-current={active === id ? "location" : undefined}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              {navLabel}
            </a>
          </li>
        ))}
      </ol>
      <div className="toc-progress" aria-hidden="true">
        <span style={{ width: `${readingProgress}%` }} />
      </div>
      <a className="toc-top" href="#article">Return to top ↑</a>
    </aside>
  );
}
