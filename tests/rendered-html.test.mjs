import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the finished home page", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Divorce/);
  assert.match(html, /without court/);
  assert.match(html, /Southern Sydney Collaborative Professionals/);
  assert.match(html, /Find a professional/);
  assert.match(html, /One table\. One team\./);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton/i);
});

test("server-renders all primary routes", async () => {
  const routes = [
    ["/members/", /Shelby Timmins/],
    ["/process/", /Collaborative practice FAQs/],
    ["/news/", /Understanding Collaborative Divorce/],
    ["/contact/", /Prepare email/],
    [
      "/news/understanding-collaborative-divorce-how-working-together-helps-everyone/",
      /How Working Together Helps Everyone/,
    ],
  ];

  for (const [path, expected] of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, path);
    assert.match(await response.text(), expected);
  }
});

test("keeps a complete, reproducible legacy archive", async () => {
  const manifest = JSON.parse(
    await readFile(
      new URL("../legacy-archive/manifest.json", import.meta.url),
      "utf8",
    ),
  );

  assert.equal(manifest.failures.length, 0);
  assert.equal(manifest.pages.length, 29);
  assert.ok(manifest.assets.length >= 350);
  assert.equal(manifest.wordpress_collections.pages, 5);
  assert.equal(manifest.wordpress_collections.posts, 10);
  assert.equal(manifest.wordpress_collections.media, 49);

  await access(
    new URL(
      "../public/media/legacy/2017/10/logo-tree_v3.png",
      import.meta.url,
    ),
  );
  await access(
    new URL(
      "../public/media/legacy/2017/09/SSCP-Marketing-Brochure.pdf",
      import.meta.url,
    ),
  );
  await access(new URL("../public/og.png", import.meta.url));
});
