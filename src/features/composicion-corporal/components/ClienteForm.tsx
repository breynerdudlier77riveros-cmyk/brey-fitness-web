"use client";

import { useState } from "react";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { toast } from "@/components/brand/Toast";
import { Spinner } from "@/components/brand/icons";
import { crearCliente, editarCliente } from "@/lib/bcs/actions";
import type { Cliente } from "@/lib/bcs/tipos";
import { CATALOGO } from "@/lib/bcs/reporte";
import { CAPTURABLES, type RangosDispositivo } from "@/lib/bcs/rangos-dispositivo";

// ── Formulario de alta/edición de Cliente — UC-01/UC-02 ────────────────────
// Mismo patrón de estado que PerfilForm.tsx (useState por campo + enum de
// estado), pero llamando directamente a los Server Actions ya construidos
// (patrón BE-01, el mismo que ya sigue src/lib/bcs/actions.ts) en vez de
// hablar directo con el repositorio — es la vía correcta para datos de
// Entrenador→Cliente, distinta de la excepción histórica de PerfilForm.
//
// ── SEXO Y FECHA DE NACIMIENTO ────────────────────────────────────────────
//
// Los dos son OPCIONALES y los dos dicen para qué sirven, porque sin esa
// frase parecen burocracia. No lo son: de las cuatro variables que el BCS
// puede clasificar, dos dependen de ellos (% grasa y WHR, BCS Handbook 06), y
// el % de grasa es el número por el que un cliente abre el informe.
//
// Se piden, no se deducen. El sexo no se infiere del nombre y la edad no se
// infiere de nada: el informe prefiere decir «falta este dato» a clasificar
// con una identidad inventada.
//
// ── LOS RANGOS DE LA HOJA (Sprint BCS-13) ─────────────────────────────────
//
// Catorce pares de números que se copian a mano UNA vez. Es tedioso, y la
// alternativa era peor.
//
// Los rangos que imprime un analizador comercial no son una tabla que pueda
// cargarse: se comprobó contra una hoja real y son una FÓRMULA sobre la talla
// y el sexo del cliente, así que cada persona tiene los suyos. La fórmula se
// dedujo, pero InBody no la publica y solo pudo verificarse contra una hoja de
// varón; aplicar sus constantes a una clienta daría catorce rangos erróneos
// sin que nada fallara. Copiar de la hoja es exacto para los dos sexos y se
// puede comprobar contra el papel.
//
// Va plegado y en blanco: quien no tenga la hoja delante no ve catorce campos
// vacíos reprochándole algo. Sin rangos el informe funciona igual — lo que no
// hace es dibujar la barra.

const MENSAJE: Record<string, string> = {
  NOMBRE_VACIO: "El nombre no puede estar vacío.",
  FECHA_NACIMIENTO_INVALIDA: "La fecha de nacimiento no es válida.",
  FECHA_NACIMIENTO_FUTURA: "La fecha de nacimiento no puede ser posterior a hoy.",
  NO_AUTENTICADO: "La sesión ha caducado.",
  RANGO_INVERTIDO: "En algún rango el máximo no es mayor que el mínimo. Revísalo contra la hoja.",
  RANGO_NEGATIVO: "Ningún rango puede tener un número negativo.",
  RANGO_INCOMPLETO: "Algún rango tiene un número que no se pudo leer.",
  RANGO_VARIABLE_DESCONOCIDA: "Se envió un rango de una variable que no se captura.",
};

/** Los dos extremos, tal como se teclean: cadenas hasta que se validan. */
type ParTecleado = { min: string; max: string };

const VACIO: ParTecleado = { min: "", max: "" };

/** Lo guardado, de vuelta a la forma que teclea el formulario. */
function aFormulario(rangos: RangosDispositivo | null): Record<string, ParTecleado> {
  const salida: Record<string, ParTecleado> = {};
  for (const { id } of CAPTURABLES) {
    const r = rangos?.[id];
    salida[id] = r ? { min: String(r.min), max: String(r.max) } : VACIO;
  }
  return salida;
}

/**
 * Lo tecleado, de vuelta a rangos. Un par a medias es un error, no un vacío.
 *
 * La coma decimal se acepta: es como está impreso en una hoja en español, y
 * rechazar «18,5» por teclearlo como se lee sería una trampa.
 */
