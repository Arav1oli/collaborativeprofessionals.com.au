import type { Metadata } from "next";
import { PageIntro } from "@/app/components/PageIntro";
import { asset, href } from "@/app/lib/paths";
import articles from "@/content/articles.json";

export const metadata: Metadata = {
  title: "Resources",
  description:
    "Articles and practical information about collaborative family law and divorce without court.",
};

export default function NewsPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Resources"
        title="A clearer view of collaborative family law."
        lead="Practical articles from our professional community about the process, the people involved and the choices families can make."
      />
      <section className="section">
        <div className="shell article-grid article-grid-full">
          {articles.map((article) => (
            <a
              className="article-card"
              href={href(`/news/${article.slug}/`)}
              key={article.slug}
            >
              {article.image ? (
                <img src={asset(article.image)} alt={article.image_alt} />
              ) : (
                <div className="article-placeholder" />
              )}
              <div className="article-card-copy">
                <time dateTime={article.date}>
                  {new Intl.DateTimeFormat("en-AU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  }).format(new Date(`${article.date}T00:00:00`))}
                </time>
                <h2>{article.title}</h2>
                <p>{article.excerpt}</p>
                <span>Read article →</span>
              </div>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}

