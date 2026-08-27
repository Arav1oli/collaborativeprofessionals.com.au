import assert from "node:assert/strict";
import { access, readFile, stat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const read = (relativePath) => readFile(path.join(root, relativePath), "utf8");
const members = JSON.parse(await read("content/members.json"));

const currentNames = [
  "Shelby Timmins",
  "Lynda Babister",
  "Riccarda Stock",
  "Adam Ratcliffe",
  "Antonella Sanderson",
  "Leona Bennett",
  "Stephanie Martyn",
  "Tanya Carlson",
  "Donal Minehan",
  "Pamela Wood",
  "Nicole Quirk",
  "Tim D'Astoli",
  "Fiona Giannakopoulos",
  "Veronica Phillips",
  "Kendra Millar",
  "Kate Marr",
  "Lisa O'Leary",
  "Nicole Carroll",
  "Nikita Ward",
  "Chloe Malic",
  "Shweta Kumar",
  "Caitlin McGrath",
  "Jayne Humphreys",
  "Claudia Taylor",
  "Madeline Laurence",
  "Emma Bailey",
  "Georgia Thompson",
  "Sophia Martyn",
];

const removedNames = [
  "Melody Van Der Wallen",
  "Fiona Kirkman",
  "Kylie Holmes",
  "Georgia Carroll",
  "Kirsten Attard",
  "Kirstin Attard",
  "Kristy Durrant",
  "Laura Tilt",
];

function assertNoLegacyHero(markup) {
  assert.doesNotMatch(markup, /SSCP-Group-Photo\.jpg/);
}

async function verifySource() {
  const [home, layout, memberPage, css] = await Promise.all([
    read("app/page.tsx"),
    read("app/layout.tsx"),
    read("app/members/page.tsx"),
    read("app/globals.css"),
  ]);

  assert.throws(() => assertNoLegacyHero('src="SSCP-Group-Photo.jpg"'));
  assertNoLegacyHero(home);
  assertNoLegacyHero(layout);
  assert.match(home, /sscp-collaborative-meeting-v3\.jpg/);
  assert.match(layout, /sscp-collaborative-meeting-v3\.jpg/g);
  assert.match(memberPage, /compact/);
  assert.doesNotMatch(memberPage, /member-number|member-index|index\s*\+/i);
  assert.match(css, /\.member-grid\s*\{[^}]*display:\s*flex;[^}]*flex-direction:\s*column;/s);
  assert.match(css, /\.page-intro-compact\s*\{/);

  const hero = await stat(path.join(root, "public/media/sscp-collaborative-meeting-v3.jpg"));
  assert.ok(hero.size > 250_000, "approved hero asset is unexpectedly small");
  console.log("source parity verified");
}

function verifyMembers() {
  assert.deepEqual(members.map((member) => member.name), currentNames);
  for (const name of removedNames) {
    assert.equal(members.some((member) => member.name === name), false, name);
  }

  const byName = Object.fromEntries(members.map((member) => [member.name, member]));
  assert.equal(byName["Adam Ratcliffe"].leadership, "SSCP Secretary");
  assert.equal(byName["Stephanie Martyn"].leadership, "SSCP Committee Member");
  assert.equal(byName["Tanya Carlson"].leadership, "");
  assert.equal(byName["Lynda Babister"].email, "lynda@transituslegal.com.au");
  assert.equal(byName["Lynda Babister"].website, "https://transituslegal.com.au/");
  console.log("member parity verified");
}

async function verifyPortraits() {
  const fallbacks = members.filter((member) => !member.photo);
  assert.deepEqual(fallbacks.map((member) => member.name), ["Fiona Giannakopoulos"]);
  assert.match(fallbacks[0].photoFallback, /official FKG Law site/i);

  for (const member of members.filter((entry) => entry.photo)) {
    await access(path.join(root, "public", member.photo));
  }

  for (const name of currentNames.slice(-5)) {
    assert.match(members.find((member) => member.name === name).photo, /^\/media\/members\/.+\.jpg$/);
  }
  console.log("portrait coverage verified");
}

const mode = process.argv[2];
if (mode === "source") await verifySource();
else if (mode === "members") verifyMembers();
else if (mode === "portraits") await verifyPortraits();
else throw new Error("Use source, members, or portraits");