function aRangos(
  campos: Record<string, ParTecleado>,
): { rangos: RangosDispositivo; error: null } | { rangos: null; error: string } {
  const rangos: RangosDispositivo = {};
  for (const { id, enLaHoja } of CAPTURABLES) {
    const { min, max } = campos[id] ?? VACIO;
    const vacioMin = min.trim() === "";
    const vacioMax = max.trim() === "";
    if (vacioMin && vacioMax) continue;
    if (vacioMin || vacioMax) {
      return { rangos: null, error: `Falta un extremo del rango de «${enLaHoja}».` };
    }
    const n1 = Number(min.replace(",", "."));
    const n2 = Number(max.replace(",", "."));
    if (!Number.isFinite(n1) || !Number.isFinite(n2)) {
      return { rangos: null, error: `El rango de «${enLaHoja}» no son números.` };
    }
    if (!(n2 > n1)) {
      return {
        rangos: null,
        error: `En «${enLaHoja}» el máximo no es mayor que el mínimo.`,
      };
    }
    rangos[id] = { min: n1, max: n2 };
  }
  return { rangos, error: null };
}

interface Props {
  cliente?: Cliente;
  onCancel: () => void;
  onSaved: (cliente: Cliente) => void;
}

type Estado = "idle" | "guardando" | "error";

