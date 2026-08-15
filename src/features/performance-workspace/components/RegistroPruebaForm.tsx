"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { accionRegistrarPrueba } from "../actions/evaluaciones";
import { PRUEBAS, pruebaRegistrable } from "../schemas/catalogo";
// Del módulo del mapeo, no del barril: el barril arrastra el adaptador y con
// él todo el motor NIE, que este componente de cliente no necesita para leer
// una tabla declarativa.
import { mapeoDe } from "@/lib/pas/normativo/mapeo";
import type { ValorRegistro } from "@/lib/pas";

// ── Registro de una prueba (Sprint PAS-7.0) ────────────────────────────────
// Solo pruebas del catálogo del PAS: el desplegable se puebla de `PRUEBAS` y
// el servidor vuelve a comprobarlo. Aquí no se interpreta nada — se registra.
//
// La forma del valor la impone la naturaleza que declara la prueba, no el
// profesional: eso evita registrar un texto donde el catálogo espera un número.
//
// ── CONDICIONES DE MÉTODO (PRS-2.3) ────────────────────────────────────────
// Cuando la prueba tiene mapeo normativo, el formulario pide además CÓMO se
// midió: instrumento, consolidación, posición y lado. Sin eso el NIE no puede
// situar el valor en ninguna norma, porque dos dinamómetros distintos están en
// EQ-3 y el mejor intento no es la media de intentos.
//
// Los campos y su vocabulario salen del PROPIO MAPEO, no de una lista tecleada
// aquí. Si el mapeo añadiera un instrumento, el desplegable lo mostraría solo;
// si esta pantalla tuviera su propia copia, las dos se desincronizarían y una
// condición declarada dejaría de ser reconocida sin que nadie lo notara.
//
// Todas son opcionales: una medición sin método declarado se registra igual, y
// el informe normativo dirá que no puede compararla. Es preferible a inventar
// un instrumento por defecto.

/** Los cuatro ejes del método, en el orden en que se declaran al medir. */
const CAMPOS_METODO = [
  { campo: "instrumento", etiqueta: "Dinamómetro" },
  { campo: "definicionOperacional", etiqueta: "Consolidación del resultado" },
  { campo: "posicion", etiqueta: "Posición" },
  { campo: "lado", etiqueta: "Mano" },
] as const;

/**
 * Texto legible de cada identificador del mapeo.
 *
 * Solo es presentación: el valor que viaja es siempre el identificador, que es
 * lo que el NIE reconoce. Un identificador sin etiqueta se muestra tal cual —
 * preferible a ocultarlo, que lo haría inseleccionable.
 */
const ETIQUETA_OPCION: Record<string, string> = {
  "takei-tkk-5101": "Takei TKK 5101",
  "takei-t18": "Takei T-18 SMEDLEY III",
  "camry-digital": "Camry digital",
  "jamar-j00105": "Jamar J00105",
  "jamar-pc-5030-j1": "Jamar PC-5030 J1",
  "smedley-s": "Smedley S",
  media_ambas_manos: "Media de ambas manos",
  maximo_ambas_manos: "Máximo de ambas manos",
  mejor_mano_derecha: "Mejor intento, mano derecha",
  mejor_mano_izquierda: "Mejor intento, mano izquierda",
  mejor_mano_dominante: "Mejor intento, mano dominante",
  mejor_mano_no_dominante: "Mejor intento, mano no dominante",
  media_2a_y_3a_mano_dominante: "Media de 2.ª y 3.ª medición, mano dominante",
  bipedestacion: "De pie",
  sedestacion: "Sentado",
  derecha: "Derecha",
  izquierda: "Izquierda",
  dominante: "Dominante",
  no_dominante: "No dominante",
  ambas: "Ambas",
};

const MENSAJE: Record<string, string> = {
  PRUEBA_NO_CATALOGADA: "Esa prueba no pertenece al catálogo.",
  VALOR_INCOMPATIBLE: "El valor no corresponde al tipo que declara la prueba.",
  VALOR_NO_FINITO: "El valor numérico no es válido.",
  VALOR_VACIO: "El valor no puede quedar vacío.",
  PATRON_REQUERIDO: "Esta prueba exige indicar el patrón evaluado.",
  FECHA_INVALIDA: "La fecha no es válida.",
  FECHA_FUTURA: "La fecha no puede ser posterior a hoy.",
  EVALUACION_CERRADA: "La evaluación ya no admite registros.",
};

interface Props {
  evaluacionId: string;
  fechaEvaluacion: string;
}

