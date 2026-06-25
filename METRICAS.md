# Estadísticas en vivo (visitas · perfiles abiertos · cancelaciones)

El sitio es estático, así que para mostrar números agregados a todos los
visitantes necesita un mini-backend. Usamos un **Cloudflare Worker** propio
(en tu cuenta), no un rastreador externo.

**Privacidad:** el Worker solo guarda **tres números** (visitas, perfiles
abiertos, cancelaciones en YouTube). No guarda IPs, ni cookies, ni nada que
identifique a una persona. Código completo en `metrics-worker/src/worker.js`.

## Desplegarlo (una sola vez, ~5 minutos)

Necesitas Node instalado y tu cuenta de Cloudflare.

```bash
cd metrics-worker

# 1) Inicia sesión en TU Cloudflare
npx wrangler login

# 2) Crea el almacén de contadores y copia el id que imprime
npx wrangler kv namespace create METRICS
#   -> pega ese id en wrangler.toml (reemplaza PEGA_AQUI_EL_ID)

# 3) Publica el Worker
npx wrangler deploy
#   -> te dará una URL del tipo:
#      https://registro-metricas.TU-SUBDOMINIO.workers.dev
```

## Conectarlo al sitio

1. Abre `index.html` y pega esa URL en la línea:
   ```js
   const METRICS_URL = "https://registro-metricas.TU-SUBDOMINIO.workers.dev";
   ```
2. En `_headers`, el `connect-src` ya permite `https://*.workers.dev`. Si más
   adelante le pones un dominio propio al Worker, añádelo ahí.
3. `git add -A && git commit -m "activar metricas" && git push`

Cuando `METRICS_URL` está vacío, la barra de estadísticas simplemente **no
aparece** (el sitio funciona igual). En cuanto la pegas, aparece sola.

## Notas

- Los contadores en KV son **aproximados** bajo mucho tráfico simultáneo
  (puede perderse alguna suma). Para conteo exacto se puede migrar a un
  *Durable Object*; para "estadísticas de impacto" la aproximación basta.
- ¿Solo quieres saber tú cuántas visitas hay, sin mostrarlas? Activa
  **Cloudflare Web Analytics** (gratis, sin cookies) en el panel de Cloudflare:
  es un panel privado para ti y no necesita este Worker.
