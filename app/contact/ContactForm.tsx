"use client";

import { FormEvent, useState } from "react";
import { site } from "@/content/site";

export function ContactForm() {
  const [notice, setNotice] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const subject =
      String(form.get("subject") ?? "").trim() ||
      "Enquiry via the SSCP website";
    const message = String(form.get("message") ?? "");
    const body = [
      message,
      "",
      "—",
      `Name: ${name}`,
      `Email: ${email}`,
    ].join("\n");
    window.location.href = `mailto:${site.email}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;
    setNotice(
      "Your email app should open with this message ready to review and send.",
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit}>
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
        <input name="subject" type="text" />
      </label>
      <label>
        <span>How can we help?</span>
        <textarea name="message" required rows={7} />
      </label>
      <button className="button" type="submit">
        Prepare email <span aria-hidden="true">→</span>
      </button>
      {notice && (
        <p className="form-notice" role="status">
          {notice}
        </p>
      )}
    </form>
  );
}

