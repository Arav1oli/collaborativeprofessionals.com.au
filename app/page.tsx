import type { Metadata } from "next";
import { asset, href } from "@/app/lib/paths";
import {
  objectives,
  processSteps,
  professionalRoles,
  site,
  testimonial,
} from "@/content/site";
import articles from "@/content/articles.json";

export const metadata: Metadata = {
  title: "Collaborative practice in Southern Sydney",
  description: site.description,
};

export default function Home() {
  const latestArticles = articles.slice(0, 3);

  return (
    <main>
      <section className="hero">
        <div className="shell hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Collaborative practice in Southern Sydney</p>
            <h1>
              Helping couples reach respectful resolutions
            </h1>
            <p className="hero-lead">
              Southern Sydney Collaborative Professionals brings together
              collaboratively trained professionals who work in Southern
              Sydney.
            </p>
            <div className="button-row">
              <a className="button" href={href("/members/")}>
                Find a professional <span aria-hidden="true">→</span>
              </a>
              <a className="text-link" href={href("/process/")}>
                See how it works
              </a>
            </div>
          </div>
          <div className="hero-visual">
            <img
              src={asset(
                "/media/legacy/2017/09/SSCP-Group-Photo.jpg",
              )}
              alt="Southern Sydney Collaborative Professionals group"
            />
          </div>
        </div>
      </section>

      <section className="section about-section">
        <div className="shell split-heading">
          <div>
            <p className="eyebrow">About SSCP</p>
            <h2>Good outcomes are built together.</h2>
          </div>
          <div className="prose-large">
            <p>
              Southern Sydney Collaborative Professionals brings together
              collaboratively trained lawyers, coaches, psychologists,
              financial advisers and accountants.
            </p>
            <p>
              We help separating couples solve legal, financial and parenting
              questions without turning their family’s future into a court
              battle.
            </p>
          </div>
        </div>
      </section>

      <section className="section process-preview">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow light">The collaborative difference</p>
              <h2>One table. One team. A shared way forward.</h2>
            </div>
            <a className="text-link light-link" href={href("/process/")}>
              Explore the full process →
            </a>
          </div>
          <div className="step-grid">
            {processSteps.slice(0, 3).map((step) => (
              <article className="step-card" key={step.number}>
                <span>{step.number}</span>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section roles-section">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">The right expertise, when you need it</p>
              <h2>Your professional team</h2>
            </div>
          </div>
          <div className="role-grid">
            {professionalRoles.map((role, index) => (
              <article className="role-card" key={role.title}>
                <span className="role-index">0{index + 1}</span>
                <h3>{role.title}</h3>
                <p>{role.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section objectives-section">
        <div className="shell">
          <p className="eyebrow">Why we’re here</p>
          <h2>Our objectives</h2>
          <div className="objective-list">
            {objectives.map((objective) => (
              <article key={objective.number}>
                <span>{objective.number}</span>
                <h3>{objective.title}</h3>
                <p>{objective.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="testimonial">
        <div className="shell testimonial-inner">
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <blockquote>{testimonial.quote}</blockquote>
          <cite>{testimonial.attribution}</cite>
        </div>
      </section>

      <section className="section articles-preview">
        <div className="shell">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Clear, useful information</p>
              <h2>From our resources</h2>
            </div>
            <a className="text-link" href={href("/news/")}>
              View all resources →
            </a>
          </div>
          <div className="article-grid">
            {latestArticles.map((article) => (
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
                  <h3>{article.title}</h3>
                  <span>Read article →</span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell final-cta-inner">
          <div>
            <p className="eyebrow light">Ready to talk?</p>
            <h2>Start with the right conversation.</h2>
          </div>
          <a className="button button-light" href={href("/contact/")}>
            Contact SSCP <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
