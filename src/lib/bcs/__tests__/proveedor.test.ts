// ── La elección de proveedor (Sprint BCS-14) ───────────────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   1 · Que la elección sea PREDECIBLE. Con dos claves configuradas, cuál
//       contesta no puede depender del orden en que alguien escribió el
//       fichero de entorno: uno cuesta dinero y el otro no.
//
//   2 · Que «falta la clave» diga QUÉ clave. Hay dos variables posibles y el
//       profesional no tiene por qué saber cuál eligió el sistema. Un mensaje
//       genérico le hace revisar la que sí está puesta.
//
//   3 · Que nada de esto toque las tres puertas. El proveedor cambia; el
//       contexto que se le niega, el contrato y el validador, no.

import { describe, expect, it } from 'vitest';

import { claveQueFalta, proveedorElegido } from '@/lib/ia/proveedor';
import { MODELO_POR_DEFECTO, crearProveedorAnthropic } from '@/lib/ia/proveedores/anthropic';
import { crearProveedorGemini, esReintentable } from '@/lib/ia/proveedores/gemini';

/** Un entorno de mentira, sin heredar el real: si no, el test depende de la máquina. */
const env = (over: Record<string, string> = {}): NodeJS.ProcessEnv =>
  over as NodeJS.ProcessEnv;

describe('proveedorElegido', () => {
  it('sin ninguna clave, no elige ninguno', () => {
    expect(proveedorElegido(env())).toBeNull();
  });

  it('elige el que tenga clave, cuando solo hay una', () => {
    expect(proveedorElegido(env({ GEMINI_API_KEY: 'x' }))).toBe('gemini');
    expect(proveedorElegido(env({ ANTHROPIC_API_KEY: 'x' }))).toBe('anthropic');
  });

  it('con las dos claves elige el gratuito, no el primero que aparezca', () => {
    // Es la regla que evita una factura sorpresa: quien tenga las dos
    // configuradas casi seguro esté probando la de coste cero.
    expect(proveedorElegido(env({ GEMINI_API_KEY: 'x', ANTHROPIC_API_KEY: 'y' }))).toBe('gemini');
  });

  it('la variable explícita manda sobre las claves', () => {
    expect(
      proveedorElegido(env({ BREY_IA_PROVEEDOR: 'anthropic', GEMINI_API_KEY: 'x' })),
    ).toBe('anthropic');
    expect(
      proveedorElegido(env({ BREY_IA_PROVEEDOR: 'gemini', ANTHROPIC_API_KEY: 'y' })),
    ).toBe('gemini');
  });

  it('tolera mayúsculas y espacios, que es como se teclea un .env', () => {
    expect(proveedorElegido(env({ BREY_IA_PROVEEDOR: ' Gemini ' }))).toBe('gemini');
  });

  it('un nombre que no existe NO elige a ciegas: cae al reparto por clave', () => {
    // Un «BREY_IA_PROVEEDOR=openai» es un error de configuración. Elegir uno
    // al azar lo escondería; caer al reparto normal deja el sistema en un
    // estado explicable.
    expect(proveedorElegido(env({ BREY_IA_PROVEEDOR: 'openai' }))).toBeNull();
    expect(proveedorElegido(env({ BREY_IA_PROVEEDOR: 'openai', GEMINI_API_KEY: 'x' }))).toBe(
      'gemini',
    );
  });
});

describe('claveQueFalta', () => {
  it('nombra la variable del proveedor pedido, no una cualquiera', () => {
    expect(claveQueFalta('anthropic', env())).toBe('ANTHROPIC_API_KEY');
    expect(claveQueFalta('gemini', env())).toBe('GEMINI_API_KEY');
  });

  it('sin proveedor elegido propone el gratuito', () => {
    expect(claveQueFalta(null, env())).toBe('GEMINI_API_KEY');
  });

  it('no reclama una clave que sí está puesta', () => {
    expect(claveQueFalta('gemini', env({ GEMINI_API_KEY: 'x' }))).toBeNull();
  });
});

describe('los adaptadores', () => {
  it('no se construyen sin su clave: no hay proveedor a medias', () => {
    expect(crearProveedorGemini(env())).toBeNull();
    expect(crearProveedorAnthropic(env())).toBeNull();
  });

  it('cada uno declara su nombre y su modelo, para poder firmarlos', () => {
    const g = crearProveedorGemini(env({ GEMINI_API_KEY: 'x' }));
    const a = crearProveedorAnthropic(env({ ANTHROPIC_API_KEY: 'x' }));

    expect(g?.nombre).toBe('Google Gemini');
    expect(g?.modelo).toContain('gemini');
    expect(a?.nombre).toBe('Anthropic Claude');
    expect(a?.modelo).toBe(MODELO_POR_DEFECTO);
  });

  it('BREY_IA_MODELO sustituye el modelo sin tocar código', () => {
    const g = crearProveedorGemini(env({ GEMINI_API_KEY: 'x', BREY_IA_MODELO: 'gemini-otro' }));
    const a = crearProveedorAnthropic(env({ ANTHROPIC_API_KEY: 'x', BREY_IA_MODELO: 'claude-otro' }));

    expect(g?.modelo).toBe('gemini-otro');
    expect(a?.modelo).toBe('claude-otro');
  });

  it('solo se reintenta la saturación del proveedor, nunca la cuota', () => {
    // Medido contra la API real: la capa gratuita devuelve 503 «high demand»
    // de forma intermitente y la misma petición funciona un segundo después.
    // El 429 es lo contrario — reintentarlo consume más cuota y agrava el
    // problema — y es el error que este test existe para proteger.
    const err = (m: string) => new Error(m);

    expect(esReintentable(err('{"error":{"code":503,"status":"UNAVAILABLE"}}'))).toBe(true);
    expect(esReintentable(err('This model is currently experiencing high demand.'))).toBe(true);

    expect(esReintentable(err('{"error":{"code":429,"status":"RESOURCE_EXHAUSTED"}}'))).toBe(false);
    expect(esReintentable(err('You exceeded your current quota'))).toBe(false);
    expect(esReintentable(err('{"error":{"code":404}}'))).toBe(false);
    expect(esReintentable(err('API key not valid'))).toBe(false);
  });

  it('un 429 que además diga «unavailable» NO se reintenta', () => {
    // El orden de las dos comprobaciones es la parte frágil: si el 503 se
    // mirase primero, un mensaje de cuota con esa palabra entraría al bucle.
    expect(
      esReintentable(new Error('429 RESOURCE_EXHAUSTED: quota exceeded, service UNAVAILABLE')),
    ).toBe(false);
  });

  it('una variable vacía no deja el modelo en blanco', () => {
    // `BREY_IA_MODELO=` en el .env llega como cadena vacía. Pasarla tal cual
    // daría un 404 del proveedor en vez de usar el modelo por defecto.
    const a = crearProveedorAnthropic(env({ ANTHROPIC_API_KEY: 'x', BREY_IA_MODELO: '   ' }));
    expect(a?.modelo).toBe(MODELO_POR_DEFECTO);
  });
});
