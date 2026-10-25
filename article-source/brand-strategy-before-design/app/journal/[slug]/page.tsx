import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ArticleTemplate from "../../_components/ArticleTemplate";
import { article } from "../../../content/article";
import { buildArticleMetadata } from "../../../lib/article-schema";

type PageProps = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return [{ slug: article.slug }];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  if (slug !== article.slug) return {};
  return buildArticleMetadata(article);
}

export default async function ArticlePage({ params }: PageProps) {
  const { slug } = await params;
  if (slug !== article.slug) notFound();
  return <ArticleTemplate article={article} />;
}
