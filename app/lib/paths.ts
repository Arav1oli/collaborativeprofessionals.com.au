const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function href(path: string) {
  if (path === "/") return `${basePath}/`;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export function asset(path: string) {
  return href(path);
}

export function htmlWithBasePath(markup: string) {
  const localisedMarkup = markup
    .replaceAll(
      "http://southernsydney.wpenginepowered.com/wp-content/uploads/",
      `${basePath}/media/legacy/`,
    )
    .replaceAll(
      "https://southernsydney.wpenginepowered.com/wp-content/uploads/",
      `${basePath}/media/legacy/`,
    )
    .replaceAll(
      "http://southernsydney.wpenginepowered.com",
      "https://collaborativeprofessionals.com.au",
    )
    .replaceAll(
      "https://southernsydney.wpenginepowered.com",
      "https://collaborativeprofessionals.com.au",
    );

  if (!basePath) return localisedMarkup;
  return localisedMarkup
    .replaceAll('src="/media/', `src="${basePath}/media/`)
    .replaceAll('href="/media/', `href="${basePath}/media/`)
    .replaceAll("src='/media/", `src='${basePath}/media/`)
    .replaceAll("href='/media/", `href='${basePath}/media/`)
    .replaceAll('srcset="/media/', `srcset="${basePath}/media/`)
    .replaceAll(", /media/", `, ${basePath}/media/`);
}
