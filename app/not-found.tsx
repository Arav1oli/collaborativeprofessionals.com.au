import { href } from "@/app/lib/paths";

export default function NotFound() {
  return (
    <main className="not-found">
      <div className="shell narrow">
        <p className="eyebrow">Page not found</p>
        <h1>That page has moved.</h1>
        <p className="lead">
          The information may still be available in our resources or process
          guide.
        </p>
        <a className="button" href={href("/")}>
          Return home →
        </a>
      </div>
    </main>
  );
}
