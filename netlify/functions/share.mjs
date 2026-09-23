import { getStore } from "@netlify/blobs";

/* Short-link backend for GLP Builder shared designs.
   POST  /.netlify/functions/share      body = config JSON        -> { code }
   GET   /.netlify/functions/share?id=…  -> the stored config JSON
   Designs are kept in a Netlify Blobs store, keyed by a short code, so a
   shareable link is ~30 chars instead of the whole config in the URL. */

/* The builder calls this from its own origin, so no cross-origin access is
   granted: other sites can't script writes into the store from a browser. */
const CORS = {};

/* code alphabet excludes look-alikes (0/o/1/l/i) so codes are easy to read aloud */
const CODE_CHARS = "23456789abcdefghijkmnpqrstuvwxyz";
const CODE_RE = /^[a-z0-9]{4,16}$/;
const MAX_BYTES = 400 * 1024; /* generous ceiling for a design payload */

function makeCode(n = 7) {
  const bytes = new Uint8Array(n);
  crypto.getRandomValues(bytes);
  let s = "";
  for (let i = 0; i < n; i++) s += CODE_CHARS[bytes[i] % CODE_CHARS.length];
  return s;
}

const json = (obj, status) =>
  new Response(JSON.stringify(obj), { status, headers: { ...CORS, "Content-Type": "application/json" } });

/* pure request handler — the store is injected so it can be unit-tested */
export async function handle(req, store) {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });

  if (req.method === "GET") {
    const id = new URL(req.url).searchParams.get("id");
    if (!id || !CODE_RE.test(id)) return json({ error: "bad id" }, 400);
    const data = await store.get(id);
    if (data == null) return json({ error: "not found" }, 404);
    return new Response(data, {
      status: 200,
      headers: { ...CORS, "Content-Type": "application/json", "Cache-Control": "public, max-age=31536000, immutable" },
    });
  }

  if (req.method === "POST") {
    let body;
    try { body = await req.text(); } catch { return json({ error: "bad body" }, 400); }
    if (!body) return json({ error: "empty" }, 400);
    if (new TextEncoder().encode(body).length > MAX_BYTES) return json({ error: "too large" }, 413);
    let parsed;
    try { parsed = JSON.parse(body); } catch { return json({ error: "invalid json" }, 400); }
    /* must look like a builder config: an object with a sections array */
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed) || !Array.isArray(parsed.sections)) {
      return json({ error: "not a design" }, 400);
    }

    /* find a code that isn't already taken (collisions are astronomically rare) */
    let code = makeCode();
    for (let i = 0; i < 5 && (await store.get(code)) != null; i++) code = makeCode();
    await store.set(code, body);
    return json({ code }, 200);
  }

  return json({ error: "method not allowed" }, 405);
}

/* strong consistency so a freshly shared link is readable immediately
   (the default eventual mode can 404 for up to ~a minute after the write) */
export default async (req) => handle(req, getStore({ name: "glp-shares", consistency: "strong" }));

/* exported for tests */
export const _internals = { makeCode, CODE_CHARS, CODE_RE };
