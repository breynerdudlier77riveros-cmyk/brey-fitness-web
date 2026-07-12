# Checklist de lanzamiento — Brey Fitness v1.0

Todo lo técnico de v1.0 está construido. Estos son los pasos que **solo el
fundador puede completar** para que el circuito de venta quede 100% activo.
En orden de importancia:

## 1. Activar el checkout (crítico — sin esto no hay ventas)

1. Crea una cuenta de productor en [Hotmart](https://hotmart.com).
2. Crea un producto por cada programa (Start $47, Gym $97, Calisthenics $97,
   Hybrid $127, Elite $197/mes como suscripción).
3. Sube a cada producto de Hotmart el contenido entregable (PDF/videos/área de
   miembros de Hotmart — esta es la "entrega v0" hasta que exista el dashboard
   propio en v1.1).
4. Pega el enlace de pago de cada producto en
   [`src/data/checkout.ts`](src/data/checkout.ts).
   - Mientras un programa esté en `null`, su página muestra captura de email
     ("avísame cuando abra") en lugar del botón de compra. Nada queda roto.

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

**Siguiente fase (v1.1 — requiere validación):** auth con Supabase, área
`/app` con "Hoy entrenas" y la entrega del programa dentro de la plataforma.
