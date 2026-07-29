const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export function href(path: string) {
  if (path === "/") return `${basePath}/`;
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`;
}

export function asset(path: string) {
  return href(path);
}

export function htmlWithBasePath(markup: string) {
  if (!basePath) return markup;
  return markup
    .replaceAll('src="/media/', `src="${basePath}/media/`)
    .replaceAll('href="/media/', `href="${basePath}/media/`)
    .replaceAll("src='/media/", `src='${basePath}/media/`)
    .replaceAll("href='/media/", `href='${basePath}/media/`);
}
