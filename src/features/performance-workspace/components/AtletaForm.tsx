"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { accionCrearAtleta, accionEditarAtleta } from "../actions/atletas";
import type { Atleta } from "../schemas/tipos";

// ── Alta y edición de atleta (Sprint PAS-7.0) ──────────────────────────────
// Cliente porque necesita estado de formulario. Toda la validación real vive
// en `schemas/validacion.ts` y se ejecuta en el servidor: esto solo traduce
// códigos de error a texto.

const MENSAJE: Record<string, string> = {
  NOMBRE_REQUERIDO: "El nombre es obligatorio.",
  NOMBRE_DEMASIADO_LARGO: "El nombre supera los 120 caracteres.",
  CAMPO_DEMASIADO_LARGO: "Alguno de los campos supera su longitud máxima.",
  FECHA_INVALIDA: "La fecha de nacimiento no es válida.",
  SEXO_INVALIDO: "El sexo declarado no es válido.",
  PAIS_INVALIDO: "El código de población debe ser de dos letras (ISO 3166-1).",
  ESTATURA_INVALIDA: "La estatura debe estar entre 81 y 259 cm.",
  ATLETA_ELIMINADO: "Este atleta está eliminado y no admite cambios.",
  NO_AUTENTICADO: "La sesión ha caducado.",
};

interface Props {
  atleta?: Atleta;
}

export default function AtletaForm({ atleta }: Props) {
  const router = useRouter();
  const [pendiente, iniciar] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function enviar(datos: FormData) {
    const entrada = {
      nombre: String(datos.get("nombre") ?? ""),
      documento: String(datos.get("documento") ?? "") || undefined,
      codigoInterno: String(datos.get("codigoInterno") ?? "") || undefined,
      deporte: String(datos.get("deporte") ?? "") || undefined,
      fechaNacimiento: String(datos.get("fechaNacimiento") ?? "") || undefined,
      // Las tres coordenadas normativas. La cadena vacía significa «no consta»,
      // y viaja como `null`: no se sustituye por ningún valor frecuente ni se
      // deduce del nombre, del deporte ni de la sesión del profesional.
      sexo: (String(datos.get("sexo") ?? "") || null) as "M" | "F" | null,
      pais: String(datos.get("pais") ?? "") || null,
      estaturaCm: datos.get("estaturaCm") ? Number(datos.get("estaturaCm")) : null,
    };

    iniciar(async () => {
      const resultado = atleta
        ? await accionEditarAtleta(atleta.id, entrada)
        : await accionCrearAtleta(entrada);

      if (!resultado.ok) {
        setError(MENSAJE[resultado.error] ?? "No se pudo guardar.");
        return;
      }

      setError(null);
      router.push(`/app/rendimiento/${resultado.data.id}`);
    });
  }

  return (
    <form action={enviar} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Nombre</span>
          <Input name="nombre" defaultValue={atleta?.nombre ?? ""} required maxLength={120} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Deporte</span>
          <Input name="deporte" defaultValue={atleta?.deporte ?? ""} maxLength={60} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Documento</span>
          <Input name="documento" defaultValue={atleta?.documento ?? ""} maxLength={40} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Código interno</span>
          <Input name="codigoInterno" defaultValue={atleta?.codigoInterno ?? ""} maxLength={40} />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">
            Fecha de nacimiento
          </span>
          <Input type="date" name="fechaNacimiento" defaultValue={atleta?.fechaNacimiento ?? ""} />
        </label>
      </div>

      {/* ── Coordenadas normativas (PRS-2.2) ───────────────────────────────
          Las tres son OPCIONALES: un atleta se registra sin ellas y su informe
          normativo dirá qué le falta. Sin sexo y población no hay comparación
          posible —todas las normas de la NKB estratifican por sexo y ninguna
          cubre a una población ajena—, así que se pide declararlas en vez de
          suponerlas. «Sin declarar» es una opción real, no un hueco. */}
      <fieldset className="space-y-3 border-t border-white/[0.06] pt-5">
        <legend className="text-xs font-semibold text-white/60">
          Coordenadas normativas
          <span className="ml-2 font-normal text-white/35">
            Necesarias para comparar contra una norma. Opcionales.
          </span>
        </legend>

        <div className="grid gap-4 sm:grid-cols-3">
          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-white/60">Sexo</span>
            <select
              name="sexo"
              defaultValue={atleta?.sexo ?? ""}
              className="h-10 w-full rounded-lg border border-white/[0.10] bg-white/[0.03] px-3 text-sm text-white"
            >
              <option value="">Sin declarar</option>
              <option value="M">Masculino</option>
              <option value="F">Femenino</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-white/60">
              Población
              <span className="ml-1 font-normal text-white/35">de pertenencia</span>
            </span>
            <select
              name="pais"
              defaultValue={atleta?.pais ?? ""}
              className="h-10 w-full rounded-lg border border-white/[0.10] bg-white/[0.03] px-3 text-sm text-white"
            >
              <option value="">Sin declarar</option>
              <option value="CO">Colombia</option>
              <option value="CL">Chile</option>
              <option value="BR">Brasil</option>
              <option value="DE">Alemania</option>
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-xs font-semibold text-white/60">Estatura (cm)</span>
            <Input
              type="number"
              name="estaturaCm"
              min={81}
              max={259}
              step="0.1"
              defaultValue={atleta?.estaturaCm ?? ""}
            />
          </label>
        </div>

        <p className="text-[11px] leading-relaxed text-white/35">
          La población es la de pertenencia del atleta, no su lugar de residencia. La estatura solo
          la utilizan algunas normas; sin ella el resto sigue siendo comparable.
        </p>
      </fieldset>

      {error ? (
        <p role="alert" className="text-sm text-red-400">
          {error}
        </p>
      ) : null}

      <Button type="submit" disabled={pendiente}>
        {pendiente ? "Guardando…" : atleta ? "Guardar cambios" : "Crear atleta"}
      </Button>
    </form>
  );
}
