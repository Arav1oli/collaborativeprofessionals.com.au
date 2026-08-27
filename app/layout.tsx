import type { Metadata } from "next";
import { SiteFooter } from "@/app/components/SiteFooter";
import { SiteHeader } from "@/app/components/SiteHeader";
import { asset } from "@/app/lib/paths";
import { site } from "@/content/site";
import "./globals.css";

const canonicalUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://collaborativeprofessionals.com.au";
const metadataBase = new URL(new URL(canonicalUrl).origin);

export const metadata: Metadata = {
  metadataBase,
  title: {
    default: site.name,
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  icons: {
    icon: asset("/media/legacy/2017/09/logo-tree-150x78.png"),
  },
  openGraph: {
    title: site.name,
    description: site.description,
    type: "website",
    locale: "en_AU",
    images: [
      {
        url: asset("/media/sscp-collaborative-meeting-v3.jpg"),
        width: 1920,
        height: 960,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: site.name,
    description: site.description,
    images: [asset("/media/sscp-collaborative-meeting-v3.jpg")],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body>
        <a className="skip-link" href="#main-content">
          Skip to content
        </a>
        <SiteHeader />
        <div id="main-content">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
