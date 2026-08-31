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
  assert.match(html, /Helping couples reach respectful resolutions/);
  assert.match(html, /sscp-collaborative-meeting-v3\.jpg/);
  assert.doesNotMatch(html, /SSCP-Group-Photo\.jpg/);
  assert.doesNotMatch(html, /Divorce without court/i);
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

test("keeps archived resource content on the secure production site", async () => {
  const response = await render(
    "/news/step-by-step-collaborative-family-law-settlement-process/",
  );
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.doesNotMatch(html, /southernsydney\.wpenginepowered\.com/i);
  assert.doesNotMatch(html, /src=["']http:\/\//i);
  assert.match(
    html,
    /\/media\/legacy\/2023\/08\/Initial-Meetings-2-1024x1024\.png/,
  );
  assert.match(html, /https:\/\/collaborativeprofessionals\.com\.au/);
});

test("renders sourced member profiles with local portraits", async () => {
  const response = await render("/members/");
  const html = await response.text();
  const members = JSON.parse(
    await readFile(new URL("../content/members.json", import.meta.url), "utf8"),
  );

  assert.equal(members.length, 28);
  assert.equal(members.filter((member) => member.bio).length, 28);
  assert.equal(members.filter((member) => member.source).length, 28);
  assert.equal(members.filter((member) => member.photo).length, 27);
  assert.equal(members[3].name, "Adam Ratcliffe");
  assert.equal(members[3].leadership, "SSCP Secretary");
  assert.equal(members[6].name, "Stephanie Martyn");
  assert.equal(members[6].leadership, "SSCP Committee Member");
  assert.equal(
    members.find((member) => member.name === "Tanya Carlson").leadership,
    "",
  );
  assert.equal(
    members.find((member) => member.name === "Lynda Babister").email,
    "lynda@transituslegal.com.au",
  );
  assert.equal(
    members.find((member) => member.name === "Lynda Babister").website,
    "https://transituslegal.com.au/",
  );

  for (const name of [
    "Claudia Taylor",
    "Madeline Laurence",
    "Emma Bailey",
    "Georgia Thompson",
    "Sophia Martyn",
  ]) {
    assert.ok(members.some((member) => member.name === name), name);
  }

  for (const name of [
    "Melody van der Wallen",
    "Fiona Kirkman",
    "Kylie Holmes",
    "Georgia Carroll",
    "Kirstin Attard",
    "Kristy Durrant",
    "Laura Tilt",
  ]) {
    assert.ok(!members.some((member) => member.name === name), name);
  }
  assert.match(html, /Portrait of Shelby Timmins/);
  assert.match(html, /Read profile/);

  for (const member of members.filter((entry) => entry.photo)) {
    await access(new URL(`../public${member.photo}`, import.meta.url));
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
  await access(
    new URL(
      "../public/media/legacy/2017/09/SSCP-Group-Photo.jpg",
      import.meta.url,
    ),
  );
});
