import type { Metadata } from "next";
import { PageIntro } from "@/app/components/PageIntro";
import { asset, href, htmlWithBasePath } from "@/app/lib/paths";
import faqs from "@/content/faqs.json";
import { processSteps, professionalRoles } from "@/content/site";

export const metadata: Metadata = {
  title: "How collaborative practice works",
  description:
    "Understand the collaborative family law process, who may be involved and what to expect.",
  alternates: { canonical: "/process/" },
};

export default function ProcessPage() {
  return (
    <main>
      <PageIntro
        eyebrow="How it works"
        title="A structured process, shaped around your family."
        lead="Collaborative practice is a voluntary way to resolve family law issues without litigation. You and your partner receive independent advice while working together with a professional team to reach an agreement."
      />

      <section className="section process-explainer">
        <div className="shell process-layout">
          <div className="sticky-copy">
            <p className="eyebrow">The process</p>
            <h2>From first advice to final agreement.</h2>
            <p>
              Everyone signs a Participation Agreement committing to resolve
              the issues without court-based negotiation. Meetings are
              transparent, correspondence is kept to a minimum and the work
              stays focused on your priorities.
            </p>
          </div>
          <div className="process-list">
            {processSteps.map((step) => (
              <article key={step.number}>
                <span>{step.number}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section diagram-section">
        <div className="shell diagram-grid">
          <div>
            <p className="eyebrow">At a glance</p>
            <h2>The collaborative family law process</h2>
            <p>
              Depending on the complexity of the issues, the process may take
              several meetings and involve different members of the
              professional team.
            </p>
          </div>
          <a
            className="diagram-frame"
            href={asset(
              "/media/legacy/2017/09/Collaborative-Practice-Process-draft.png",
            )}
          >
            <img
              src={asset(
                "/media/legacy/2017/09/Collaborative-Practice-Process-draft.png",
              )}
              alt="Diagram showing the collaborative family law process from assessment through meetings to final agreement"
            />
          </a>
        </div>
      </section>

      <section className="section team-detail">
        <div className="shell">
          <p className="eyebrow">Who may be involved</p>
          <h2>A team assembled around the issues.</h2>
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

      <section className="section faq-section">
        <div className="shell faq-layout">
          <div>
            <p className="eyebrow">Common questions</p>
            <h2>Collaborative practice FAQs</h2>
          </div>
          <div className="faq-list">
            {faqs.map((faq, index) => (
              <details key={faq.question} open={index === 0}>
                <summary>
                  <span>{faq.question}</span>
                  <span aria-hidden="true">+</span>
                </summary>
                <div
                  className="faq-answer rich-content"
                  dangerouslySetInnerHTML={{
                    __html: htmlWithBasePath(faq.answer_html),
                  }}
                />
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section final-cta">
        <div className="shell final-cta-inner">
          <div>
            <p className="eyebrow light">Think it may suit you?</p>
            <h2>Speak with a collaborative professional.</h2>
          </div>
          <a className="button button-light" href={href("/members/")}>
            Browse our members <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>
    </main>
  );
}
