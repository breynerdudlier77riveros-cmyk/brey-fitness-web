import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { Bell } from "@/components/brand/icons";

// ── Notificaciones (Sprint I-02) ────────────────────────────────────────────
// No existe todavía ninguna tabla/sistema de notificaciones — este
// componente es un renderer real (no un "Próximamente"), listo para cuando
// exista una fuente, pero hoy siempre recibe [] y muestra el estado vacío
// honesto (P16): nunca datos inventados.

export interface Notificacion {
  id: string;
  titulo: string;
  fecha: string;
}

interface Props {
  notificaciones?: Notificacion[];
}

export default function NotificationCard({ notificaciones = [] }: Props) {
  return (
    <DashboardCard title="Notificaciones">
      {notificaciones.length === 0 ? (
        <EmptyState icon={Bell} title="No tienes notificaciones nuevas" />
      ) : (
        <div className="divide-y divide-white/[0.06] -my-2">
          {notificaciones.map((n) => (
            <div key={n.id} className="py-2.5 first:pt-0 last:pb-0">
              <p className="text-white text-xs font-semibold">{n.titulo}</p>
              <p className="text-white/40 text-[11px] mt-0.5">{n.fecha}</p>
            </div>
          ))}
        </div>
      )}
    </DashboardCard>
  );
}
