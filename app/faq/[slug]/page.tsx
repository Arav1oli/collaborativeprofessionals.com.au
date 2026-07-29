import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { href, htmlWithBasePath } from "@/app/lib/paths";
import faqs from "@/content/faqs.json";
import { professionalRoles } from "@/content/site";

const legacyFaqs = [
  {
    slug: "how-does-collaborative-practice-differ-from-mediation-or-other-dispute-resolution-processes",
    question:
      "How does Collaborative Practice differ from mediation or other dispute resolution processes?",
  },
  {
    slug: "is-it-confidential",
    question: "Is it confidential?",
  },
  {
    slug: "is-it-for-everyone",
    question: "Is it for everyone?",
  },
  {
    slug: "what-are-the-benefits",
    question: "What are the benefits?",
  },
  {
    slug: "what-if-my-partner-doesnt-comply-with-disclosure-requirements",
    question: "What if my partner doesn’t comply with disclosure requirements?",
  },
  {
    slug: "what-is-the-participation-agreement",
    question: "What is the Participation Agreement?",
  },
] as const;

type FaqPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return [
    ...legacyFaqs.map((faq) => ({ slug: faq.slug })),
    {
      slug: "who-may-be-involved-in-the-collaborative-practice-process",
    },
  ];
}

export async function generateMetadata({
  params,
}: FaqPageProps): Promise<Metadata> {
  const { slug } = await params;
  const record = legacyFaqs.find((faq) => faq.slug === slug);
  return {
    title:
      record?.question ??
      "Who may be involved in the Collaborative Practice Process?",
  };
}

export default async function LegacyFaqPage({ params }: FaqPageProps) {
  const { slug } = await params;
  const peopleSlug =
    slug === "who-may-be-involved-in-the-collaborative-practice-process";
  const record = legacyFaqs.find((faq) => faq.slug === slug);
  if (!record && !peopleSlug) notFound();

  const answer = record
    ? faqs.find((faq) => faq.question === record.question)
    : null;
  if (record && !answer) notFound();

  return (
    <main className="legacy-faq-page">
      <section className="page-intro">
        <div className="shell narrow">
          <a className="back-link" href={href("/process/")}>
            ← Collaborative practice FAQs
          </a>
          <p className="eyebrow">Common question</p>
          <h1>
            {record?.question ??
              "Who may be involved in the Collaborative Practice Process?"}
          </h1>
        </div>
      </section>
      <section className="section">
        <div className="shell article-shell">
          {peopleSlug ? (
            <div className="role-grid">
              {professionalRoles.map((role, index) => (
                <article className="role-card" key={role.title}>
                  <span className="role-index">0{index + 1}</span>
                  <h2>{role.title}</h2>
                  <p>{role.text}</p>
                </article>
              ))}
            </div>
          ) : (
            <div
              className="rich-content"
              dangerouslySetInnerHTML={{
                __html: htmlWithBasePath(answer!.answer_html),
              }}
            />
          )}
        </div>
      </section>
    </main>
  );
}

