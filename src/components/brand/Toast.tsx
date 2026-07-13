import { Toaster as ShadcnToaster } from "@/components/ui/sonner";
import { toast } from "sonner";

// ── Toast del sistema (sobre sonner — la solución de shadcn desde que
// deprecó su Toast/Toaster/useToast original basado en Radix) ─────────────
// Sin call site hoy — listo para el Dashboard (confirmaciones de guardado,
// errores de red, etc.). La CLI lo confirma: "toast" ya no existe como
// item independiente en este registro, sonner es su reemplazo oficial.
//
// El primitivo generado (ui/sonner.tsx) usa next-themes para detectar el
// tema claro/oscuro del sistema operativo del visitante — este sitio no
// tiene ese concepto: es oscuro siempre, sin variante .dark ni selector
// de tema en ningún lugar. Se fuerza theme="dark" explícito para que
// sonner nunca intente adivinar el tema del SO — sin esto, un visitante
// con su sistema en modo claro vería las notificaciones con los colores
// internos claros de sonner, rompiendo la identidad del sitio. No fue
// necesario tocar ui/sonner.tsx: como ese archivo hace spread de sus
// props DESPUÉS de fijar theme, pasar theme="dark" desde aquí gana solo
// con las props, sin editar el generado.
//
// Colores ya correctos sin más ajustes: --normal-bg/--normal-text/
// --normal-border apuntan a --popover/--popover-foreground/--border,
// ya con valores de marca desde la instalación base de shadcn.
//
// Toaster se monta una vez en app/layout.tsx (como TooltipProvider).
// toast() se reexporta para que las páginas nunca importen "sonner"
// directo.

export function Toaster() {
  return <ShadcnToaster theme="dark" position="bottom-right" />;
}

export { toast };
