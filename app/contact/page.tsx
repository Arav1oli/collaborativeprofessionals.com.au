import type { Metadata } from "next";
import { PageIntro } from "@/app/components/PageIntro";
import { asset } from "@/app/lib/paths";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Southern Sydney Collaborative Professionals or find a collaboratively trained member.",
  alternates: { canonical: "/contact/" },
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <PageIntro
        eyebrow="Contact"
        title="Talk to us."
        lead="Send SSCP a general enquiry below. For advice about your own circumstances, contact one of our members directly."
        compact
      />
      <section className="section contact-section">
        <div className="shell contact-grid">
          <div className="contact-panel">
            <p className="eyebrow light">General enquiries</p>
            <h2>Contact SSCP.</h2>
            <a className="contact-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p>
              Use the form for general enquiries, or email us directly at the
              address above.
            </p>
            <div className="contact-links">
              <a href={site.facebook} rel="noreferrer" target="_blank">
                Follow SSCP on Facebook ↗
              </a>
              <a href={site.instagram} rel="noreferrer" target="_blank">
                Follow SSCP on Instagram ↗
              </a>
              <a
                href={asset(
                  "/media/legacy/2017/09/SSCP-Marketing-Brochure.pdf",
                )}
                rel="noreferrer"
                target="_blank"
              >
                Download our brochure ↗
              </a>
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
