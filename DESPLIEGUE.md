# Despliegue resiliente y espejos (mirrors)

Meta: que el sitio **no se pueda borrar**. Estrategia de dos capas:

- **Frente público fácil** (mucho alcance): tu dominio `.com` + Cloudflare Pages o GitHub Pages.
- **Espejos resistentes a censura** (casi imposibles de bajar): IPFS y/o Arweave.

Si tumban el frente, el contenido sigue vivo en los espejos y solo **re-apuntas el dominio**.

> El sitio ya es **estático y compatible con IPFS** (rutas relativas), así que publicar
> un espejo es solo conectar el servicio — no hay que cambiar el código.

---

## 1. Espejo en IPFS — recomendado, gratis (vía Fleek)
Fleek publica tu repositorio en IPFS automáticamente en cada `push` (como Netlify,
pero descentralizado).

1. Entra a **fleek.co** y crea una cuenta (usa el email anónimo si vas en modo seudónimo).
2. *Add new site* → conecta tu repo de GitHub `directorio-apoyos-publicos`.
3. Build command: **(vacío)**. Publish directory: **`/`** (la raíz, donde está `index.html`).
4. *Deploy*. Fleek te da un **hash IPFS** y una URL de gateway `https://…`.
5. Cada `push` actualiza el espejo solo.

Alternativas manuales: **Pinata** (pinata.cloud) o **web3.storage** — subes la carpeta
`directorio-boicot/` y te dan el hash.

## 2. Copia permanente en Arweave — pago único, para siempre
Arweave guarda el sitio de forma **permanente e inmutable** en una red distribuida.

1. Crea una wallet en **arweave.app** y cárgala con un poco de AR (un sitio estático
   cuesta centavos).
2. Sube la carpeta con **ArDrive** (ardrive.io, interfaz web) o el CLI `arkb deploy`.
3. Obtienes una URL permanente `https://arweave.net/<id>`.

Nota: es **inmutable** — para actualizar subes una versión nueva (la vieja queda).

## 3. Hosting resistente fuera de EE. UU. (opción tradicional)
Si quieres un host clásico difícil de presionar, en Islandia:
- **FlokiNET** (flokinet.is) — pensado para activistas, periodistas y denunciantes.
- **1984 Hosting** (1984.hosting) — enfocado en libertades civiles.

Subes los mismos archivos; ignoran los reportes de abuso frívolos.

## 4. Mostrar los espejos en el sitio
Cuando tengas las URLs, abre `index.html`, busca `const MIRRORS` (arriba del script) y
pégalas:
```js
const MIRRORS = {
  ipfs: "https://…",      // enlace de Fleek/gateway IPFS
  arweave: "https://arweave.net/…",
  onion: ""               // opcional: dirección .onion
};
```
Aparecerán como enlaces en el pie. (O mándamelas y las pongo yo.)

---

## Qué requiere tu cuenta (no lo puedo hacer por ti)
- [ ] **Fleek** conectado al repo → espejo IPFS (gratis)
- [ ] (Opcional) **Arweave** → copia permanente (pago único en cripto)
- [ ] (Opcional) **Host en Islandia** (FlokiNET/1984) si quieres hosting resistente
- [ ] Decidir **registrador**: Cloudflare/Porkbun (fácil) o Njalla (privacidad)
