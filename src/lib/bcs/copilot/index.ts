// ── API pública del AI Clinical Copilot (Sprint BCS-6.0) ───────────────────
// Todo consumidor importa desde aquí. Los módulos internos no son parte del
// contrato y podrán sustituirse —incluido el render por un modelo de
// lenguaje— sin romper ningún call site.

export { generarEntregables, type PeticionCopilot } from './orquestador';

export { CONTRATOS, renderizarContrato } from './prompts';
export { validarTexto, validarSecciones } from './validaciones';
export { contarPalabras, PALABRAS_POR_MINUTO } from './render';
export { CLAVES_PREGUNTA } from './plantillas/faq';
export { CONCEPTOS } from './plantillas/educativo';
export { COMPOSICION_IMPRESION } from './plantillas/clinico';
export { EXTENSIONES } from './plantillas/resumen';
export { MINUTOS } from './plantillas/consulta';

export type {
  Entregable,
  EntregableRechazado,
  EntradaCopilot,
  ResultadoCopilot,
  Seccion,
  TipoEntregable,
  TrazaEntregable,
} from './tipos';

export type { CategoriaViolacion, Violacion } from './validaciones';
export type { VarianteResumen } from './plantillas/resumen';
export type { VarianteGuion, VariantePresentacion } from './plantillas/consulta';
export type { VarianteCorreo, VarianteWhatsapp } from './plantillas/mensajes';
export type { VarianteImpresion } from './plantillas/clinico';
export type { ClavePregunta } from './plantillas/faq';
export type { ConceptoEducativo } from './plantillas/educativo';
