import type { MetadataRoute } from "next";
import { article } from "../content/article";

export default function sitemap(): MetadataRoute.Sitemap {
  return [{
    url: article.canonical,
    lastModified: article.dateModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }];
}
