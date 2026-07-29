import type { Metadata } from "next";
import { PageIntro } from "@/app/components/PageIntro";
import { asset } from "@/app/lib/paths";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Southern Sydney Collaborative Professionals or find a collaboratively trained member.",
};

export default function ContactPage() {
  return (
    <main>
      <PageIntro
        eyebrow="Contact"
        title="Start with a conversation."
        lead="Send a general enquiry to SSCP, or contact one of our members directly for advice about your circumstances."
      />
      <section className="section contact-section">
        <div className="shell contact-grid">
          <div className="contact-panel">
            <p className="eyebrow light">General enquiries</p>
            <h2>We’ll point you in the right direction.</h2>
            <a className="contact-email" href={`mailto:${site.email}`}>
              {site.email}
            </a>
            <p>
              This form prepares a message in your own email app. Nothing is
              sent until you review and send it there.
            </p>
            <div className="contact-links">
              <a href={site.facebook} rel="noreferrer" target="_blank">
                Follow SSCP on Facebook ↗
              </a>
              <a
                href={asset(
                  "/media/legacy/2017/09/SSCP-Marketing-Brochure.pdf",
                )}
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

