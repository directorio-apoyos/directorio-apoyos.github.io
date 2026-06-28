# Desplegar el contador v2 (Durable Object)

Reemplaza el contador en KV (que se congelaba al pasar ~1.000 escrituras/día).
El Durable Object tiene cuota propia mucho mayor y conteos exactos.
Continúa desde los totales actuales (semilla 964 / 329 / 390 en `src/worker.js`).

## Pasos

1. Entra a la carpeta del worker nuevo:

   ```
   cd directorio-boicot/metrics-worker-do
   ```

2. (Si hace falta) inicia sesión en Cloudflare:

   ```
   npx wrangler login
   ```

3. Despliega:

   ```
   npx wrangler deploy
   ```

4. Copia la URL que imprime al final, algo como:

   ```
   https://registro-metricas-do.<tu-subdominio>.workers.dev
   ```

5. Pásame esa URL. Yo cambio `METRICS_URL` en `index.html`, quito el muestreo
   (vuelve a conteo exacto 1:1) y publico. Verificamos que `/stats` responda
   `{"visitas":964,"enlaces":329,"cancelaciones":390}` y que `/hit` sume.

## Comprobación rápida (opcional, antes de pasarme la URL)

```
curl https://registro-metricas-do.<tu-subdominio>.workers.dev/stats
# -> {"visitas":964,"enlaces":329,"cancelaciones":390}

curl -X POST "https://registro-metricas-do.<tu-subdominio>.workers.dev/hit?e=pageview"
# -> {"ok":true,"visitas":965}
```

## Después

- El worker viejo (`metrics-worker`, en KV) puede quedar como está o borrarse;
  ya no se usará una vez cambiada la URL en el front.
- Si quieres un dominio propio para el worker, puedes añadir una `route` en
  `wrangler.toml`, pero la URL `*.workers.dev` funciona perfectamente.
