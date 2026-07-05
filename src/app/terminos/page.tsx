import type { Metadata } from "next";
import Link from "next/link";
import LegalShell from "@/components/layout/LegalShell";
import { CONTACT_EMAIL, SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description:
    "Términos y condiciones de uso de la plataforma y los programas de entrenamiento de Brey Fitness.",
};

export default function TerminosPage() {
  return (
    <LegalShell title="Términos y Condiciones" updated="julio 2026">
      <h2>1. El servicio</h2>
      <p>
        {SITE_NAME} ofrece programas de entrenamiento digitales, contenido
        educativo y herramientas de cálculo relacionadas con el ejercicio físico
        y la nutrición. Al comprar un programa o usar la plataforma aceptas estos términos.
      </p>

      <h2>2. Aviso de salud — léelo</h2>
      <p>
        Nuestros programas son contenido educativo sobre entrenamiento; no son
        asesoría médica ni sustituyen la consulta con profesionales de la salud.
        Antes de comenzar cualquier programa de ejercicio, consulta a tu médico —
        especialmente si tienes lesiones, condiciones cardiovasculares, o llevas
        largo tiempo sin actividad física. El entrenamiento físico implica riesgo
        de lesión; al usar nuestros programas asumes ese riesgo y aceptas entrenar
        dentro de tus capacidades.
      </p>

      <h2>3. Licencia de uso</h2>
      <p>
        Al comprar un programa recibes una licencia personal, intransferible y no
        exclusiva para usar su contenido. No puedes revender, compartir, publicar
        ni redistribuir los programas, videos o materiales, total o parcialmente.
      </p>

      <h2>4. Propiedad intelectual</h2>
      <p>
        Todo el contenido de la plataforma — textos, programas, marca, The Brey
        Performance System (BPS), diseños y materiales — es propiedad de{" "}
        {SITE_NAME} y está protegido por las leyes de propiedad intelectual.
      </p>

      <h2>5. Pagos y reembolsos</h2>
      <p>
        Los pagos se procesan a través de plataformas de pago de terceros (como
        Hotmart). Los reembolsos se rigen por nuestra{" "}
        <Link href="/reembolsos">política de reembolsos</Link> (garantía de 30 días).
      </p>

      <h2>6. Resultados</h2>
      <p>
        Los resultados del entrenamiento dependen de factores individuales:
        consistencia, nutrición, descanso, genética y punto de partida. No
        garantizamos resultados específicos en plazos específicos.
      </p>

      <h2>7. Modificaciones</h2>
      <p>
        Podemos actualizar estos términos y el contenido de la plataforma. Los
        cambios relevantes se comunicarán en esta página con su fecha de actualización.
      </p>

      <h2>8. Contacto</h2>
      <p>
        Para cualquier consulta sobre estos términos:{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>
    </LegalShell>
  );
}
