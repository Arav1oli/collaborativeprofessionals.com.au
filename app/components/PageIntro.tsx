type PageIntroProps = {
  eyebrow: string;
  title: string;
  lead: string;
};

export function PageIntro({ eyebrow, title, lead }: PageIntroProps) {
  return (
    <section className="page-intro">
      <div className="shell narrow">
        <p className="eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p className="lead">{lead}</p>
      </div>
    </section>
  );
}

