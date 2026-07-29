# Migration notes

## Archive

The migration captured:

- 29 public URLs from every WordPress sitemap
- 5 pages, 10 posts, 7 FAQ URLs and 1 testimonial
- the current member directory
- all WordPress media records
- 350 local media files, including image variants, logos, PDFs and DOCX
  attachments
- raw rendered HTML snapshots and WordPress REST JSON

`legacy-archive/manifest.json` records every source URL, local file path, size
and SHA-256 hash.

## Legacy contact form

The old contact page uses Contact Form 7 form ID `192`. Browser submissions are
sent to:

```text
https://collaborativeprofessionals.com.au/wp-json/contact-form-7/v1/contact-forms/192/feedback
```

The form collects `your-name`, `your-email`, `your-subject` and `your-message`
and also uses Google reCAPTCHA v3. Contact Form 7 does not expose the configured
recipient mailbox publicly, so the final delivery address cannot be verified
from the public website.

The rebuilt form deliberately uses `mailto:info@collaborativeprofessionals.com.au`
so it works on static hosting without a back end. If a silent in-page
submission is preferred later, connect a form delivery service or a small
serverless endpoint.

## Domain cutover

GitHub Pages is the temporary public host. When the production hosting and DNS
credentials are available:

1. confirm the preferred canonical host (`www` or apex);
2. attach the custom domain at the selected host;
3. add the required DNS records;
4. verify HTTPS;
5. keep the old WordPress host available until redirects and the contact path
   have been checked.

