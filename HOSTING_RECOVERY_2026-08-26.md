# SSCP website hosting recovery — 26 August 2026

This file records verified hosting and cutover evidence for
`collaborativeprofessionals.com.au`. It deliberately contains no passwords,
one-time codes, recovery codes or other credentials.

## Verified topology

- **Production website:** the legacy WordPress site at
  `https://collaborativeprofessionals.com.au/`.
- **Current WordPress host:** WP Engine, environment name `southernsydney`.
  The provider hostname `southernsydney.wpenginepowered.com` redirects to the
  production domain.
- **Registrar and authoritative DNS:** IWantMyName. Authoritative nameservers:
  `dns1.iwantmyname.com`, `dns2.iwantmyname.com`, and
  `dns3.iwantmyname.com`.
- **Original developer:** Simon Johnson / Red Crow Digital. Email history
  confirms that Red Crow handed the WordPress site to Adrian, recommended WP
  Engine, supplied the IWantMyName account route, and retired the prior host
  after Adrian confirmed the WP Engine migration in January 2024.
- **Rebuilt source:**
  `https://github.com/Arav1oli/collaborativeprofessionals.com.au`.
- **Public rebuilt preview:**
  `https://arav1oli.github.io/collaborativeprofessionals.com.au/`.
- **GitHub Pages status:** public, HTTPS enforced, built from `main` by the
  repository workflow. The last checked workflow and public HTTP response were
  successful.
- **Sites deployment:** the same rebuilt source has an active owner-only Sites
  deployment. It has no custom domain attached and is not currently the public
  production site.

## DNS snapshot before any cutover

Captured on 26 August 2026 (Australia/Sydney):

- Apex A: `141.193.213.10`, `141.193.213.11` (WP Engine)
- `www` CNAME: `wp.wpenginepowered.com`
- MX: Google Workspace (`aspmx.l.google.com` and alternates)
- Apex TXT includes Google site verification and
  `v=spf1 include:mailgun.org ~all`

The MX and TXT records are independent of the website host and must be
preserved during any DNS change so email is not interrupted.

## Domain availability snapshot

Checked directly against live DNS and the .au registry WHOIS on 26 August
2026:

- `sscp.com.au` — registered to another party; not available.
- `sscp.au` — domain not found at the registry at the time checked; appears
  available to register, subject to registrar eligibility and checkout.
- `sscp.org.au` — domain not found at the registry at the time checked;
  appears available to register, subject to not-for-profit eligibility and
  registrar checkout.
- `sscp.com` and `sscp.org` — already registered.

Availability is time-sensitive and is not a reservation.

## Recommended production path

Use the existing domain rather than abandoning it. The lowest-risk route is:

1. Update and validate the rebuilt source in this repository.
2. Deploy and verify the updated preview before changing DNS.
3. Recover and verify access to both WP Engine and IWantMyName.
4. In GitHub Pages, configure and verify the custom domain before changing DNS.
5. Preserve all MX and TXT records. Replace only the website records:
   - apex A records with GitHub Pages addresses;
   - `www` CNAME with `Arav1oli.github.io`.
6. Verify the apex, `www`, HTTPS, all main routes, downloads and the contact
   path from outside the authenticated accounts.
7. Keep WP Engine active and unchanged until the new domain has been verified
   and a rollback window has passed.

The alternative is to make the Sites deployment public and attach the custom
domain there. GitHub Pages is currently the shorter path because it is already
public and verified, while the Sites copy is owner-only.

## Important functional difference

The WordPress site uses Contact Form 7. The rebuilt static site deliberately
opens a pre-addressed email in the visitor's email application. A silent
in-page form submission would require a serverless form endpoint or delivery
service before cutover.

## Access state

- WP Engine sign-in page reached; account login not yet verified in this
  recovery run.
- IWantMyName credentials were recovered from the historical Red Crow handover
  email, but the account's current second-factor path has not yet been proven.
- A 2FA recovery request was sent to IWantMyName support on 10 August 2026;
  no support reply was found in Adrian's Gmail during this audit.

## Rollback

Before changing DNS, record the current values above. If the new site fails,
restore the apex A records to `141.193.213.10` and `141.193.213.11` and restore
the `www` CNAME to `wp.wpenginepowered.com`. Do not change MX or TXT records.

## Rebuild update status — 26 August 2026

The requested member-directory changes have been applied to the rebuilt site:

- 7 former members removed and 5 new members added;
- Lynda Babister's email updated;
- Adam Ratcliffe set as Secretary in position 4;
- Stephanie Martyn set as Committee Member in position 7;
- Tanya Carlson's former committee label removed.

The rebuilt site now contains 28 members. New profiles without supplied portrait
files use the site's existing initials treatment. The production build, static
GitHub Pages build and all automated rendered-page tests completed successfully.
Normal browser viewport checks confirmed the revised leadership cards and new
member cards render correctly. This status records a validated local source
state; public publication and the live-domain cutover must be recorded
separately after direct verification.
