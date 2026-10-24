import type { Metadata } from "next";

export type RichTextPart = {
  text: string;
  href?: string;
  strong?: boolean;
};

export type RichText = string | RichTextPart[];

export type ArticleBlock =
  | { type: "paragraph"; content: RichText; variant?: "transition" }
  | { type: "blockquote"; content: string }
  | { type: "heading"; content: string }
  | { type: "formula"; parts: Array<{ text: string; accent?: boolean }> }
  | { type: "comparison"; label: string; items: Array<{ title: string; body: string }> }
  | { type: "actions"; title: string; items: string[]; variant?: "visibility" }
  | { type: "audit"; title: string; items: string[] }
  | { type: "proof"; label: string; verified: boolean; verificationSource: string; items: Array<{ title: string; body: string }> }
  | { type: "example"; title: string; paragraphs: RichText[] }
  | { type: "insight"; content: string }
  | { type: "ecosystem"; terms: string[]; results: string[] }
  | {
      type: "diagram";
      id: string;
      layout: "path" | "contrast" | "hub" | "stack";
      eyebrow: string;
      title: string;
      items: Array<{ marker?: string; title: string; body: string }>;
      caption: string;
    }
  | { type: "image"; src: string; alt: string; width: number; height: number; caption: string };

export type ArticleSectionData = {
  id: string;
  navLabel: string;
  title: string;
  blocks: ArticleBlock[];
  after?: ArticleBlock[];
};

export type EpisodeModule = {
  eyebrow: string;
  title: string;
  description: string;
  youtubeId: string;
  startSeconds: number;
  startLabel: string;
  sourceUrl: string;
};

export type ArticleData = {
  status: "fixture" | "draft" | "ready";
  slug: string;
  canonical: string;
  seoTitle: string;
  h1: string;
  description: string;
  socialDescription: string;
  dek: string;
  author: { name: string; type: "Organization" | "Person"; url: string };
  publisher: { name: string; url: string };
  datePublished: string;
  dateModified: string;
  displayDate: string;
  readMinutes: number;
  hero: { src: string; alt: string; width: number; height: number };
  shortAnswer: { question: string; answer: string };
  intro: { leads: string[]; supporting: string[]; close: string };
  episodeModule?: EpisodeModule;
  sections: ArticleSectionData[];
  nextMove: { title: string; paragraphs: string[]; actions: string[]; close: string };
  sources: Array<{ label: string; href: string; primary: boolean }>;
  conversion: {
    title: string;
    body: string;
    ctaLabel: string;
    ctaHref: string;
  };
  related: Array<{ eyebrow: string; title: string; label: string; href: string; variant: "story" | "method" | "next" }>;
};

export function presentationBaseUrl(): string {
  const configured = process.env.SITE_URL;
  if (configured) return configured;
  if (process.env.VERCEL_ENV === "preview" && process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return "https://www.fordivine.com";
}

export function absoluteUrl(pathOrUrl: string): string {
  return new URL(pathOrUrl, presentationBaseUrl()).toString();
}

export function buildArticleMetadata(article: ArticleData): Metadata {
  const isProduction = process.env.VERCEL_ENV === "production";
  return {
    metadataBase: new URL(presentationBaseUrl()),
    title: article.seoTitle,
    description: article.description,
    alternates: { canonical: article.canonical },
    robots: isProduction
      ? { index: true, follow: true }
      : { index: false, follow: false, nocache: true },
    openGraph: {
      title: article.h1,
      description: article.socialDescription,
      type: "article",
      url: article.canonical,
      publishedTime: article.datePublished,
      modifiedTime: article.dateModified,
      authors: [article.author.url],
      images: [{
        url: article.hero.src,
        width: article.hero.width,
        height: article.hero.height,
        alt: article.hero.alt,
      }],
    },
    twitter: {
      card: "summary_large_image",
      title: article.h1,
      description: article.socialDescription,
      images: [article.hero.src],
    },
  };
}

export function buildArticleJsonLd(article: ArticleData) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.h1,
    description: article.description,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    author: { "@type": article.author.type, name: article.author.name, url: article.author.url },
    publisher: { "@type": "Organization", name: article.publisher.name, url: article.publisher.url },
    image: absoluteUrl(article.hero.src),
    mainEntityOfPage: article.canonical,
  };
}

export function articleManifest(article: ArticleData) {
  return {
    status: article.status,
    slug: article.slug,
    canonical: article.canonical,
    seoTitle: article.seoTitle,
    h1: article.h1,
    description: article.description,
    socialDescription: article.socialDescription,
    author: article.author,
    datePublished: article.datePublished,
    dateModified: article.dateModified,
    readMinutes: article.readMinutes,
    hero: article.hero,
    episodeModule: article.episodeModule ?? null,
    socialImage: absoluteUrl(article.hero.src),
    sections: article.sections.map(({ id, navLabel, title }) => ({ id, navLabel, title })),
    sourceCount: article.sources.length,
  };
}
