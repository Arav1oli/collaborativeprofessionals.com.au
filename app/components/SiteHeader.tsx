import { asset, href } from "@/app/lib/paths";

const links = [
  ["Home", "/"],
  ["Our members", "/members/"],
  ["How it works", "/process/"],
  ["Resources", "/news/"],
] as const;

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="shell header-inner">
        <a className="brand" href={href("/")} aria-label="SSCP home">
          <img
            src={asset("/media/legacy/2017/10/logo-tree_v3.png")}
            alt="Southern Sydney Collaborative Professionals"
          />
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {links.map(([label, path]) => (
            <a key={path} href={href(path)}>
              {label}
            </a>
          ))}
          <a className="button button-small" href={href("/contact/")}>
            Talk to us
          </a>
        </nav>
        <details className="mobile-nav">
          <summary>Menu</summary>
          <div className="mobile-nav-panel">
            {links.map(([label, path]) => (
              <a key={path} href={href(path)}>
                {label}
              </a>
            ))}
            <a href={href("/contact/")}>Contact</a>
          </div>
        </details>
      </div>
    </header>
  );
}

