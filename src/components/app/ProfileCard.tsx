import DashboardCard from "@/components/app/DashboardCard";
import Progress from "@/components/brand/Progress";
import Button from "@/components/brand/Button";
import { iniciales } from "@/lib/utils";
import type { Profile } from "@/lib/types";

// ── Estado del perfil (Sprint I-02) ─────────────────────────────────────────
// "% completo" es una cuenta simple sobre columnas ya cargadas (no una
// decisión de negocio ni una regla de la FSM) — mismo tipo de matemática de
// presentación que progreso/page.tsx ya hace inline con volumen semanal.
// lesiones/observaciones quedan fuera a propósito: un usuario sin lesiones
// no debería verse "incompleto" por dejarlas vacías.

const CAMPOS_COMPLETITUD = [
  "edad",
  "sexo",
  "peso_kg",
  "altura_cm",
  "objetivo",
  "nivel_experiencia",
  "lugar_entrenamiento",
  "dias_por_semana",
  "duracion_sesion_min",
  "experiencia",
] as const satisfies readonly (keyof Profile)[];

function calcularCompletitud(profile: Profile): number {
  const llenos = CAMPOS_COMPLETITUD.filter((campo) => {
    const valor = profile[campo];
    return valor !== null && valor !== "";
  }).length;
  return Math.round((llenos / CAMPOS_COMPLETITUD.length) * 100);
}

interface Props {
  profile: Profile;
}

export default function ProfileCard({ profile }: Props) {
  const nombre = profile.nombre ?? profile.email?.split("@")[0] ?? "Atleta";
  const completitud = calcularCompletitud(profile);

  return (
    <DashboardCard>
      <div className="flex items-center gap-4 mb-5">
        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-xs">{iniciales(nombre)}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-white text-sm truncate">{nombre}</p>
          {profile.email && <p className="text-white/50 text-xs truncate">{profile.email}</p>}
        </div>
      </div>

      <div className="flex items-center justify-between text-xs mb-1.5">
        <span className="text-white/50 font-semibold">Perfil completo</span>
        <span className="text-white font-bold tabular-nums">{completitud}%</span>
      </div>
      <Progress value={completitud} />

      {completitud < 100 && (
        <div className="mt-4">
          <Button href="/app/perfil" size="sm" variant="outline">
            Completar perfil
          </Button>
        </div>
      )}
    </DashboardCard>
  );
}
