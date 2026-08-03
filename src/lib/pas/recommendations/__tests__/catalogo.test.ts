import { describe, expect, it } from 'vitest';
import {
  CASOS_RECHAZADOS,
  CATEGORIAS,
  ETIQUETA_CATEGORIA,
  ETIQUETA_PRIORIDAD,
  FRASES_PROHIBIDAS,
  LIMITACIONES_DE_ALCANCE,
  ORDEN_CATEGORIAS,
  PLANTILLAS,
  PRIORIDADES,
  REGLAS,
  TOTAL_CASOS_RECHAZADOS,
  TOTAL_PLANTILLAS,
  TOTAL_REGLAS,
  VOCABULARIO_PROHIBIDO,
  compararPrioridad,
  definicionRegla,
  enumerar,
  esCategoria,
  esMasPrioritaria,
  esPrioridad,
  esRegla,
  esTextoAdmisible,
  plantilla,
  render,
  terminosProhibidos,
} from '../index';

// ── Catálogos, plantillas y guarda léxica (Sprint PAS-6.0) ─────────────────

describe('categorías', () => {
  it('son exactamente las ocho permitidas', () => {
    expect(CATEGORIAS).toHaveLength(8);
    expect([...CATEGORIAS].sort()).toEqual([
      'calidad_perfil', 'cobertura', 'consistencia', 'evidencia',
      'interpretacion', 'metodologia', 'reevaluacion', 'seguimiento_documental',
    ]);
  });

  it('todas tienen etiqueta legible', () => {
    for (const categoria of CATEGORIAS) expect(ETIQUETA_CATEGORIA[categoria]).toBeTruthy();
  });

  it('el orden editorial las contiene todas, sin repetir', () => {
    expect([...ORDEN_CATEGORIAS].sort()).toEqual([...CATEGORIAS].sort());
    expect(new Set(ORDEN_CATEGORIAS).size).toBe(8);
  });

  it('esCategoria rechaza lo que no está en el catálogo', () => {
    expect(esCategoria('cobertura')).toBe(true);
    expect(esCategoria('entrenamiento')).toBe(false);
  });

  it('ninguna etiqueta de categoría trae léxico prohibido', () => {
    for (const categoria of CATEGORIAS) {
      expect(terminosProhibidos(ETIQUETA_CATEGORIA[categoria])).toEqual([]);
    }
  });
});

describe('prioridades', () => {
  it('son las cuatro declaradas', () => {
    expect(PRIORIDADES).toEqual(['critica', 'alta', 'media', 'informativa']);
  });

  it('todas tienen etiqueta', () => {
    for (const prioridad of PRIORIDADES) expect(ETIQUETA_PRIORIDAD[prioridad]).toBeTruthy();
  });

  it('crítica pesa más que alta, y alta más que media', () => {
    expect(esMasPrioritaria('critica', 'alta')).toBe(true);
    expect(esMasPrioritaria('alta', 'media')).toBe(true);
    expect(esMasPrioritaria('informativa', 'media')).toBe(false);
  });

  it('comparar es reflexivo en la igualdad', () => {
    expect(compararPrioridad('alta', 'alta')).toBe(0);
  });

  it('esPrioridad rechaza valores fuera del catálogo', () => {
    expect(esPrioridad('critica')).toBe(true);
    expect(esPrioridad('urgente')).toBe(false);
  });
});

