"use client";

import Input from "@/components/brand/Input";
import {
  LABORATORIO_ORINA,
  LABORATORIO_LIPIDICO,
  LABORATORIO_HEMATICO,
  LABORATORIO_GLUCOMETRIA,
  type FilaLaboratorio,
} from "@/lib/anamnesis/datos-fijos";

interface Props {
  datos: Record<string, string>;
  onChange: (clave: string, valor: string) => void;
}

function Grupo({
  titulo,
  filas,
  datos,
  onChange,
}: { titulo: string; filas: FilaLaboratorio[] } & Props) {
  return (
    <div>
      <h3 className="text-sm font-bold text-white/85 mb-2">{titulo}</h3>
      <table className="w-full text-sm border-collapse mb-5">
        <thead>
          <tr className="text-left text-[11px] uppercase tracking-wider text-white/45 border-b border-white/10">
            <th className="py-2 pr-2 font-semibold">Prueba</th>
            <th className="py-2 px-2 font-semibold w-32">Usuario</th>
            <th className="py-2 px-2 font-semibold text-white/30">Mínimo</th>
            <th className="py-2 px-2 font-semibold text-white/30">Normal</th>
            <th className="py-2 pl-2 font-semibold text-white/30">Máximo</th>
          </tr>
        </thead>
        <tbody>
          {filas.map((fila) => (
            <tr key={fila.id} className="border-b border-white/[0.06]" data-fila={fila.id}>
              <td className="py-1.5 pr-2 text-white/80">{fila.etiqueta}</td>
              <td className="py-1.5 px-2">
                <Input
                  value={datos[`lab.${fila.id}`] ?? ""}
                  onChange={(e) => onChange(`lab.${fila.id}`, e.target.value)}
                  className="h-8 py-1 text-sm"
                />
              </td>
              <td className="py-1.5 px-2 text-white/35 text-[12px]">{fila.minimo}</td>
              <td className="py-1.5 px-2 text-white/35 text-[12px]">{fila.normal}</td>
              <td className="py-1.5 pl-2 text-white/35 text-[12px]">{fila.maximo}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Registro de pruebas clínicas de laboratorio: solo la columna "Usuario" se edita. */
export default function TablaLaboratorio({ datos, onChange }: Props) {
  return (
    <section data-seccion="laboratorio" className="break-inside-avoid-page">
      <h2 className="text-lg font-black text-white mb-1.5">
        Registro de las pruebas clínicas de laboratorio
      </h2>
      <p className="text-sm text-white/50 mb-4">
        Mínimo/Normal/Máximo son valores de referencia fijos — solo se
        completa el resultado del usuario.
      </p>
      <Grupo titulo="Prueba de orina" filas={LABORATORIO_ORINA} datos={datos} onChange={onChange} />
      <Grupo titulo="Perfil lipídico" filas={LABORATORIO_LIPIDICO} datos={datos} onChange={onChange} />
      <Grupo titulo="Cuadro hemático" filas={LABORATORIO_HEMATICO} datos={datos} onChange={onChange} />
      <Grupo titulo="Glucometría" filas={LABORATORIO_GLUCOMETRIA} datos={datos} onChange={onChange} />
    </section>
  );
}
