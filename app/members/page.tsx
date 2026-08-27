import type { Metadata } from "next";
import { PageIntro } from "@/app/components/PageIntro";
import { asset } from "@/app/lib/paths";
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
        compact
      />
      <section className="section members-section">
        <div className="shell">
          <div className="member-grid">
            {members.map((member) => (
              <article className="member-card" key={member.name}>
                <div className="member-top">
                  <div className="member-portrait" aria-hidden={!member.photo}>
                    {member.photo ? (
                      <img
                        src={asset(member.photo)}
                        alt={`Portrait of ${member.name}`}
                      />
                    ) : (
                      <span>
                        {member.name
                          .split(" ")
                          .map((part) => part[0])
                          .join("")
                          .slice(0, 2)}
                      </span>
                    )}
                  </div>
                  <div className="member-heading">
                    <p className="member-role">
                      {member.leadership || member.profession}
                    </p>
                    <h2>{member.name}</h2>
                    {member.leadership && (
                      <p className="member-profession">{member.profession}</p>
                    )}
                  </div>
                </div>
                <p className="member-bio">{member.bio}</p>
                <div className="member-contact">
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
                  <div className="member-actions">
                    {member.website && (
                      <a
                        className="button button-small"
                        href={member.website}
                        rel="noreferrer"
                        target="_blank"
                      >
                        Visit practice <span aria-hidden="true">↗</span>
                      </a>
                    )}
                    <a
                      className="button button-small button-outline"
                      href={member.source}
                      rel="noreferrer"
                      target="_blank"
                    >
                      Read profile <span aria-hidden="true">↗</span>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