describe('reglas', () => {
  it('declara 20', () => {
    expect(TOTAL_REGLAS).toBe(20);
  });

  it('ningún id se repite', () => {
    const ids = REGLAS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda regla usa una categoría del catálogo', () => {
    for (const regla of REGLAS) expect(esCategoria(regla.categoria), regla.id).toBe(true);
  });

  it('toda regla usa una prioridad del catálogo', () => {
    for (const regla of REGLAS) expect(esPrioridad(regla.prioridad), regla.id).toBe(true);
  });

  it('toda regla apunta a una plantilla existente', () => {
    for (const regla of REGLAS) expect(() => plantilla(regla.plantilla)).not.toThrow();
  });

  it('todo disparador es descriptivo, no prescriptivo', () => {
    for (const regla of REGLAS) {
      expect(terminosProhibidos(regla.disparador), regla.id).toEqual([]);
    }
  });

  it('las ocho categorías están representadas por alguna regla', () => {
    const usadas = new Set(REGLAS.map((r) => r.categoria));
    expect(usadas.size).toBe(8);
  });

  it('las cuatro prioridades están representadas', () => {
    const usadas = new Set(REGLAS.map((r) => r.prioridad));
    expect(usadas.size).toBe(4);
  });

  it('esRegla y definicionRegla concuerdan', () => {
    expect(esRegla('PPRE-01')).toBe(true);
    expect(definicionRegla('PPRE-01')?.categoria).toBe('cobertura');
    expect(esRegla('PPRE-99')).toBe(false);
    expect(definicionRegla('PPRE-99')).toBeUndefined();
  });
});

describe('plantillas', () => {
  it('declara 20', () => {
    expect(TOTAL_PLANTILLAS).toBe(20);
  });

  it('ningún id se repite', () => {
    const ids = PLANTILLAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada hueco declarado aparece en algún campo', () => {
    for (const p of PLANTILLAS) {
      for (const hueco of p.huecos) {
        const texto = [p.titulo, p.descripcion, p.accion, p.seguimiento ?? ''].join(' ');
        expect(texto, `${p.id}/${hueco}`).toContain(`{${hueco}}`);
      }
    }
  });

  it('ningún hueco del texto queda sin declarar', () => {
    for (const p of PLANTILLAS) {
      const texto = [p.titulo, p.descripcion, p.accion, p.seguimiento ?? ''].join(' ');
      for (const [, hueco] of texto.matchAll(/\{(\w+)\}/g)) {
        expect(p.huecos, p.id).toContain(hueco);
      }
    }
  });

  it.each(['titulo', 'descripcion', 'accion'] as const)(
    'ninguna plantilla trae léxico prohibido en %s',
    (campo) => {
      for (const p of PLANTILLAS) {
        expect(terminosProhibidos(p[campo]), `${p.id}: ${p[campo]}`).toEqual([]);
      }
    }
  );

  it('los seguimientos tampoco', () => {
    for (const p of PLANTILLAS) {
      if (p.seguimiento) expect(terminosProhibidos(p.seguimiento), p.id).toEqual([]);
    }
  });

  it('la acción profesional actúa sobre el DATO, no sobre la persona', () => {
    for (const p of PLANTILLAS) {
      expect(p.accion.toLowerCase()).not.toMatch(/\bal atleta\b|\bel atleta\b/);
    }
  });

  it('plantilla() lanza ante un id desconocido', () => {
    expect(() => plantilla('NO_EXISTE')).toThrow(/plantilla desconocida/);
  });
});

describe('render', () => {
  it('sustituye huecos en los cuatro campos', () => {
    const texto = render('SIN_EVIDENCIA', { capacidades: 'A-02 y A-03' });
    expect(texto.descripcion).toContain('A-02 y A-03');
    expect(texto.titulo).toBeTruthy();
    expect(texto.accion).toBeTruthy();
  });

  it('conserva el seguimiento nulo cuando la plantilla no lo define', () => {
    expect(render('SIN_PESOS').seguimiento).toBeNull();
  });

  it('lanza si falta un hueco', () => {
    expect(() => render('SIN_EVIDENCIA')).toThrow(/faltan huecos/);
  });

  it('lanza ante un hueco no declarado', () => {
    expect(() => render('SIN_PESOS', { sobra: 'x' })).toThrow(/no declarados/);
  });

  it('lanza si se inyecta el NOMBRE de una capacidad en vez de su código', () => {
    // Es el fallo que este motor tiene que impedir: «potencia» es a la vez
    // nombre de capacidad (A-03) y término prohibido.
    expect(() => render('SIN_EVIDENCIA', { capacidades: 'potencia' })).toThrow(
      /léxico prohibido/
    );
  });

  it('es determinista', () => {
    expect(render('SIN_EVIDENCIA', { capacidades: 'A-02' })).toEqual(
      render('SIN_EVIDENCIA', { capacidades: 'A-02' })
    );
  });

  it('enumerar produce listas legibles', () => {
    expect(enumerar([])).toBe('—');
    expect(enumerar(['A-01'])).toBe('A-01');
    expect(enumerar(['A-01', 'A-02'])).toBe('A-01 y A-02');
    expect(enumerar(['A-01', 'A-02', 'A-03'])).toBe('A-01, A-02 y A-03');
  });
});

