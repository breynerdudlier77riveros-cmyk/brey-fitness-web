// ── Orquestador del AI Clinical Copilot (Sprint BCS-6.0) ───────────────────
// Punto de entrada único. Normaliza las fuentes una vez y ejecuta cada
// solicitud por el mismo pipeline.
//
// Puro y determinista: mismas entradas → mismos entregables, con igualdad
// profunda. Sin Supabase, sin React, sin red, sin reloj (`hoyISO` llega en la
// entrada) y sin mutar nada de lo recibido.

import { normalizar } from './fuentes';
import { ejecutar, type Solicitud } from './pipeline';
import { componerResumen, type VarianteResumen } from './plantillas/resumen';
import { componerExplicacionPaciente } from './plantillas/paciente';
import { componerFaq, type ClavePregunta } from './plantillas/faq';
import { componerGuion, componerPresentacion, type VarianteGuion, type VariantePresentacion } from './plantillas/consulta';
import { componerCorreo, componerWhatsapp, type VarianteCorreo, type VarianteWhatsapp } from './plantillas/mensajes';
import { componerSoap, componerDocumentoImpresion, type VarianteImpresion } from './plantillas/clinico';
import { componerMaterialEducativo, type ConceptoEducativo } from './plantillas/educativo';
import type { Entregable, EntregableRechazado, EntradaCopilot, ResultadoCopilot } from './tipos';

/** Qué entregables producir. Omitir el objeto genera el lote completo. */
export interface PeticionCopilot {
  resumen?: VarianteResumen[];
  explicacionPaciente?: boolean;
  guion?: VarianteGuion[];
  faq?: ClavePregunta[] | boolean;
  correo?: VarianteCorreo[];
  whatsapp?: VarianteWhatsapp[];
  soap?: boolean;
  presentacion?: VariantePresentacion[];
  educativo?: ConceptoEducativo[] | boolean;
  impresion?: VarianteImpresion[];
}

const LOTE_COMPLETO: Required<PeticionCopilot> = {
  resumen: ['30', '100', '300'],
  explicacionPaciente: true,
  guion: ['2min', '5min', '10min'],
  faq: true,
  correo: ['consulta_inicial', 'seguimiento', 'nueva_medicion', 'recordatorio'],
  whatsapp: ['breve', 'normal', 'formal'],
  soap: true,
  presentacion: ['pantalla', 'tablet', 'pdf'],
  educativo: true,
  impresion: ['una_pagina', 'dos_paginas', 'completo'],
};

function construirSolicitudes(p: PeticionCopilot): Solicitud[] {
  const s: Solicitud[] = [];

  for (const v of p.resumen ?? []) {
    s.push({ tipo: 'resumen_ejecutivo', variante: v, titulo: `Resumen ejecutivo · ${v} palabras`, componer: (f) => componerResumen(f, v) });
  }

  if (p.explicacionPaciente) {
    s.push({ tipo: 'explicacion_paciente', variante: 'estandar', titulo: 'Explicación para el paciente', componer: componerExplicacionPaciente });
  }

  for (const v of p.guion ?? []) {
    s.push({ tipo: 'guion_consulta', variante: v, titulo: `Guion de consulta · ${v}`, componer: (f) => componerGuion(f, v) });
  }

  if (p.faq) {
    const claves = Array.isArray(p.faq) ? p.faq : undefined;
    s.push({ tipo: 'faq', variante: 'estandar', titulo: 'Preguntas frecuentes', componer: () => componerFaq(claves), generico: true });
  }

  for (const v of p.correo ?? []) {
    s.push({ tipo: 'correo', variante: v, titulo: `Correo · ${v.replace(/_/g, ' ')}`, componer: (f) => componerCorreo(f, v) });
  }

  for (const v of p.whatsapp ?? []) {
    s.push({ tipo: 'whatsapp', variante: v, titulo: `WhatsApp · ${v}`, componer: (f) => componerWhatsapp(f, v) });
  }

  if (p.soap) {
    s.push({ tipo: 'nota_soap', variante: 'estandar', titulo: 'Nota SOAP', componer: componerSoap });
  }

  for (const v of p.presentacion ?? []) {
    s.push({ tipo: 'presentacion', variante: v, titulo: `Presentación · ${v}`, componer: (f) => componerPresentacion(f, v) });
  }

  if (p.educativo) {
    const conceptos = Array.isArray(p.educativo) ? p.educativo : undefined;
    s.push({ tipo: 'material_educativo', variante: 'estandar', titulo: 'Material educativo', componer: () => componerMaterialEducativo(conceptos), generico: true });
  }

  for (const v of p.impresion ?? []) {
    s.push({ tipo: 'documento_impresion', variante: v, titulo: `Impresión · ${v.replace(/_/g, ' ')}`, componer: (f) => componerDocumentoImpresion(f, v) });
  }

  return s;
}

export function generarEntregables(
  entrada: EntradaCopilot,
  peticion: PeticionCopilot = LOTE_COMPLETO
): ResultadoCopilot {
  const fuentes = normalizar(entrada);
  const solicitudes = construirSolicitudes(peticion);

  const entregables: Entregable[] = [];
  const rechazados: EntregableRechazado[] = [];

  for (const solicitud of solicitudes) {
    const resultado = ejecutar(solicitud, fuentes);
    if (resultado.ok) entregables.push(resultado.entregable);
    else rechazados.push(resultado.rechazado);
  }

  return {
    entregables,
    rechazados,
    meta: { hoyISO: entrada.hoyISO, solicitados: solicitudes.length, emitidos: entregables.length },
  };
}
