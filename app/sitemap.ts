import type { MetadataRoute } from "next";
import articles from "@/content/articles.json";

export const dynamic = "force-static";

const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  "https://collaborativeprofessionals.com.au"
).replace(/\/$/, "");

const faqSlugs = [
  "how-does-collaborative-practice-differ-from-mediation-or-other-dispute-resolution-processes",
  "is-it-confidential",
  "is-it-for-everyone",
  "what-are-the-benefits",
  "what-if-my-partner-doesnt-comply-with-disclosure-requirements",
  "what-is-the-participation-agreement",
  "who-may-be-involved-in-the-collaborative-practice-process",
];

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "",
    "/members",
    "/process",
    "/news",
    "/contact",
    "/testimonials/530",
  ];

  return [
    ...staticRoutes.map((path) => ({
      url: `${siteUrl}${path}/`,
    })),
    ...articles.map((article) => ({
      url: `${siteUrl}/news/${article.slug}/`,
      lastModified: new Date(`${article.date}T00:00:00+10:00`),
    })),
    ...faqSlugs.map((slug) => ({
      url: `${siteUrl}/faq/${slug}/`,
    })),
  ];
}
