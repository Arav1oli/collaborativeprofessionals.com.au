"use client";

import { FormEvent, useState } from "react";
import { site } from "@/content/site";

const formEndpoint = `https://formsubmit.co/ajax/${site.email}`;

type FormStatus =
  | "idle"
  | "submitting"
  | "activation"
  | "success"
  | "error";

export function ContactForm() {
  const [status, setStatus] = useState<FormStatus>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    const name = String(form.get("name") ?? "");
    const email = String(form.get("email") ?? "");
    const subject =
      String(form.get("subject") ?? "").trim() ||
      "Enquiry via the SSCP website";
    const message = String(form.get("message") ?? "");
    const honey = String(form.get("_honey") ?? "");

    setStatus("submitting");

    try {
      const response = await fetch(formEndpoint, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          subject,
          message,
          _subject: `SSCP website enquiry: ${subject}`,
          _template: "table",
          _captcha: "false",
          _honey: honey,
          _url: "https://collaborativeprofessionals.com.au/contact/",
        }),
      });
      const result = (await response.json()) as {
        message?: string;
        success?: boolean | string;
      };

      if (
        !response.ok ||
        (result.success !== true && result.success !== "true")
      ) {
        throw new Error("Form submission was not accepted");
      }

      formElement.reset();
      setStatus(
        /activat|confirm/i.test(result.message ?? "")
          ? "activation"
          : "success",
      );
    } catch {
      setStatus("error");
    }
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
      <input
        autoComplete="off"
        hidden
        name="_honey"
        tabIndex={-1}
        type="text"
      />
      <button
        aria-disabled={status === "submitting"}
        className="button"
        disabled={status === "submitting"}
        type="submit"
      >
        {status === "submitting" ? "Sending..." : "Send enquiry"}{" "}
        <span aria-hidden="true">→</span>
      </button>
      {status === "success" && (
        <p className="form-notice form-notice-success" role="status">
          Thank you. Your enquiry has been sent to SSCP.
        </p>
      )}
      {status === "activation" && (
        <p className="form-notice form-notice-success" role="status">
          Thank you. SSCP has received an activation email. Your enquiry will
          be delivered as soon as the form is activated.
        </p>
      )}
      {status === "error" && (
        <p className="form-notice form-notice-error" role="alert">
          We could not send your enquiry. Please try again or email{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      )}
    </form>
  );
}
