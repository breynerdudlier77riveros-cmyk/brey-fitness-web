import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/repository";
import { getSistemas } from "@/lib/systems/repository";
import { obtenerContenido } from "@/lib/cursos/repository";
import { totalLecciones, tieneContenidoVendible } from "@/lib/cursos/contenido";
import { getCheckoutUrl } from "@/data/checkout";
import PageHeader from "@/components/app/PageHeader";
import DashboardCard from "@/components/app/DashboardCard";
import Button from "@/components/brand/Button";
import Badge from "@/components/brand/Badge";

export const metadata: Metadata = { title: "Administrar cursos" };

// ── Panel de admin: contenido de los Sistemas vendibles (Sprint CURSO-1) ───
//
// Un Sistema (`public.systems`) ya vende — precio, slug, disponibilidad.
// Esto es lo que le faltaba: dónde ponerle módulos, lecciones, video y
// materiales. Cada tarjeta enlaza al editor de SU Sistema.

export default async function AdminSistemasPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);
  if (!profile?.es_admin) redirect("/app");

  const sistemas = await getSistemas(supabase);

  const filas = await Promise.all(
    sistemas.map(async (s) => {
      const contenido = await obtenerContenido(supabase, s.slug);
      return {
        sistema: s,
        lecciones: totalLecciones(contenido),
        vendible: tieneContenidoVendible(contenido),
        checkoutListo: getCheckoutUrl(s.slug) !== null,
      };
    }),
  );

  return (
    <div>
      <PageHeader
        title="Administrar cursos"
        description="El contenido (módulos, lecciones, video, materiales) de cada Sistema vendible."
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {filas.map(({ sistema, lecciones, vendible, checkoutListo }) => (
          <DashboardCard key={sistema.slug}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-black text-white text-lg">{sistema.nombre}</p>
                <p className="text-white/50 text-sm mt-1">{sistema.tagline ?? sistema.objetivo}</p>
              </div>
              <Badge variant={sistema.disponible ? "success" : "neutral"}>
                {sistema.disponible ? "En venta" : "No disponible"}
              </Badge>
            </div>

            <div className="mt-4 flex flex-wrap gap-2 text-[11px]">
              <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-white/60">
                {lecciones} {lecciones === 1 ? "lección" : "lecciones"}
              </span>
              {!vendible ? (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-300">
                  Sin ningún video todavía
                </span>
              ) : null}
              {!checkoutListo ? (
                <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-amber-300">
                  Sin enlace de pago de Hotmart
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex gap-2">
              <Button href={`/app/admin/sistemas/${sistema.slug}`} size="sm">
                Editar contenido
              </Button>
              <Button href={`/app/admin/sistemas/${sistema.slug}/compras`} variant="outline" size="sm">
                Accesos otorgados
              </Button>
            </div>
          </DashboardCard>
        ))}
      </div>

      <DashboardCard className="mt-6">
        <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-2">
          Para que un Sistema sea vendible de verdad
        </p>
        <ol className="space-y-1.5 text-sm text-white/60 list-decimal list-inside">
          <li>Crea el producto en tu panel de Hotmart y copia su enlace de pago.</li>
          <li>
            Pégalo en <code className="text-white/80">src/data/checkout.ts</code> (
            <code className="text-white/80">checkoutUrls</code>) y el id del producto en{" "}
            <code className="text-white/80">hotmartProductoIds</code>, en el mismo archivo.
          </li>
          <li>
            Activa el webhook en Hotmart apuntando a{" "}
            <code className="text-white/80">/api/webhooks/hotmart</code> y configura{" "}
            <code className="text-white/80">HOTMART_HOTTOK</code> con el token de tu cuenta.
          </li>
          <li>Sube al menos un video en «Editar contenido» — un Sistema sin video no tiene qué vender.</li>
        </ol>
      </DashboardCard>
    </div>
  );
}
