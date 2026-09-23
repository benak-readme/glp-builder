import { saveDesign, getShareStore } from "./share.mjs";

/* GLP Builder connector: a minimal, stateless MCP server (Streamable HTTP,
   JSON responses only) at /mcp. Add it in Claude as a custom connector and
   Claude, running on the user's own Claude login, can turn any docs landing
   page into a builder design and hand back a /g/<code> link. No API key.

   Tools
   - get_design_guide : the JSON format + mapping rules (design-guide.md)
   - create_design    : store a design, return the builder link
   Designs go in the same Blobs store as the builder's Share links. */

const SERVER = { name: "glp-builder", version: "1.0.0" };
const PROTOCOLS = ["2025-06-18", "2025-03-26", "2024-11-05"];

const INSTRUCTIONS =
  "Use this connector to build ReadMe Enterprise Global Landing Pages in GLP Builder. " +
  "To recreate or draft a page: call get_design_guide once, fetch the source page if the user gave one, " +
  "write the design JSON the guide describes, then call create_design and give the user the returned link.";

const TOOLS = [
  {
    name: "get_design_guide",
    title: "Get the GLP Builder design guide",
    description:
      "Returns the design JSON format GLP Builder accepts (hero, brand bar, card and column sections, theme) " +
      "with mapping tips and a complete example. Call this before create_design. When recreating a page, copy the " +
      "source page's own structure, colors and fonts faithfully; don't imitate the builder's built-in templates.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    annotations: { readOnlyHint: true },
  },
  {
    name: "create_design",
    title: "Open a design in GLP Builder",
    description:
      "Saves a GLP Builder design and returns a link that opens it in the builder, where the user can edit it " +
      "and copy the final HTML. `design` must follow get_design_guide (an object with a `sections` array).",
    inputSchema: {
      type: "object",
      properties: {
        design: { type: "object", description: "The design JSON described by get_design_guide." },
        name: { type: "string", description: "Short page name shown in the builder, e.g. 'Stripe docs recreation'." },
      },
      required: ["design"],
    },
  },
];

const ok = (id, result) => ({ jsonrpc: "2.0", id, result });
const fail = (id, code, message) => ({ jsonrpc: "2.0", id, error: { code, message } });
const text = (t, isError) => ({ content: [{ type: "text", text: t }], ...(isError ? { isError: true } : {}) });

async function callTool(name, args, origin, store) {
  if (name === "get_design_guide") {
    const res = await fetch(origin + "/design-guide.md");
    if (!res.ok) return text("Couldn't load the design guide (" + res.status + ").", true);
    return text(await res.text());
  }
  if (name === "create_design") {
    const design = args && args.design;
    if (!design || typeof design !== "object" || Array.isArray(design)) return text("`design` must be a JSON object.", true);
    const nm = typeof args.name === "string" ? args.name.slice(0, 80) : "";
    const body = JSON.stringify(nm ? { ...design, _meta: { ...(design._meta || {}), name: nm } } : design);
    const r = await saveDesign(store, body);
    if (r.error) return text("The builder rejected that design: " + r.error + ". Check it against get_design_guide.", true);
    const url = origin + "/g/" + r.code;
    return text(
      "Design saved. Open it in GLP Builder: " + url + "\n\n" +
        "Tell the user: click the link, review it (text is editable right in the preview), then use " +
        "\"Save as a page\" to keep it and \"Copy HTML\" to paste into ReadMe (dash > group > Global Landing Page)."
    );
  }
  return null;
}

export async function handleRpc(msg, origin, store) {
  if (!msg || msg.jsonrpc !== "2.0" || typeof msg.method !== "string") return fail(msg && msg.id != null ? msg.id : null, -32600, "Invalid Request");
  const { id, method, params } = msg;
  const isNotification = id === undefined || id === null;
  if (isNotification) return null; /* notifications/initialized etc. need no reply */

  switch (method) {
    case "initialize": {
      const asked = params && params.protocolVersion;
      return ok(id, {
        protocolVersion: PROTOCOLS.includes(asked) ? asked : PROTOCOLS[0],
        capabilities: { tools: { listChanged: false } },
        serverInfo: SERVER,
        instructions: INSTRUCTIONS,
      });
    }
    case "ping":
      return ok(id, {});
    case "tools/list":
      return ok(id, { tools: TOOLS });
    case "tools/call": {
      const r = await callTool(params && params.name, (params && params.arguments) || {}, origin, store);
      return r ? ok(id, r) : fail(id, -32602, "Unknown tool: " + (params && params.name));
    }
    default:
      return fail(id, -32601, "Method not found: " + method);
  }
}

export async function handle(req, store) {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "POST JSON-RPC to this endpoint (MCP Streamable HTTP)." }), {
      status: 405,
      headers: { "Content-Type": "application/json", Allow: "POST" },
    });
  }
  let body;
  try { body = await req.json(); } catch { return Response.json(fail(null, -32700, "Parse error"), { status: 400 }); }
  const origin = new URL(req.url).origin;
  const msgs = Array.isArray(body) ? body : [body];
  const replies = (await Promise.all(msgs.map((m) => handleRpc(m, origin, store)))).filter(Boolean);
  if (!replies.length) return new Response(null, { status: 202 });
  return Response.json(Array.isArray(body) ? replies : replies[0]);
}

export default async (req) => handle(req, getShareStore());

export const config = { path: "/mcp" };
