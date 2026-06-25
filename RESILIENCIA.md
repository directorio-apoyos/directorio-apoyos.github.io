# Resiliencia y seguridad del sitio

Este sitio es **estático** (solo `index.html`): no tiene servidor, base de datos ni
inicio de sesión propio. Por eso **no hay casi nada que "crackear"**. Los riesgos
reales son dos:

1. Que intenten **bajar el sitio** (reportes masivos al host o al registrador).
2. Que comprometan **tus cuentas** (GitHub, registrador, email).

Este documento cubre ambos.

---

## 1. Respaldos — nunca pierdas el contenido
- El repositorio git en tu computador (`directorio-boicot/`) ya es un **respaldo
  completo y versionado**. Mientras lo tengas, el sitio revive en cualquier lado.
- Guarda además una **copia offline** en 2 lugares (USB + disco externo):
  ```
  cd ~/proyecto
  zip -r respaldo-sitio-$(date +%Y%m%d).zip directorio-boicot -x '*/.git/*'
  ```
- Empuja siempre a remoto (`git push`) para tener copia fuera del computador.

## 2. Varios hosts listos — re-apuntar en minutos
El mismo `index.html` puede vivir en varios hosts gratis. Si bajan uno, re-apuntas
el dominio a otro. El **dominio es tu ancla**; los hosts son intercambiables.
- **Cloudflare Pages** — recomendado como principal: aplica las cabeceras de
  seguridad (`_headers`) y trae protección DDoS de Cloudflare.
- **Netlify** — respaldo; también aplica `_headers`.
- **GitHub Pages** — respaldo (no aplica cabeceras de seguridad).
- **Espejo IPFS** (vía Fleek o Pinata) — descentralizado, **muy difícil de bajar**.
  Ideal como espejo permanente.

Manténlo publicado en **al menos 2 a la vez**.

## 3. Si bajan el sitio — playbook
1. Tranquilo: el contenido está en tu respaldo.
2. Entra al registrador y cambia el DNS para apuntar `apoyaronaabelardo.com` al
   host de respaldo.
3. Si hace falta, vuelve a publicar desde el respaldo en un host nuevo.
4. Avisa por tus canales que el sitio sigue vivo en el mismo dominio.

## 4. Endurece tus cuentas — lo más importante contra "crackeo"
- **2FA en TODO:** GitHub, registrador y el **email de recuperación**. Usa app de
  autenticación o, mejor, **llave física** (YubiKey).
- **Bloqueo del dominio:** activa "registrar lock" (clientTransferProhibited) y
  **auto-renovación** (que no expire y te lo quiten).
- **Contraseñas únicas y largas** con un **gestor de contraseñas**. Nunca reutilices.
- El **email** es la llave maestra (resetea todo lo demás): protégelo más que nada.

## 5. DDoS / inundaciones de tráfico
- Un sitio estático tras una **CDN** (Cloudflare, o el CDN propio de Pages) aguanta
  picos enormes sin caerse.
- **Cloudflare al frente absorbe** ataques de denegación de servicio. Es la mejor
  defensa y es gratis.

## 6. Si vas en modo seudónimo
- Cuenta de GitHub, email y registrador **separados** de tu identidad conocida.
- Administra solo por **VPN/Tor**.
- **Nunca** promociones el sitio desde cuentas ligadas a ti.
