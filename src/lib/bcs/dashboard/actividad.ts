// ── Actividad mensual y reciente (Sprint BCS-5.0) ──────────────────────────
// Solo histórico. Ninguna función de este archivo extrapola, proyecta ni
// estima meses futuros: el eje temporal termina en el mes de `hoyISO`.

import type { ClienteIndexado } from './clientes';
import { mesDe, ultimosMeses } from './fechas';
import type { EventoReciente, MesActividad, TipoEvento } from './tipos';

export const MESES_POR_DEFECTO = 12;

/**
 * Serie mensual completa: los meses sin actividad aparecen con ceros, no se
 * omiten. Un eje con huecos comprimidos deformaría la lectura del gráfico.
 */
export function construirActividadMensual(
  indice: readonly ClienteIndexado[],
  hoyISO: string,
  meses: number = MESES_POR_DEFECTO
): MesActividad[] {
  const ventana = ultimosMeses(hoyISO, meses);
  const enVentana = new Set(ventana);

  const acumulador = new Map<string, MesActividad>(
    ventana.map((mes) => [mes, { mes, mediciones: 0, clientesNuevos: 0, enlacesGenerados: 0, enlacesRevocados: 0 }])
  );

  const sumar = (mes: string, campo: keyof Omit<MesActividad, 'mes'>) => {
    if (!enVentana.has(mes)) return;
    const fila = acumulador.get(mes);
    if (fila) fila[campo] += 1;
  };

  for (const c of indice) {
    for (const m of c.medicionesVigentes) sumar(mesDe(m.fecha), 'mediciones');
    sumar(mesDe(c.cliente.created_at), 'clientesNuevos');

    for (const e of c.enlacesActivos) sumar(mesDe(e.created_at), 'enlacesGenerados');
    for (const e of c.enlacesRevocados) {
      // `created_at` es la fecha de GENERACIÓN también para los revocados: la
      // tabla no registra la fecha de revocación. Se cuenta la generación en su
      // mes y la revocación en el mismo, con la imprecisión declarada en el
      // informe del Sprint.
      sumar(mesDe(e.created_at), 'enlacesGenerados');
      sumar(mesDe(e.created_at), 'enlacesRevocados');
    }
  }

  return ventana.map((mes) => acumulador.get(mes)!);
}

/** Eventos ordenados cronológicamente, del más reciente al más antiguo. */
export function construirActividadReciente(
  indice: readonly ClienteIndexado[],
  limite = 20
): EventoReciente[] {
  const eventos: EventoReciente[] = [];

  const anadir = (
    tipo: TipoEvento,
    id: string,
    fecha: string,
    clienteId: string,
    nombre: string,
    descripcion: string
  ) => {
    eventos.push({ id: `${tipo}:${id}`, tipo, fecha: fecha.slice(0, 10), clienteId, nombre, descripcion });
  };

  for (const c of indice) {
    const { id: clienteId, nombre } = c.cliente;

    for (const m of c.medicionesVigentes) {
      anadir('medicion_registrada', m.id, m.fecha, clienteId, nombre, 'Medición registrada');
    }
    for (const m of c.medicionesAnuladas) {
      anadir('medicion_anulada', m.id, m.fecha, clienteId, nombre, 'Medición anulada');
    }
    anadir('cliente_creado', clienteId, c.cliente.created_at, clienteId, nombre, 'Cliente creado');

    for (const e of c.enlacesActivos) {
      anadir('enlace_generado', e.id, e.created_at, clienteId, nombre, 'Enlace público generado');
    }
    for (const e of c.enlacesRevocados) {
      anadir('enlace_revocado', e.id, e.created_at, clienteId, nombre, 'Enlace público revocado');
    }
  }

  return eventos
    .sort((a, b) => {
      if (b.fecha !== a.fecha) return b.fecha.localeCompare(a.fecha);
      // Desempate estable por id: dos eventos del mismo día no pueden
      // alternar posición entre ejecuciones.
      return a.id.localeCompare(b.id);
    })
    .slice(0, limite);
}
