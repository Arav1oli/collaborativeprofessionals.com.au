import type { Metadata } from "next";
import { PageIntro } from "@/app/components/PageIntro";
import members from "@/content/members.json";

export const metadata: Metadata = {
  title: "Our members",
  description:
    "Find collaboratively trained lawyers, coaches and financial professionals serving Southern Sydney.",
};

export default function MembersPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Our professional network"
        title="Find the right person for your first conversation."
        lead="Our members are collaboratively trained professionals across Southern Sydney and nearby regions. You can contact any member directly to discuss whether collaborative practice may suit your family."
      />
      <section className="section members-section">
        <div className="shell">
          <div className="member-grid">
            {members.map((member) => (
              <article className="member-card" key={member.name}>
                <div className="member-top">
                  <p className="member-role">
                    {member.leadership || member.profession}
                  </p>
                  <h2>{member.name}</h2>
                  {member.leadership && (
                    <p className="member-profession">{member.profession}</p>
                  )}
                </div>
                <div className="member-meta">
                  <p>
                    <strong>{member.firm}</strong>
                    <span>{member.location}</span>
                  </p>
                  <p>
                    {member.email && (
                      <a href={`mailto:${member.email}`}>{member.email}</a>
                    )}
                    {member.phone && <span>{member.phone}</span>}
                  </p>
                </div>
                {member.website && (
                  <a
                    className="member-website"
                    href={member.website}
                    rel="noreferrer"
                    target="_blank"
                  >
                    Visit website <span aria-hidden="true">↗</span>
                  </a>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

