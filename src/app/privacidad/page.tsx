import type { Metadata } from "next";
import LegalShell from "@/components/layout/LegalShell";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Qué datos recopila Brey Fitness, para qué se usan y cuáles son tus derechos sobre ellos.",
};

export default function PrivacidadPage() {
  return (
    <LegalShell title="Política de Privacidad" updated="julio 2026">
      <h2>Qué datos recopilamos</h2>
      <ul>
        <li><strong>Email</strong>, cuando lo dejas voluntariamente en nuestros formularios (resultado del quiz, newsletter, aviso de lanzamiento).</li>
        <li><strong>Datos de compra</strong>, gestionados por la plataforma de pago (como Hotmart) cuando adquieres un programa. No almacenamos datos de tarjetas.</li>
        <li><strong>Datos de uso anónimos</strong> (páginas visitadas, dispositivo), solo si la analítica está activa, mediante herramientas que no usan cookies de seguimiento personal.</li>
      </ul>

      <h2>Para qué los usamos</h2>
      <ul>
        <li>Enviarte el contenido que solicitaste (tu resultado del quiz, newsletter, avisos de lanzamiento).</li>
        <li>Darte acceso a los programas que compraste y soporte sobre ellos.</li>
        <li>Mejorar la plataforma a partir de datos de uso agregados.</li>
      </ul>
      <p>
        No vendemos ni alquilamos tus datos a terceros. Punto.
      </p>

      <h2>Con quién se comparten</h2>
      <ul>
        <li><strong>Brevo</strong> (proveedor de email marketing), para gestionar la lista de correo.</li>
        <li><strong>Hotmart</strong> (u otra plataforma de pago), para procesar compras y entregar el acceso.</li>
      </ul>

      <h2>Tus derechos</h2>
      <p>
        Puedes solicitar en cualquier momento el acceso, la corrección o la
        eliminación de tus datos personales, así como darte de baja de nuestros
        emails con un clic (todos incluyen enlace de baja). Escríbenos a{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> y respondemos en
        un máximo de 15 días hábiles, conforme a la normativa de protección de
        datos aplicable (incluida la Ley 1581 de 2012 de Colombia).
      </p>

      <h2>Responsable</h2>
      <p>
        {SITE_NAME} — contacto: <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
