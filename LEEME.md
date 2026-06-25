# Cómo manejar el sitio

## Añadir o editar entradas (lo más común)
Todo el contenido vive en **`datos.csv`**. Ábrelo como una hoja de cálculo
(Excel, Numbers, Google Sheets o LibreOffice).

| columna | qué va | ¿obligatorio? |
|---|---|---|
| nombre | Nombre del medio / empresa / artista | sí |
| categoria | `medios`, `empresas` o `artistas` | sí |
| descripcion | Hecho concreto con fecha | recomendado |
| fuente | Enlace a la prueba pública | **sí — te protege** |
| instagram, twitter, facebook, tiktok, youtube | el @usuario (sin la URL) | opcional |

Reglas de oro:
- Solo **figuras y entidades públicas** (nunca personas privadas).
- **Cada fila con su fuente.** Sin fuente, no entra.
- Descripciones **fácticas** (qué hizo y cuándo), nunca insultos.

Guarda como **CSV (UTF-8)** y publica:
```
git add datos.csv
git commit -m "actualizar entradas"
git push
```
El sitio se actualiza solo en 1–2 minutos.

## Probar en tu computador
```
python3 -m http.server 8000 --directory directorio-boicot
```
Luego abre http://localhost:8000

## Seguridad, respaldos y resiliencia
Ver **RESILIENCIA.md**.
