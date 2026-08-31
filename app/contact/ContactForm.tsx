import { site } from "@/content/site";

export function ContactForm() {
  return (
    <form
      action={`https://formsubmit.co/${site.email}`}
      className="contact-form"
      method="POST"
    >
      <input
        name="_next"
        type="hidden"
        value="https://collaborativeprofessionals.com.au/contact/thanks/"
      />
      <input name="_subject" type="hidden" value="New SSCP website enquiry" />
      <input name="_template" type="hidden" value="table" />
      <input name="_captcha" type="hidden" value="false" />
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
