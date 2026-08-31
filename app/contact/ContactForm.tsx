import { site } from "@/content/site";

export function ContactForm() {
  return (
    <form
      action={`https://formsubmit.co/${site.email}`}
      className="contact-form"
      method="POST"
    >
      <input
        autoComplete="off"
        name="_honey"
        style={{ display: "none" }}
        tabIndex={-1}
        type="text"
      />
      <div className="field-row">
        <label>
          <span>Name</span>
          <input autoComplete="name" name="name" required type="text" />
        </label>
        <label>
          <span>Email</span>
          <input autoComplete="email" name="email" required type="email" />
        </label>
      </div>
      <label>
        <span>Subject</span>
        <input name="subject" required type="text" />
      </label>
      <label>
        <span>How can we help?</span>
        <textarea name="message" required rows={7} />
      </label>
      <button className="button" type="submit">
        Send enquiry <span aria-hidden="true">→</span>
      </button>
    </form>
  );
}
