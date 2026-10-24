import Image from "next/image";
import { Fragment, type ReactNode } from "react";
import templateManifest from "../../FORDIVINE_TEMPLATE.json";
import type { ArticleBlock, ArticleData, EpisodeModule, RichText } from "../../lib/article-schema";
import { articleManifest, buildArticleJsonLd } from "../../lib/article-schema";
import ArticleNavigator from "./ArticleNavigator";
import EpisodeEmbed from "./EpisodeEmbed";
import FordivineFooter from "../FordivineFooter";

function safeJson(value: unknown): string {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

function headlineClassName(title: string): string {
  const length = Array.from(title.trim().replace(/\s+/g, " ")).length;
  if (length > 58) return "article-headline article-headline--extra-long";
  if (length > 48) return "article-headline article-headline--long";
  if (length > 36) return "article-headline article-headline--medium";
  return "article-headline";
}

function conversionHeadlineClassName(title: string): string {
  const length = Array.from(title.trim().replace(/\s+/g, " ")).length;
  return length > 31 ? "conversion-headline conversion-headline--long" : "conversion-headline";
}

function dekClassName(dek: string): string {
  const length = Array.from(dek.trim().replace(/\s+/g, " ")).length;
  return length > 74 ? "dek dek--long" : "dek";
}

function Rich({ content }: { content: RichText }) {
  if (typeof content === "string") return <>{content}</>;
  return <>{content.map((part, index) => {
    let node: ReactNode = part.text;
    if (part.strong) node = <strong>{node}</strong>;
    if (part.href) node = <a href={part.href}>{node}</a>;
    return <span key={`${index}-${part.text.slice(0, 16)}`}>{node}</span>;
  })}</>;
}

function Diagram({ block }: { block: Extract<ArticleBlock, { type: "diagram" }> }) {
  const ordered = block.layout === "path" || block.layout === "stack";
  const sequential = block.layout === "path";
  const List = ordered ? "ol" : "ul";

  return <figure className={`fordivine-diagram fordivine-diagram--${block.layout}`} aria-labelledby={`${block.id}-title`}>
    <div className="fordivine-diagram__paper">
      <div className="fordivine-diagram__heading">
        <p className="fordivine-diagram__eyebrow">{block.eyebrow}</p>
        <h3 id={`${block.id}-title`}>{block.title}</h3>
      </div>
      <List className="fordivine-diagram__items">
        {block.items.map((item, index) => <li className="fordivine-diagram__item" key={`${item.title}-${index}`}>
          <span className="fordivine-diagram__marker" aria-hidden="true">{item.marker ?? String(index + 1).padStart(2, "0")}</span>
          <div><strong>{item.title}</strong><span>{item.body}</span></div>
          {sequential && index < block.items.length - 1 ? <span className="fordivine-diagram__arrow" aria-hidden="true">→</span> : null}
        </li>)}
      </List>
    </div>
    <figcaption>{block.caption}</figcaption>
  </figure>;
}

function Block({ block }: { block: ArticleBlock }) {
  switch (block.type) {
    case "paragraph":
      return <p className={block.variant === "transition" ? "section-transition" : undefined}><Rich content={block.content} /></p>;
    case "blockquote":
      return <blockquote>{block.content}</blockquote>;
    case "heading":
      return <h3 className="paragraph-kicker">{block.content}</h3>;
    case "formula":
      return <div className="formula-card"><p>{block.parts.map((part, index) => part.accent ? <span key={index}>{part.text}</span> : <Fragment key={index}>{part.text}</Fragment>)}</p></div>;
    case "comparison":
      return <div className="comparison-grid" aria-label={block.label}>{block.items.map((item) => <div key={item.title}><h3>{item.title}</h3><p>{item.body}</p></div>)}</div>;
    case "actions":
      return <div className={`action-card${block.variant === "visibility" ? " visibility-filter" : ""}`}><h3>{block.title}</h3><ol>{block.items.map((item) => <li key={item}>{item}</li>)}</ol></div>;
    case "audit":
      return <div className="audit-card"><h3>{block.title}</h3><ul>{block.items.map((item, index) => <li key={item}><span>{String(index + 1).padStart(2, "0")}</span>{item}</li>)}</ul></div>;
    case "proof":
      return <div className="proof-strip" aria-label={block.label} data-proof-verified={String(block.verified)} data-proof-source={block.verificationSource}>{block.items.map((item, index) => <div key={item.title}><span>{String(index + 1).padStart(2, "0")}</span><strong>{item.title}</strong><small>{item.body}</small></div>)}</div>;
    case "example":
      return <div className="editorial-example"><h3>{block.title}</h3><div className="editorial-example__body">{block.paragraphs.map((paragraph, index) => <p key={index}><Rich content={paragraph} /></p>)}</div></div>;
    case "insight":
      return <div className="crowned-insight"><p>{block.content}</p></div>;
    case "ecosystem":
      return <><div className="ecosystem-grid">{block.terms.map((term) => <span key={term}>{term}</span>)}</div><ul className="ecosystem-results">{block.results.map((result) => <li key={result}>{result}</li>)}</ul></>;
    case "diagram":
      return <Diagram block={block} />;
    case "image":
      return <figure className="editorial-reset"><div className="editorial-reset__image"><Image src={block.src} alt={block.alt} width={block.width} height={block.height} sizes="(max-width: 620px) 100vw, 700px" /></div><figcaption>{block.caption}</figcaption></figure>;
  }
}

function EpisodeSource({ episode }: { episode: EpisodeModule }) {
  const embedUrl = `https://www.youtube-nocookie.com/embed/${episode.youtubeId}?start=${episode.startSeconds}&rel=0`;
  const watchUrl = `${episode.sourceUrl}${episode.sourceUrl.includes("?") ? "&" : "?"}t=${episode.startSeconds}s`;

  return <section className="episode-module" aria-labelledby="episode-module-title">
    <div className="episode-module__copy">
      <p className="episode-module__eyebrow">{episode.eyebrow}</p>
      <h2 id="episode-module-title">{episode.title}</h2>
      <p>{episode.description}</p>
      <a href={watchUrl}>Watch from {episode.startLabel} <span aria-hidden="true">↗</span></a>
    </div>
    <div className="episode-module__frame">
      <EpisodeEmbed embedUrl={embedUrl} title={episode.title} />
    </div>
  </section>;
}

export default function ArticleTemplate({ article }: { article: ArticleData }) {
  const manifest = articleManifest(article);

  return (
    <main data-template-version={String(templateManifest.template_version)}>
      <div className="reading-progress" aria-hidden="true" />
      <script id="fordivine-article-manifest" type="application/json" dangerouslySetInnerHTML={{ __html: safeJson(manifest) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJson(buildArticleJsonLd(article)) }} />

      <header className="site-header">
        <a className="publication-mark" href="https://www.fordivine.com/discover" aria-label="FORDIVINE home">
          <Image src="/fordivine-logo-white.png" alt="FORDIVINE" width={1287} height={201} />
        </a>
        <nav aria-label="Journal actions">
          <a className="header-cta" href="https://www.fordivine.com/discover">Work With Us</a>
        </nav>
      </header>

      <article id="article">
        <section className="article-hero">
          <div className="hero-copy">
            <h1 className={headlineClassName(article.h1)} data-headline-max-lines="2">{article.h1}</h1>
            <p className={dekClassName(article.dek)} data-headline-max-lines="2">{article.dek}</p>
            <div className="article-meta">
              <span>By {article.author.name}</span>
              <span>{article.displayDate}</span>
              <span>{article.readMinutes} min read</span>
            </div>
          </div>
          <figure className="hero-art">
            <Image src={article.hero.src} alt={article.hero.alt} width={article.hero.width} height={article.hero.height} sizes="(max-width: 900px) 100vw, 46vw" quality={55} priority fetchPriority="high" />
          </figure>
        </section>

        <div className="article-shell">
          <ArticleNavigator sections={article.sections} readMinutes={article.readMinutes} />
          <div className="article-body">
            <section className="short-answer" aria-labelledby="short-answer-title">
              <p className="short-answer__label">The short answer</p>
              <h2 id="short-answer-title">{article.shortAnswer.question}</h2>
              <p>{article.shortAnswer.answer}</p>
            </section>

            <div className="intro">
              <div className="lead-group">{article.intro.leads.map((lead) => <p className="lead" key={lead}>{lead}</p>)}</div>
              <div className="intro-supporting">
                <div className="intro-copy">{article.intro.supporting.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}</div>
                <p className="intro-close">{article.intro.close}</p>
              </div>
            </div>

            {article.episodeModule ? <EpisodeSource episode={article.episodeModule} /> : null}

            {article.sections.map((section, index) => <div className="strategy-wrap" key={section.id}>
              <section className="strategy" id={section.id} data-nav-label={section.navLabel}>
                <div className="strategy-index"><span className="strategy-index__number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span></div>
                <h2>{section.title}</h2>
                {section.blocks.map((block, blockIndex) => <Block block={block} key={`${section.id}-${blockIndex}`} />)}
              </section>
              {section.after?.map((block, blockIndex) => <Block block={block} key={`${section.id}-after-${blockIndex}`} />)}
            </div>)}

            <section className="next-move" id="next-move">
              <h2 data-headline-max-lines="2">{article.nextMove.title}</h2>
              {article.nextMove.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
              <div className="next-move-list">{article.nextMove.actions.map((action) => <span key={action}>{action}</span>)}</div>
              <p>{article.nextMove.close}</p>
            </section>

            <section className="sources" aria-labelledby="sources-title">
              <h2 id="sources-title">Sources and further reading</h2>
              <ul>{article.sources.map((source) => <li key={source.href} data-source-quality={source.primary ? "primary" : "secondary"}><a href={source.href}>{source.label}</a></li>)}</ul>
            </section>
          </div>
        </div>

        <section className="conversion-panel">
          <div><h2 className={conversionHeadlineClassName(article.conversion.title)} data-headline-max-lines="2">{article.conversion.title}</h2></div>
          <div className="conversion-copy">
            <p>{article.conversion.body}</p>
            <a className="conversion-cta" href={article.conversion.ctaHref}>{article.conversion.ctaLabel} <span aria-hidden="true">↗</span></a>
          </div>
        </section>

        <section className="related-reading" id="related-reading" aria-labelledby="related-title">
          <div className="related-heading"><div><h2 id="related-title">Explore FORDIVINE</h2></div><a href="https://www.fordivine.com/discover">Visit FORDIVINE ↗</a></div>
          <div className="related-grid">{article.related.map((item, index) => <a href={item.href} className={`related-card related-card--${item.variant}`} key={`${item.variant}-${item.href}-${index}`}><span className="related-card__visual">{item.eyebrow}</span><h3>{item.title}</h3><span className="related-card__link">{item.label} ↗</span></a>)}</div>
        </section>
      </article>

      <FordivineFooter />
    </main>
  );
}
