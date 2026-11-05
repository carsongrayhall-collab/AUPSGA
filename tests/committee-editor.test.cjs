const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const ts = require("typescript");

// Load the real TypeScript route with isolated auth/storage adapters. No live
// credentials, uploads, or site configuration are touched by these tests.
function loadSource(relative, mocks = {}) {
  const filename = path.resolve(__dirname, "..", relative);
  const source = ts.transpileModule(fs.readFileSync(filename, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const module = { exports: {} };
  const localRequire = name => {
    if (Object.hasOwn(mocks, name)) return mocks[name];
    if (name.startsWith("@/")) return loadSource(`src/${name.slice(2)}.ts`, mocks);
    return require(name);
  };
  new Function("require", "module", "exports", source)(localRequire, module, module.exports);
  return module.exports;
}

const helpers = loadSource("src/lib/committeePositions.ts");
function harness({ authorized = true, uploadFails = false } = {}) {
  const config = { committees: {}, media: {}, timeline: [{ id: "keep-me" }] };
  let saves = 0;
  let uploads = 0;
  const route = loadSource("src/app/api/admin/committees/route.ts", {
    "@/lib/adminAuth": { requireAdminSession: async () => { if (!authorized) throw new Error("Unauthorized"); } },
    "@/lib/adminMedia": {
      validateMediaFile: file => file.type === "image/png" ? null : "Invalid image",
      persistMediaFile: async key => { uploads++; if (uploadFails) throw new Error("offline"); return `/uploads/${key}.png`; },
    },
    "@/lib/siteConfig": { getSiteConfig: async () => config, saveSiteConfig: async () => { saves++; } },
  });
  async function post(positions, { committeeId = "coc", file, origin = "https://sga.test" } = {}) {
    const data = new FormData();
    data.set("committeeId", committeeId);
    data.set("positions", JSON.stringify(positions));
    if (file) data.set(`image-${positions[0].id}`, file);
    return route.POST(new Request("https://sga.test/api/admin/committees", { method: "POST", body: data, headers: { origin } }));
  }
  return { config, post, get saves() { return saves; }, get uploads() { return uploads; } };
}

test("IDs stay independent for duplicate names and across committees", () => {
  const positions = helpers.defaultPositions([["VACANT", "VACANT"]]);
  assert.notEqual(positions[0].id, positions[1].id);
  assert.notEqual(helpers.positionMediaKey("coc", positions[0].id), helpers.positionMediaKey("jc", positions[0].id));
  assert.throws(() => helpers.parsePositions([positions[0], positions[0]]));
  assert.throws(() => helpers.parsePositions([{ id: "position-0", name: " " }]));
  assert.throws(() => helpers.parsePositions(Array(41).fill(positions[0])));
  assert.deepEqual(helpers.parsePositions([]), []);
});

test("unauthenticated and cross-origin writes are rejected", async () => {
  const unauthenticated = harness({ authorized: false });
  assert.equal((await unauthenticated.post([])).status, 401);
  assert.equal(unauthenticated.saves, 0);
  const h = harness();
  assert.equal((await h.post([], { origin: "https://other.test" })).status, 403);
  assert.equal(h.saves, 0);
});

test("invalid committee, data, and image never save", async () => {
  const h = harness();
  assert.equal((await h.post([], { committeeId: "unknown" })).status, 400);
  assert.equal((await h.post({ name: "invalid" })).status, 400);
  assert.equal((await h.post([{ id: "position-0", name: "Name" }], { file: new File(["bad"], "bad.txt", { type: "text/plain" }) })).status, 400);
  assert.equal(h.saves, 0);
  assert.equal(h.uploads, 0);
});

test("rename migrates old photos and adding/removing retains other content", async () => {
  const h = harness();
  const oldPhoto = { src: "/old.png", alt: "CHAIR", objectPosition: "25% 75%" };
  h.config.media[helpers.legacyPositionMediaKey("CHAIR")] = oldPhoto;
  h.config.committees.jc = [{ id: "position-0", name: "Other committee" }];
  const positions = [{ id: "position-0", name: "Renamed chair" }, { id: "12345678-1234-1234-1234-123456789abc", name: "New position" }];
  assert.equal((await h.post(positions)).status, 200);
  assert.deepEqual(h.config.committees.coc, positions);
  assert.deepEqual(h.config.media[helpers.positionMediaKey("coc", "position-0")], oldPhoto);
  assert.equal((await h.post([])).status, 200);
  assert.deepEqual(h.config.committees.coc, []);
  assert.equal(h.config.committees.jc.length, 1);
  assert.equal(h.config.timeline[0].id, "keep-me");
});

test("image is stored under stable position key; failed upload does not save", async () => {
  const positions = [{ id: "position-0", name: "New name" }];
  const file = new File(["image"], "image.png", { type: "image/png" });
  const h = harness();
  assert.equal((await h.post(positions, { file })).status, 200);
  assert.equal(h.config.media["committee-coc-position-0"].src, "/uploads/committee-coc-position-0.png");
  const failed = harness({ uploadFails: true });
  assert.equal((await failed.post(positions, { file })).status, 500);
  assert.equal(failed.saves, 0);
  assert.deepEqual(failed.config.committees, {});
});
