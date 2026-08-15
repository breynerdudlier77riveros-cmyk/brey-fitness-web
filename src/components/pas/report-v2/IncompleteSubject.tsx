import { Card, CardContent } from "@/components/brand/Card";

// ── Sujeto normativo incompleto (Sprint PRS-2.1) ───────────────────────────
//
// El estado que aparece cuando el expediente del atleta no registra las
// coordenadas que una comparación normativa exige.
//
// EL TEXTO IMPORTA TANTO COMO EN `UnavailableNorm`, y por el mismo motivo:
//
//   «Faltan datos del atleta» habla de NUESTRO expediente.
//   «No se pudo evaluar» sonaría a que algo falló en el atleta.
//
// Y no es un error del sistema: nadie ha registrado esos datos todavía, que es
// distinto de que el sistema no funcione. Por eso no lleva tono de alarma.
//
// Enumera lo que falta por nombre. Decir solo «faltan datos» obligaría a
// adivinar cuáles, y adivinar es justamente lo que este sistema no hace.

interface Props {
  /** Coordenadas ausentes, por nombre. */
  ausentes: readonly string[];
  /** Explicación literal del servicio. No se reescribe aquí. */
  detalle: string;
}

const NOMBRE: Record<string, string> = {
  edad: "fecha de nacimiento",
  sexo: "sexo",
  pais: "población de pertenencia",
  estatura: "estatura",
};

export default function IncompleteSubject({ ausentes, detalle }: Props) {
  return (
    <Card
      className="prs2-sujeto-incompleto border-white/5 bg-white/[0.02]"
      data-sujeto="incompleto"
    >
      <CardContent className="space-y-2 p-5">
        <p className="text-[11px] uppercase tracking-wider text-white/35">
          Perfil normativo no disponible
        </p>

        <p className="text-sm text-white/70">
          El expediente no registra{" "}
          {ausentes.map((a) => NOMBRE[a] ?? a).join(", ").replace(/, ([^,]*)$/, " ni $1")}.
        </p>

        <p className="text-sm leading-relaxed text-white/45">{detalle}</p>
      </CardContent>
    </Card>
  );
}
