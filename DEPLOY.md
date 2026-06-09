# Frontend CUP FICCT — Despliegue en Railway

SPA en **Vite + React**. Se construye con el `Dockerfile` incluido (build de
Vite servido por **nginx**, con fallback de rutas SPA).

## Pasos

1. **+ New → GitHub Repo** → este repositorio. Railway detecta el `Dockerfile`.
2. **Settings → Networking → Generate Domain** (URL pública del frontend).
3. **Variables** del servicio:

   ```
   VITE_API_URL=https://<backend>.up.railway.app/api/v1
   ```

   > ⚠️ `VITE_API_URL` se "hornea" en el bundle **durante el build**. Si cambias
   > la URL del backend, hay que hacer **redeploy** del frontend.

4. En el **backend**, asegúrate de que `CORS_ALLOWED_ORIGINS` y `FRONTEND_URL`
   apunten al dominio de este frontend (redeploy del backend si los cambias).

## Verificación

Abre `https://<frontend>.up.railway.app` e inicia sesión como **Administrativo**
con las credenciales del admin configuradas en el backend.

## Notas

- Los `.env` reales no se versionan; solo `.env.example` como referencia.
- Local: copia `.env.example` → `.env` y usa `npm install && npm run dev`.
