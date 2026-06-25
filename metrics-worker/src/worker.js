/* ============================================================
   Registro de apoyos — Worker de métricas (Cloudflare)
   Contador agregado y PRIVADO. No guarda IPs, cookies ni datos
   personales: solo tres números totales en Cloudflare KV.
   Despliegue: ver ../METRICAS.md
   ============================================================ */

// Eventos aceptados -> clave del contador en KV.
const EVENTS = { pageview: "visitas", click: "enlaces", unsub: "cancelaciones" };

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";
    const json = (obj, status = 200) =>
      new Response(JSON.stringify(obj), {
        status,
        headers: { ...corsHeaders(origin), "Content-Type": "application/json" },
      });

    // Preflight CORS
    if (request.method === "OPTIONS") return new Response(null, { headers: corsHeaders(origin) });

    const url = new URL(request.url);

    // Leer los totales -> { visitas, enlaces, cancelaciones }
    if (request.method === "GET" && url.pathname === "/stats") {
      const out = {};
      for (const key of Object.values(EVENTS)) {
        out[key] = parseInt((await env.METRICS.get(key)) || "0", 10);
      }
      return json(out);
    }

    // Sumar 1 a un contador: POST /hit?e=pageview|click|unsub
    if (request.method === "POST" && url.pathname === "/hit") {
      let ev = url.searchParams.get("e");
      if (!ev) { try { ev = (await request.json()).event; } catch (_) {} }
      const key = EVENTS[ev];
      if (!key) return json({ error: "evento no valido" }, 400);
      const n = parseInt((await env.METRICS.get(key)) || "0", 10) + 1;
      await env.METRICS.put(key, String(n));
      return json({ ok: true, [key]: n });
    }

    return json({ error: "no encontrado" }, 404);
  },
};