describe('guarda léxica', () => {
  it('declara los términos que el encargo enumera', () => {
    for (const termino of [
      'entrene', 'ejercicio', 'sentadilla', 'press', 'peso muerto', 'series',
      'repeticiones', 'carga', 'volumen', 'intensidad', 'velocidad', 'potencia',
      'hipertrofia', 'riesgo', 'prevención', 'tratamiento', 'diagnóstico',
      'rehabilitación', 'debe', 'debería', 'conviene', 'programa', 'rutina',
    ]) {
      expect(VOCABULARIO_PROHIBIDO, termino).toContain(termino);
    }
  });

  it('detecta la frase completa «se recomienda entrenar»', () => {
    expect(FRASES_PROHIBIDAS).toContain('se recomienda entrenar');
    expect(esTextoAdmisible('Aquí se recomienda entrenar más.')).toBe(false);
  });

  it.each(['entrene', 'ejercicio', 'carga', 'volumen', 'potencia', 'riesgo', 'debe', 'rutina'])(
    'rechaza «%s»',
    (termino) => {
      expect(esTextoAdmisible(`Texto con ${termino} dentro.`)).toBe(false);
    }
  );

  it('respeta fronteras de palabra: «carga» no casa en «descarga»', () => {
    expect(esTextoAdmisible('La descarga del expediente.')).toBe(true);
  });

  it('«potencia» no casa dentro de «potencial»', () => {
    expect(terminosProhibidos('El potencial documental del expediente.')).toEqual([]);
  });

  it('pero «potencia» suelta sí se detecta, por ser nombre de A-03', () => {
    expect(terminosProhibidos('Caracterizar la potencia.')).toContain('potencia');
  });

  it('es insensible a mayúsculas', () => {
    expect(esTextoAdmisible('RIESGO elevado')).toBe(false);
  });

  it('un texto metodológico pasa', () => {
    expect(
      esTextoAdmisible('El perfil no contiene registros elegibles para A-02 y A-03.')
    ).toBe(true);
  });

  it('devuelve todos los términos encontrados, ordenados', () => {
    expect(terminosProhibidos('debe reducir el volumen')).toEqual(['debe', 'reducir', 'volumen']);
  });
});

describe('casos rechazados', () => {
  it('se declaran al menos 18', () => {
    expect(TOTAL_CASOS_RECHAZADOS).toBeGreaterThanOrEqual(18);
  });

  it('cada uno declara motivo y fundamento', () => {
    for (const caso of CASOS_RECHAZADOS) {
      expect(caso.motivo.trim(), caso.id).not.toBe('');
      expect(caso.fundamento.trim(), caso.id).not.toBe('');
    }
  });

  it('ningún id se repite', () => {
    const ids = CASOS_RECHAZADOS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('la mayoría cita una ficha o sección de la base', () => {
    const conPKB = CASOS_RECHAZADOS.filter((c) => c.pkb !== null);
    expect(conPKB.length).toBeGreaterThanOrEqual(12);
  });

  it('cubre las tres familias prohibidas del encargo', () => {
    const texto = CASOS_RECHAZADOS.map((c) => c.motivo).join(' ').toLowerCase();
    expect(texto).toContain('prescribe');
    expect(texto).toContain('compara');
    expect(texto).toContain('ranking');
  });

  it('las limitaciones de alcance declaran ámbito y motivo', () => {
    expect(LIMITACIONES_DE_ALCANCE.length).toBeGreaterThanOrEqual(6);
    for (const limitacion of LIMITACIONES_DE_ALCANCE) {
      expect(limitacion.ambito.trim()).not.toBe('');
      expect(limitacion.motivo.trim()).not.toBe('');
    }
  });
});
