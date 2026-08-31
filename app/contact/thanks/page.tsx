import type { Metadata } from "next";
import { href } from "@/app/lib/paths";

export const metadata: Metadata = {
  title: "Enquiry sent",
  description:
    "Thank you for contacting Southern Sydney Collaborative Professionals.",
  robots: { index: false, follow: false },
};

export default function ContactThanksPage() {
  return (
    <main className="not-found">
      <div className="shell narrow">
        <p className="eyebrow">Enquiry sent</p>
        <h1>Thank you for getting in touch.</h1>
        <p className="lead">
          Your enquiry has been emailed to Southern Sydney Collaborative
          Professionals. A member of the group will respond as soon as
          possible.
        </p>
        <a className="button" href={href("/")}>
          Return home <span aria-hidden="true">→</span>
        </a>
      </div>
    </main>
  );
}
