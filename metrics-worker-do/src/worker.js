/* ============================================================
   Registro de apoyos — Worker de métricas v2 (Durable Object + SQLite)
   Reemplazo del contador en KV, que se congelaba al superar la cuota
   gratuita de ~1.000 escrituras/día. Un Durable Object tiene cuota
   propia (muy superior) y conteos atómicos exactos: ya NO hace falta
   muestreo en el front.
   Privado: igual que antes, NO guarda IPs, cookies ni datos personales;
   solo tres números totales en el almacenamiento del Durable Object.
   Despliegue: ver ../DESPLIEGUE.md
   ============================================================ */

// Eventos aceptados -> clave del contador.
const EVENTS = { pageview: "visitas", click: "enlaces", unsub: "cancelaciones" };

// Semilla = total REAL que tenía el contador en KV al migrar (2026-06-28).
// El Durable Object continúa desde aquí, así los números no se reinician.
const SEED = { visitas: 964, enlaces: 329, cancelaciones: 390 };

function corsHeaders(origin) {
  return {
    "Access-Control-Allow-Origin": origin || "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

// ---- Durable Object: guarda y suma los contadores (un único objeto global) ----
export class Counter {
  constructor(state) {
    this.state = state;
  }

  async current() {
    const out = {};
    for (const key of Object.values(EVENTS)) {
      const v = await this.state.storage.get(key);
      out[key] = (v === undefined ? SEED[key] : v) | 0;
    }
    return out;
  }

  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/stats") {
      return Response.json(await this.current());
    }

    if (url.pathname === "/hit") {
      let ev = url.searchParams.get("e");
      if (!ev) { try { ev = (await request.json()).event; } catch (_) {} }
      const key = EVENTS[ev];
      if (!key) return Response.json({ error: "evento no valido" }, { status: 400 });
      const prev = await this.state.storage.get(key);
      const n = (prev === undefined ? SEED[key] : prev) + 1;
      // Las operaciones de almacenamiento del DO se serializan por objeto:
      // el incremento es atómico, sin la condición de carrera que tenía KV.
      await this.state.storage.put(key, n);
      return Response.json({ ok: true, [key]: n });
    }

    return Response.json({ error: "no encontrado" }, { status: 404 });
  }
}

// ---- Worker de entrada: CORS + enruta todo al mismo Durable Object ----
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "*";
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    const id = env.COUNTER.idFromName("global");
    const res = await env.COUNTER.get(id).fetch(request);

    // Reenvía la respuesta del DO añadiendo cabeceras CORS.
    const headers = new Headers(res.headers);
    for (const [k, v] of Object.entries(corsHeaders(origin))) headers.set(k, v);
    return new Response(res.body, { status: res.status, headers });
  },
};
