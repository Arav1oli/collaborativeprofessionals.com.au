import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { asset, href, htmlWithBasePath } from "@/app/lib/paths";
import articles from "@/content/articles.json";
import { site } from "@/content/site";

type ArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({
  params,
}: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) return {};
  const description = article.excerpt || site.description;
  const image = asset(article.image);
  return {
    title: article.title,
    description,
    alternates: { canonical: `/news/${article.slug}/` },
    openGraph: {
      title: article.title,
      description,
      type: "article",
      publishedTime: article.date,
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description,
      images: [image],
    },
  };
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  return (
    <main>
      <article className="article-page">
        <header className="article-header">
          <div className="shell article-shell">
            <a className="back-link" href={href("/news/")}>
              ← All resources
            </a>
            <time dateTime={article.date}>
              {new Intl.DateTimeFormat("en-AU", {
                day: "numeric",
                month: "long",
                year: "numeric",
              }).format(new Date(`${article.date}T00:00:00`))}
            </time>
            <h1>{article.title}</h1>
            {article.excerpt && <p className="lead">{article.excerpt}</p>}
          </div>
        </header>
        {article.image && (
          <div className="shell article-hero">
            <img src={asset(article.image)} alt={article.image_alt} />
          </div>
        )}
        <div className="shell article-shell article-body">
          <div
            className="rich-content"
            dangerouslySetInnerHTML={{
              __html: htmlWithBasePath(article.content_html),
            }}
          />
          <aside className="article-next-step">
            <p className="eyebrow">Need personal advice?</p>
            <h2>Talk with a collaborative professional.</h2>
            <a className="button" href={href("/members/")}>
              Find a member →
            </a>
          </aside>
        </div>
      </article>
    </main>
  );
}
