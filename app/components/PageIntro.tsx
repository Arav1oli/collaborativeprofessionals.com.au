type PageIntroProps = {
  eyebrow: string;
  title: string;
  lead: string;
  compact?: boolean;
};

export function PageIntro({
  eyebrow,
  title,
  lead,
  compact = false,
}: PageIntroProps) {
  return (
    <section className={`page-intro${compact ? " page-intro-compact" : ""}`}>
      <div className="shell narrow">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
      </div>
    </section>
  );
}