export default function ClienteForm({ cliente, onCancel, onSaved }: Props) {
  const [nombre, setNombre] = useState(cliente?.nombre ?? "");
  const [sexo, setSexo] = useState<string>(cliente?.sexo ?? "");
  const [nacimiento, setNacimiento] = useState(cliente?.fecha_nacimiento ?? "");
  const [dispositivo, setDispositivo] = useState(cliente?.dispositivo_referencia ?? "");
  const [rangos, setRangos] = useState<Record<string, ParTecleado>>(() =>
    aFormulario(cliente?.rangos_dispositivo ?? null),
  );
  const [estado, setEstado] = useState<Estado>("idle");
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "guardando") return;
    if (!nombre.trim()) {
      setError("El nombre no puede estar vacío.");
      return;
    }

    const convertidos = aRangos(rangos);
    if (convertidos.error !== null) {
      setError(convertidos.error);
      return;
    }

    setEstado("guardando");
    setError(null);

    // La cadena vacía es «no consta», no un valor: se envía como null para que
    // borrar el campo en la pantalla lo borre también en la fila.
    const identidad = {
      sexo: (sexo === "M" || sexo === "F" ? sexo : null) as Cliente["sexo"],
      fechaNacimiento: nacimiento.trim() === "" ? null : nacimiento,
    };

    // Un objeto sin claves NO es «bórralos»: se manda `null` explícito para
    // que vaciar los catorce campos vacíe también la columna.
    const referencia = {
      rangosDispositivo: Object.keys(convertidos.rangos).length > 0 ? convertidos.rangos : null,
      dispositivoReferencia: dispositivo.trim() === "" ? null : dispositivo.trim(),
    };

    const resultado = cliente
      ? await editarCliente(cliente.id, nombre, identidad, referencia)
      : await crearCliente(nombre, identidad, referencia);

    if (!resultado.ok) {
      setEstado("error");
      const texto = MENSAJE[resultado.error] ?? "No se pudo guardar el cliente. Inténtalo de nuevo.";
      setError(texto);
      toast.error(texto);
      return;
    }

    setEstado("idle");
    toast.success(cliente ? "Cliente actualizado." : "Cliente creado.");
    onSaved(resultado.data);
  }

  const guardando = estado === "guardando";
  const capturados = CAPTURABLES.filter(
    ({ id }) => (rangos[id]?.min ?? "") !== "" && (rangos[id]?.max ?? "") !== "",
  ).length;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre-cliente" className="block text-xs font-semibold text-white/60 mb-1.5">
          Nombre del cliente
        </label>
        <Input
          id="nombre-cliente"
          required
          autoFocus
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={guardando}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="sexo-cliente" className="block text-xs font-semibold text-white/60 mb-1.5">
            Sexo
            <span className="ml-2 font-normal text-white/35">Opcional</span>
          </label>
          {/* Fondo opaco y `color-scheme: dark`: un select translúcido deja el
              desplegable nativo en blanco sobre blanco. */}
          <select
            id="sexo-cliente"
            value={sexo}
            onChange={(e) => setSexo(e.target.value)}
            disabled={guardando}
            className="h-10 w-full rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none focus:border-orange-500/40 [color-scheme:dark]"
          >
            <option value="" className="bg-slate-900 text-white">
              No consta
            </option>
            <option value="M" className="bg-slate-900 text-white">
              Masculino
            </option>
            <option value="F" className="bg-slate-900 text-white">
              Femenino
            </option>
          </select>
        </div>

        <div>
          <label
            htmlFor="nacimiento-cliente"
            className="block text-xs font-semibold text-white/60 mb-1.5"
          >
            Fecha de nacimiento
            <span className="ml-2 font-normal text-white/35">Opcional</span>
          </label>
          <Input
            id="nacimiento-cliente"
            type="date"
            value={nacimiento}
            onChange={(e) => setNacimiento(e.target.value)}
            disabled={guardando}
          />
        </div>
      </div>

      <p className="text-[11px] leading-relaxed text-white/35">
        Los dos son opcionales, pero sin ellos el informe no puede situar el porcentaje de grasa
        corporal ni la relación cintura-cadera: sus rangos de referencia se publican por sexo y por
        edad. Se guarda la fecha de nacimiento y no la edad, para que cada medición se interprete
        con la edad que el cliente tenía ese día.
      </p>

      <details className="rounded-lg border border-white/10 bg-white/[0.02]">
        <summary className="cursor-pointer list-none px-3 py-2.5 text-xs font-semibold text-white/60 marker:content-none">
          Rangos de su hoja de resultados
          <span className="ml-2 font-normal text-white/35">
            Opcional · {capturados} de {CAPTURABLES.length}
          </span>
        </summary>

        <div className="space-y-4 border-t border-white/10 px-3 py-3">
          <p className="text-[11px] leading-relaxed text-white/40">
            Copia aquí los dos números que el analizador imprime al lado de cada variable. Con
            ellos, el informe dibuja en cada una una barra con su posición dentro de ese intervalo.
            Solo hay que hacerlo una vez: el aparato los calcula desde la estatura y el sexo, así
            que no cambian entre mediciones. Deja en blanco lo que no tengas.
          </p>

          <div>
            <label
              htmlFor="dispositivo-cliente"
              className="mb-1.5 block text-xs font-semibold text-white/60"
            >
              Modelo del analizador
            </label>
            <Input
              id="dispositivo-cliente"
              value={dispositivo}
              placeholder="InBody 770"
              onChange={(e) => setDispositivo(e.target.value)}
              disabled={guardando}
            />
            <p className="mt-1 text-[11px] leading-relaxed text-white/35">
              Se nombra debajo de cada barra: la escala de un fabricante no se compara con la de
              otro.
            </p>
          </div>

          <div className="space-y-2">
            {CAPTURABLES.map(({ id, enLaHoja }) => (
              <div key={id} className="grid grid-cols-[1fr_auto_auto] items-center gap-2">
                <label htmlFor={`rango-min-${id}`} className="min-w-0 text-[11px] text-white/55">
                  <span className="block truncate">{enLaHoja}</span>
                  <span className="text-white/30">{CATALOGO[id].unidad}</span>
                </label>
                <Input
                  id={`rango-min-${id}`}
                  inputMode="decimal"
                  aria-label={`Mínimo de ${enLaHoja}`}
                  placeholder="mín."
                  className="w-20 text-center tabular-nums"
                  value={rangos[id]?.min ?? ""}
                  onChange={(e) =>
                    setRangos((prev) => ({
                      ...prev,
                      [id]: { ...(prev[id] ?? VACIO), min: e.target.value },
                    }))
                  }
                  disabled={guardando}
                />
                <Input
                  inputMode="decimal"
                  aria-label={`Máximo de ${enLaHoja}`}
                  placeholder="máx."
                  className="w-20 text-center tabular-nums"
                  value={rangos[id]?.max ?? ""}
                  onChange={(e) =>
                    setRangos((prev) => ({
                      ...prev,
                      [id]: { ...(prev[id] ?? VACIO), max: e.target.value },
                    }))
                  }
                  disabled={guardando}
                />
              </div>
            ))}
          </div>
        </div>
      </details>

      {error && (
        <p role="alert" className="text-red-400 text-xs">
          {error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="md" disabled={guardando}>
          {guardando ? (
            <>
              <Spinner className="w-4 h-4 animate-spin" strokeWidth={2.5} />
              Guardando…
            </>
          ) : cliente ? (
            "Guardar cambios"
          ) : (
            "Crear cliente"
          )}
        </Button>
        <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={guardando}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
