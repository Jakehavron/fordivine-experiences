import { redirect } from "next/navigation";
import { article } from "../content/article";

export default function Home() {
  redirect(`/journal/${article.slug}`);
}
