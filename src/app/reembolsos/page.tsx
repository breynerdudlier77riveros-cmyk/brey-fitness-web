import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/layout/LegalShell";
import { CONTACT_EMAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Reembolsos — Garantía de 30 días",
  description:
    "Cómo funciona la garantía de devolución de 30 días de los Sistemas Brey Fitness y cómo solicitar un reembolso.",
};

export default function ReembolsosPage() {
  return (
    <LegalShell title="Política de Reembolsos" updated="julio 2026">
      <h2>Garantía de 30 días, sin preguntas</h2>
      <p>
        Todos los Sistemas de compra única (Sistema de Hipertrofia, Sistema de
        Calistenia y Sistema Híbrido) incluyen una garantía de devolución del
        100% durante los 30 días calendario siguientes a la compra.
        No pedimos justificaciones: si el Sistema no es para ti, te devolvemos tu dinero.
      </p>

      <h2>Cómo solicitar un reembolso</h2>
      <ul>
        <li>Escribe a <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> desde el correo con el que hiciste la compra, o responde directamente al email de confirmación.</li>
        <li>Indica el Sistema comprado y la fecha de compra.</li>
        <li>Si compraste a través de Hotmart, también puedes gestionar el reembolso desde tu cuenta de Hotmart en la sección de compras.</li>
      </ul>

      <h2>Plazos</h2>
      <p>
        Procesamos las solicitudes en un máximo de 5 días hábiles. El dinero se
        devuelve por el mismo método de pago de la compra; el tiempo en que se
        refleje depende de tu banco o medio de pago (generalmente 5–10 días hábiles).
      </p>

      <h2>Membresía Sistema Elite (cuando esté disponible)</h2>
      <p>
        El Sistema Elite será una suscripción mensual sin permanencia: podrás
        cancelarla en cualquier momento y conservas el acceso hasta el final del
        período ya pagado. La garantía de 30 días aplica únicamente al primer mes
        de tu primera suscripción.
      </p>

      <h2>Dudas</h2>
      <p>
        Si tienes cualquier pregunta antes de comprar, revisa las{" "}
        <Link href="/faq">preguntas frecuentes</Link> o escríbenos. Preferimos
        resolver tus dudas antes de la compra que procesar un reembolso después.
      </p>
    </LegalShell>
  );
}
