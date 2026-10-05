# Checklist de lanzamiento — Brey Fitness v1.0

Todo lo técnico de v1.0 está construido. Estos son los pasos que **solo el
fundador puede completar** para que el circuito de venta quede 100% activo.
En orden de importancia:

## 1. Activar el checkout Y la entrega (crítico — sin esto no hay ventas)

**El dashboard propio de entrega (v1.1) ya existe** — no hace falta subir
nada al área de miembros de Hotmart. Hotmart solo cobra; el curso se ve
dentro de esta web.

1. Crea una cuenta de productor en [Hotmart](https://hotmart.com).
2. Crea un producto por cada Sistema del lanzamiento inicial (precios
   Colombia/LatAm, decisión BREY v2):
   - **Sistema de Hipertrofia — $39 USD**
   - **Sistema de Calistenia — $49 USD**
   - **Sistema Híbrido — $59 USD**
   - Fuerza y Elite NO se crean todavía: están `disponible: false` y muestran
     lista de espera (los contactos llegan a Brevo con FUENTE `espera-<slug>`
     y atributos NOMBRE/OBJETIVO).
3. Pega el enlace de pago de cada Sistema en
   [`src/data/checkout.ts`](src/data/checkout.ts) (`checkoutUrls`) y el id de
   cada producto en el mismo archivo (`hotmartProductoIds`) — es lo que casa
   una compra real con el Sistema al que da acceso.
   - Mientras un Sistema disponible esté en `null`, su página muestra captura
     de email ("avísame cuando abra") en lugar del botón de compra. Nada
     queda roto.
4. **Aplica la migración de base de datos**:
   [`supabase/migration_cursos.sql`](supabase/migration_cursos.sql) en el SQL
   Editor de Supabase — crea las tablas de contenido, accesos y el bucket de
   materiales. Al final del archivo, marca tu propia cuenta como admin (una
   sola línea SQL con tu correo).
5. **Configura el webhook de Hotmart**: panel de Hotmart → Herramientas →
   Webhook → apunta a `https://tudominio.com/api/webhooks/hotmart`, activa
   los eventos de compra/reembolso/cancelación, y copia el Hottok de tu
   cuenta a `HOTMART_HOTTOK` en `.env.local` (y en Vercel al desplegar). Sin
   esto, una compra real no otorga acceso solo.
6. **Sube el contenido**: inicia sesión con tu cuenta admin, entra a
   `/app/admin/sistemas` y sube módulos, lecciones (enlace de YouTube/Vimeo
   sin listar) y PDFs para cada Sistema que vayas a vender. Un Sistema sin
   ningún video no tiene qué entregar — la propia página de admin lo avisa.
7. Mientras configuras Hotmart o para invitados de cortesía, puedes otorgar
   acceso a mano desde `/app/admin/sistemas/<slug>/compras`, sin esperar a
   una compra real.

## 2. Activar la captura de email

1. Crea una cuenta gratuita en [Brevo](https://www.brevo.com).
2. Genera una API key (SMTP & API → API Keys) y crea una lista de contactos.
3. Copia `.env.example` a `.env.local` y completa `BREVO_API_KEY` y
   `BREVO_LIST_ID` (también configúralos en Vercel al desplegar).
4. Prepara el email de bienvenida en Brevo: el "plan de arranque" prometido en
   el resultado del diagnóstico (una automatización por fuente: los contactos
   llegan con el atributo `FUENTE`, ej. `diagnostico-performance-gym`).

## 3. Identidad y confianza (revisar antes de publicar)

- [x] **Identidad (D4 resuelta)**: el fundador es **Breyner Riveros** —
      [`src/data/founder.ts`](src/data/founder.ts) ya tiene sus datos.
      Pendientes en ese archivo:
      - [ ] **Foto profesional**: añade la imagen en `public/historia/` y
            apunta `fotoPerfil` a ella (mientras tanto se muestra el
            monograma BR). Las fotos antiguas de la web GRESH siguen en la
            carpeta pero ya no se muestran en ninguna página.
      - [ ] **Formación**: está en su versión conservadora ("estudiante de
            último año"). Si ya estás titulado, actualízala.
      - [ ] **Certificaciones**: añádelas al array cuando existan — la
            tarjeta aparece sola.
- [ ] **Testimonios**: recolecta 3–5 testimonios REALES (con permiso) y
      añádelos en [`src/data/testimonials.ts`](src/data/testimonials.ts).
      La sección aparece sola en la home cuando el array tiene datos.
      Nunca inventes testimonios: la marca vende evidencia.
- [ ] **Email de soporte corporativo (no Gmail)**: crea el buzón en tu
      dominio (ej. `contacto@breyfitness.com`) y configura
      `NEXT_PUBLIC_CONTACT_EMAIL`. Aparece en /contacto, privacidad,
      términos y reembolsos.
- [ ] **Formulario de /contacto**: usa Brevo transaccional. Además de la
      `BREVO_API_KEY`, verifica el remitente (`CONTACT_EMAIL`) como sender
      en Brevo (Settings → Senders). Sin esto, el formulario ofrece el
      email directo como alternativa — nada queda roto.
- [x] **Redes sociales (D7)**: Instagram ya activo en
      [`src/data/social.ts`](src/data/social.ts) (@brey_trainersw y
      @breyner_sw). Cuando existan TikTok/YouTube/Facebook/LinkedIn, pega
      la URL y aparecen solas en footer y /contacto.
- [x] **Métricas del producto (D8)**: cero números inventados. La banda de
      métricas en la home está dormida hasta cruzar los umbrales reales
      (50 usuarios activos · 100 programas iniciados · 500 entrenamientos ·
      1000 horas) en [`src/data/metricas.ts`](src/data/metricas.ts).
- [ ] **Páginas legales**: lee /privacidad, /terminos y /reembolsos y ajusta
      lo que no encaje con tu operación real.

## 4. Contenido entregable (coherencia con lo prometido)

- [ ] Los programas prometen "videos de técnica" en su sección *incluye*
      ([`src/data/programs.ts`](src/data/programs.ts)). Confirma que el
      producto de Hotmart los incluye — o quita esa línea del programa que
      no los tenga todavía.
- [ ] Los 6 videos listados en `src/lib/content.ts` no tienen `youtubeId` y
      por eso no se muestran en ninguna página. Cuando subas los videos a
      YouTube, añade los IDs.

## 5. Despliegue y medición

- [ ] Configura `NEXT_PUBLIC_SITE_URL` con el dominio real (sitemap/robots/OG
      dependen de esto).
- [ ] Opcional: cuenta en [Plausible](https://plausible.io) y
      `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` para medir el funnel
      visita → quiz → programa → checkout.
- [ ] Tras el deploy, verifica: `/sitemap.xml`, `/robots.txt`, y que el botón
      de compra de cada programa abre su checkout de Hotmart.

---

**v1.1 ya está construida** (auth con Supabase, área `/app`, entrega del
curso dentro de la plataforma — sección 1 arriba). Lo que sigue pendiente de
validar con uso real: seguimiento de progreso más rico (hoy solo marca
lección vista/no vista), y una vista previa pública de vídeos gratuitos
(`Leccion.gratis` ya existe en el modelo, el visor de curso hoy no distingue
comprador de no-comprador para esas lecciones — solo entra quien ya pagó).
