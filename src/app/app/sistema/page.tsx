import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/repository";
import { getSistemaBySlug } from "@/data/sistemas";
import { comprasActivasDelUsuario, vincularComprasDelUsuario } from "@/lib/cursos/repository";
import { createAdminClient } from "@/lib/supabase/admin";
import PageHeader from "@/components/app/PageHeader";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import Button from "@/components/brand/Button";
import { Flag, Check, Play } from "@/components/brand/icons";

export const metadata: Metadata = { title: "Mi Sistema" };

// profiles.sistema_actual guarda un slug — el objeto rico (fases, niveles,
// ecosistema, colores) vive en src/data/sistemas.ts, no en la tabla
// liviana `systems` de Supabase (ver supabase/schema.sql: esa tabla es
// catálogo, "no reemplazo del archivo estático"). Mismo patrón que ya usa
// /sistemas/[slug]/page.tsx.
export default async function MiSistemaPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);

  // La primera vez que este usuario inicia sesión después de comprar, su
  // compra sigue con `usuario_id` en null (Hotmart la creó por email, antes
  // de que hubiera sesión). Se enlaza aquí, de paso, con Service Role —
  // ninguna política de RLS deja hacerlo con el cliente normal (Sprint
  // CURSO-1, ver migration_cursos.sql).
  if (user.email) {
    await vincularComprasDelUsuario(createAdminClient(), user.id, user.email);
  }
  const compras = await comprasActivasDelUsuario(supabase, user.id);

  const sistema = profile?.sistema_actual ? getSistemaBySlug(profile.sistema_actual) : undefined;

  return (
    <div>
      <PageHeader title="Mi Sistema" description="El Sistema BPS que estás entrenando actualmente." />

      {compras.length > 0 ? (
        <div className="space-y-4">
          {compras.map((compra) => {
            const s = getSistemaBySlug(compra.sistemaSlug);
            if (!s) return null;
            return (
              <DashboardCard key={compra.id}>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 ${s.color.badge}`}>
                      <s.icon className="w-5 h-5" strokeWidth={1.75} />
                    </div>
                    <div>
                      <p className="font-black text-white">{s.nombre}</p>
                      <p className="text-white/45 text-[12px]">Tienes acceso completo al curso</p>
                    </div>
                  </div>
                  <Button href={`/app/sistema/${s.slug}`} size="sm">
                    <Play className="w-3.5 h-3.5" />
                    Continuar
                  </Button>
                </div>
              </DashboardCard>
            );
          })}
        </div>
      ) : sistema ? (
        <div className="space-y-6">
          <div className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br ${sistema.color.gradient} p-6 md:p-8`}>
            <div className="flex items-start gap-4">
              <div className={`w-12 h-12 rounded-2xl border flex items-center justify-center flex-shrink-0 ${sistema.color.badge}`}>
                <sistema.icon className="w-6 h-6" strokeWidth={1.75} />
              </div>
              <div className="min-w-0">
                <p className="font-black text-white text-xl">{sistema.nombre}</p>
                <p className="text-white/60 text-sm mt-1">{sistema.tagline}</p>
              </div>
            </div>
            {profile?.nivel_actual && (
              <div className="flex items-center gap-2 mt-6">
                <span className={`text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border ${sistema.color.badge}`}>
                  {profile.nivel_actual}
                </span>
              </div>
            )}
          </div>

          <DashboardCard>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-4">Incluye</p>
            <ul className="space-y-3">
              {sistema.incluye.map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 ${sistema.color.accent}`} strokeWidth={2.5} />
                  <span className="text-white/70 text-sm">{item}</span>
                </li>
              ))}
            </ul>
          </DashboardCard>

          <Button href={`/sistemas/${sistema.slug}`} variant="outline" size="sm">
            Ver detalle del Sistema
          </Button>
        </div>
      ) : (
        <DashboardCard>
          <EmptyState
            icon={Flag}
            title="No tienes un sistema asignado"
            description="El Diagnóstico BPS analiza tu nivel y objetivo para recomendarte el Sistema correcto — sin adivinar."
            actionLabel="Realizar Diagnóstico BPS"
            actionHref="/diagnostico"
          />
        </DashboardCard>
      )}
    </div>
  );
}
