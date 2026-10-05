"use client";

import Input from "@/components/brand/Input";
import Textarea from "@/components/brand/Textarea";
import Checkbox from "@/components/brand/Checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/brand/RadioGroup";
import type { CampoDef } from "@/lib/anamnesis/tipos";
import type { Seccion } from "@/lib/anamnesis/secciones";

// ── Campos reutilizables del formulario de anamnesis ───────────────────────
// Todo el documento es un diccionario plano (ver tipos.ts), así que estos
// componentes no conocen la forma del formulario — solo leen/escriben UNA
// clave cada uno. `SeccionCampos` es lo único que recorre una lista de
// `CampoDef` y decide qué pintar.

interface ContextoDatos {
  datos: Record<string, string>;
  onChange: (clave: string, valor: string) => void;
}

function Etiqueta({ children }: { children: React.ReactNode }) {
  return (
    <label className="block text-[11px] font-semibold uppercase tracking-[0.15em] text-white/50 mb-1.5">
      {children}
    </label>
  );
}

export function CampoTexto({
  clave,
  etiqueta,
  datos,
  onChange,
}: { clave: string; etiqueta: string } & ContextoDatos) {
  return (
    <div data-campo={clave}>
      <Etiqueta>{etiqueta}</Etiqueta>
      <Input value={datos[clave] ?? ""} onChange={(e) => onChange(clave, e.target.value)} />
    </div>
  );
}

export function CampoNumero({
  clave,
  etiqueta,
  datos,
  onChange,
}: { clave: string; etiqueta: string } & ContextoDatos) {
  return (
    <div data-campo={clave}>
      <Etiqueta>{etiqueta}</Etiqueta>
      <Input
        type="number"
        inputMode="numeric"
        value={datos[clave] ?? ""}
        onChange={(e) => onChange(clave, e.target.value)}
      />
    </div>
  );
}

export function CampoTextoLargo({
  clave,
  etiqueta,
  filas = 3,
  datos,
  onChange,
}: { clave: string; etiqueta: string; filas?: number } & ContextoDatos) {
  return (
    <div data-campo={clave} className="sm:col-span-2">
      <Etiqueta>{etiqueta}</Etiqueta>
      <Textarea
        rows={filas}
        style={{ minHeight: `${filas * 1.7}em` }}
        value={datos[clave] ?? ""}
        onChange={(e) => onChange(clave, e.target.value)}
      />
    </div>
  );
}

export function CampoSiNo({
  clave,
  etiqueta,
  datos,
  onChange,
}: { clave: string; etiqueta: string } & ContextoDatos) {
  return (
    <div data-campo={clave} className="sm:col-span-2">
      <p className="text-sm text-white/75 mb-2">{etiqueta}</p>
      <RadioGroup
        value={datos[clave] ?? ""}
        onValueChange={(v) => onChange(clave, v)}
        className="flex flex-row gap-6"
      >
        <label className="flex items-center gap-2 text-sm text-white/70">
          <RadioGroupItem value="si" /> Sí
        </label>
        <label className="flex items-center gap-2 text-sm text-white/70">
          <RadioGroupItem value="no" /> No
        </label>
      </RadioGroup>
    </div>
  );
}

export function CampoOpciones({
  clave,
  etiqueta,
  opciones,
  otraClave,
  datos,
  onChange,
}: { clave: string; etiqueta: string; opciones: string[]; otraClave?: string } & ContextoDatos) {
  return (
    <div data-campo={clave} className="sm:col-span-2">
      <p className="text-sm text-white/75 mb-2">{etiqueta}</p>
      <RadioGroup value={datos[clave] ?? ""} onValueChange={(v) => onChange(clave, v)} className="gap-2.5">
        {opciones.map((opcion) => (
          <label key={opcion} className="flex items-center gap-2 text-sm text-white/70">
            <RadioGroupItem value={opcion} /> {opcion}
            {(opcion === "Otro" || opcion === "Otra") && otraClave ? (
              <Input
                value={datos[otraClave] ?? ""}
                onChange={(e) => onChange(otraClave, e.target.value)}
                placeholder="¿Cuál?"
                className="ml-1 h-8 py-1.5 text-sm max-w-[16rem]"
              />
            ) : null}
          </label>
        ))}
      </RadioGroup>
    </div>
  );
}

export function CampoCasilla({
  clave,
  etiqueta,
  datos,
  onChange,
}: { clave: string; etiqueta: string } & ContextoDatos) {
  return (
    <label data-campo={clave} className="flex items-center gap-2 text-sm text-white/70">
      <Checkbox
        checked={datos[clave] === "true"}
        onCheckedChange={(v) => onChange(clave, v === true ? "true" : "")}
      />
      {etiqueta}
    </label>
  );
}

/** Dibuja un único `CampoDef`, delegando al componente que le corresponda. */
export function CampoRenderizado({ campo, datos, onChange }: { campo: CampoDef } & ContextoDatos) {
  switch (campo.tipo) {
    case "texto":
      return <CampoTexto clave={campo.clave} etiqueta={campo.etiqueta} datos={datos} onChange={onChange} />;
    case "numero":
      return <CampoNumero clave={campo.clave} etiqueta={campo.etiqueta} datos={datos} onChange={onChange} />;
    case "textoLargo":
      return (
        <CampoTextoLargo
          clave={campo.clave}
          etiqueta={campo.etiqueta}
          filas={campo.filas}
          datos={datos}
          onChange={onChange}
        />
      );
    case "siNo":
      return <CampoSiNo clave={campo.clave} etiqueta={campo.etiqueta} datos={datos} onChange={onChange} />;
    case "opciones":
      return (
        <CampoOpciones
          clave={campo.clave}
          etiqueta={campo.etiqueta}
          opciones={campo.opciones}
          otraClave={campo.otraClave}
          datos={datos}
          onChange={onChange}
        />
      );
    case "casilla":
      return <CampoCasilla clave={campo.clave} etiqueta={campo.etiqueta} datos={datos} onChange={onChange} />;
    case "nota":
      return <p className="sm:col-span-2 text-sm text-white/50 italic">{campo.texto}</p>;
  }
}

export function SeccionCampos({ seccion, datos, onChange }: { seccion: Seccion } & ContextoDatos) {
  return (
    <section data-seccion={seccion.id} className="break-inside-avoid-page">
      <h2 className="text-lg font-black text-white mb-4">{seccion.titulo}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
        {seccion.campos.map((campo) => (
          <CampoRenderizado
            key={"clave" in campo ? campo.clave : campo.texto}
            campo={campo}
            datos={datos}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
}
