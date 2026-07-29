import { href } from "@/app/lib/paths";
import { site } from "@/content/site";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <p className="eyebrow light">Southern Sydney</p>
          <h2>A calmer path forward.</h2>
        </div>
        <div>
          <p className="footer-label">Get in touch</p>
          <a className="footer-email" href={`mailto:${site.email}`}>
            {site.email}
          </a>
          <div className="footer-links">
            <a href={href("/members/")}>Find a professional</a>
            <a href={site.facebook} rel="noreferrer" target="_blank">
              Facebook
            </a>
          </div>
        </div>
      </div>
      <div className="shell footer-bottom">
        <p>
          © {new Date().getFullYear()} Southern Sydney Collaborative
          Professionals Inc.
        </p>
        <p>General information only — not legal advice.</p>
      </div>
    </footer>
  );
}

