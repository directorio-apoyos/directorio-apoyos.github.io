# Estadísticas en vivo (visitas · perfiles abiertos · cancelaciones)

El sitio es estático, así que para mostrar números agregados a todos los
visitantes necesita un mini-backend. Usamos un **Cloudflare Worker** propio
(en tu cuenta), no un rastreador externo.

**Privacidad:** el Worker solo guarda **tres números** (visitas, perfiles
abiertos, cancelaciones en YouTube). No guarda IPs, ni cookies, ni nada que
identifique a una persona. Código completo en `metrics-worker/src/worker.js`.

Hay **dos formas** de desplegarlo. **No necesitas la terminal** si eliges la A.

---

## Opción A — SIN terminal (panel web de Cloudflare) ✅ recomendada

Todo con clics, en https://dash.cloudflare.com (tu cuenta).

1. **Crear el almacén (KV):**
   - Menú izquierdo → *Almacenamiento y bases de datos* → *KV*
     (o *Workers y Pages* → *KV*).
   - *Crear espacio de nombres* → nómbralo **`METRICS`** → *Crear*.

2. **Crear el Worker:**
   - *Workers y Pages* → *Crear aplicación* → *Crear Worker*.
   - Nombre: **`registro-metricas`** → *Implementar* (crea uno de ejemplo).
   - *Editar código* → borra el código de ejemplo → **pega todo** el contenido
     de `metrics-worker/src/worker.js` → *Implementar*.

3. **Conectar el almacén al Worker:**
   - En el Worker → *Configuración* → *Variables y enlaces* (Bindings) →
     *KV namespace bindings* → *Añadir*:
     - Nombre de variable: **`METRICS`**
     - Espacio de nombres: elige **`METRICS`**.
   - Guarda / *Implementar* de nuevo.

4. **Copia la URL** que te da el Worker, del tipo:
   `https://registro-metricas.TU-SUBDOMINIO.workers.dev`

*(Las etiquetas exactas del panel cambian de vez en cuando; si algo no coincide,
dime qué ves en pantalla y te guío clic a clic.)*

## Opción B — con terminal (wrangler)

Si te animas con la terminal, son 3 comandos:

```bash
cd metrics-worker
npx wrangler login
npx wrangler kv namespace create METRICS   # pega el id en wrangler.toml
npx wrangler deploy
```

---

## Conectar la URL al sitio (lo hago yo si quieres)

1. Pega la URL del Worker en `index.html`:
   ```js
   const METRICS_URL = "https://registro-metricas.TU-SUBDOMINIO.workers.dev";
   ```
2. `_headers` ya permite `https://*.workers.dev` en `connect-src`.
3. `git commit` + `git push`.

Mándame la URL y yo hago estos 3 pasos. Mientras `METRICS_URL` esté vacío, la
barra de estadísticas **no aparece** y el sitio funciona igual.

## ¿Solo quieres saber tú las visitas, sin mostrarlas?

Activa **Cloudflare Web Analytics** (gratis, sin cookies, sin Worker): en el
panel de Cloudflare → *Analytics* → *Web Analytics* → *Add a site*. Es un panel
privado para ti, en 2 minutos y sin nada de esto.
