import type { Metadata } from "next";
import { href } from "@/app/lib/paths";
import { testimonial } from "@/content/site";

export const metadata: Metadata = {
  title: "A positive collaborative process",
};

export default function LegacyTestimonialPage() {
  return (
    <main>
      <section className="testimonial testimonial-page">
        <div className="shell testimonial-inner">
          <p className="eyebrow light">Client experience</p>
          <h1 className="testimonial-title">A positive collaborative process</h1>
          <span className="quote-mark" aria-hidden="true">
            “
          </span>
          <blockquote>{testimonial.quote}</blockquote>
          <cite>{testimonial.attribution}</cite>
          <div>
            <a className="button button-light" href={href("/")}>
              Learn about SSCP →
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