export default function RegistroPruebaForm({ evaluacionId, fechaEvaluacion }: Props) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pruebaId, setPruebaId] = useState(PRUEBAS[0].id);

  const prueba = pruebaRegistrable(pruebaId);
  const mapeo = mapeoDe(pruebaId);

  function enviar(datos: FormData) {
    const bruto = String(datos.get("valor") ?? "");
    const naturaleza = prueba?.naturaleza ?? "continuo";

    let valor: ValorRegistro;
    if (naturaleza === "ordinal") {
      valor = { tipo: "ordinal", valor: Number(bruto), escala: Number(datos.get("escala") ?? 3) };
    } else if (naturaleza === "binario") {
      valor = { tipo: "binario", valor: bruto === "true" };
    } else if (naturaleza === "categorico") {
      valor = { tipo: "categorico", valor: bruto };
    } else {
      valor = { tipo: "continuo", valor: Number(bruto), unidad: prueba?.unidad ?? "" };
    }

    // Solo las condiciones que el profesional haya declarado. Una clave vacía
    // NO se registra: `undefined` en `condiciones` significa «no consta», y el
    // NIE responde NO_DETERMINABLE, que es la verdad. Guardar cadena vacía
    // haría indistinguible «no lo declaró» de «lo declaró vacío».
    const condiciones: Record<string, string> = {};
    if (mapeo) {
      for (const clave of Object.values(mapeo.claves)) {
        const valorCond = String(datos.get(clave) ?? "");
        if (valorCond) condiciones[clave] = valorCond;
      }
    }

    iniciar(async () => {
      const resultado = await accionRegistrarPrueba({
        evaluacionId,
        pruebaId,
        fecha: String(datos.get("fecha") ?? fechaEvaluacion),
        valor,
        patron: String(datos.get("patron") ?? "") || undefined,
        condiciones: Object.keys(condiciones).length > 0 ? condiciones : undefined,
      });

      if (!resultado.ok) {
        setError(MENSAJE[resultado.error] ?? "No se pudo registrar.");
        return;
      }

      setError(null);
      router.refresh();
    });
  }

  return (
    <form action={enviar} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-xs font-semibold text-white/60">Prueba</span>
          {/* Fondo OPACO, no `bg-white/[0.03]`: el desplegable de un select
              nativo lo dibuja el navegador y no puede componer una capa
              translúcida, así que caía al blanco del sistema mientras el texto
              heredaba el blanco de la página. `color-scheme: dark` hace que el
              propio sistema operativo lo pinte en oscuro. */}
          <select
            name="pruebaId"
            value={pruebaId}
            onChange={(e) => setPruebaId(e.target.value)}
            className="h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500/40 [color-scheme:dark]"
          >
            {PRUEBAS.map((p) => (
              <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                {p.id} · {p.nombre}
              </option>
            ))}
          </select>
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">
            Valor {prueba?.unidad ? `(${prueba.unidad})` : ""}
          </span>
          <Input
            name="valor"
            type={prueba?.naturaleza === "categorico" ? "text" : "number"}
            step="any"
            required
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Fecha</span>
          <Input type="date" name="fecha" defaultValue={fechaEvaluacion} required />
        </label>

        {prueba?.requierePatron ? (
          <label className="block sm:col-span-2">
            <span className="mb-1 block text-xs font-semibold text-white/60">
              Patrón evaluado
            </span>
            <Input name="patron" required maxLength={80} />
          </label>
        ) : null}
      </div>

      {/* ── Método de medición ─────────────────────────────────────────────
          Solo aparece si la prueba tiene mapeo normativo. Los cuatro campos y
          su vocabulario los declara el mapeo, no esta pantalla. */}
      {mapeo ? (
        <fieldset className="space-y-3 border-t border-white/[0.06] pt-5">
          <legend className="text-xs font-semibold text-white/60">
            Método de medición
            <span className="ml-2 font-normal text-white/35">
              Necesario para comparar contra una norma. Opcional.
            </span>
          </legend>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {CAMPOS_METODO.map(({ campo, etiqueta }) => {
              const clave = mapeo.claves[campo];
              const opciones = Object.keys(mapeo.vocabulario[campo]);
              return (
                <label key={clave} className="block">
                  <span className="mb-1 block text-xs font-semibold text-white/60">{etiqueta}</span>
                  <select
                    name={clave}
                    defaultValue=""
                    className="h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500/40 [color-scheme:dark]"
                  >
                    <option value="" className="bg-slate-900 text-white">
                      Sin declarar
                    </option>
                    {opciones.map((o) => (
                      <option key={o} value={o} className="bg-slate-900 text-white">
                        {ETIQUETA_OPCION[o] ?? o}
                      </option>
                    ))}
                  </select>
                </label>
              );
            })}
          </div>

          <p className="text-[11px] leading-relaxed text-white/35">
            Dos dinamómetros distintos no son intercambiables, y el mejor intento no equivale a la
            media de intentos. Sin estos datos la medición se registra igual, pero el informe no
            podrá situarla en ninguna norma.
          </p>
        </fieldset>
      ) : null}

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pendiente}>
        {pendiente ? "Registrando…" : "Registrar prueba"}
      </Button>
    </form>
  );
}
