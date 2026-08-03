import { describe, expect, it } from 'vitest';
import {
  PLANTILLAS,
  REGLAS,
  TOTAL_PLANTILLAS,
  TOTAL_REGLAS,
  VOCABULARIO_PROHIBIDO,
  definicionRegla,
  enumerar,
  esRegla,
  esTextoAdmisible,
  etiquetaLimitacion,
  etiquetaNivel,
  etiquetaPoblacion,
  plantilla,
  render,
  terminosProhibidos,
} from '../index';

// ── Plantillas, render y vocabulario (Sprint PAS-4.0) ──────────────────────

describe('catálogo de plantillas', () => {
  it('declara al menos 26 plantillas', () => {
    expect(TOTAL_PLANTILLAS).toBeGreaterThanOrEqual(26);
  });

  it('ningún id se repite', () => {
    const ids = PLANTILLAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ninguna plantilla tiene texto vacío', () => {
    for (const p of PLANTILLAS) expect(p.texto.trim()).not.toBe('');
  });

  it('cada hueco declarado aparece en su texto', () => {
    for (const p of PLANTILLAS) {
      for (const hueco of p.huecos) {
        expect(p.texto).toContain(`{${hueco}}`);
      }
    }
  });

  it('ningún hueco del texto queda sin declarar', () => {
    for (const p of PLANTILLAS) {
      const enTexto = [...p.texto.matchAll(/\{(\w+)\}/g)].map((m) => m[1]);
      for (const hueco of enTexto) expect(p.huecos).toContain(hueco);
    }
  });

  it('ninguna plantilla contiene vocabulario prohibido', () => {
    for (const p of PLANTILLAS) {
      expect(terminosProhibidos(p.texto), `${p.id}: ${p.texto}`).toEqual([]);
    }
  });

  it('toda plantilla termina en punto', () => {
    for (const p of PLANTILLAS) expect(p.texto.endsWith('.')).toBe(true);
  });

  it('plantilla() devuelve la definición', () => {
    expect(plantilla('CAP_SIN_EVIDENCIA').id).toBe('CAP_SIN_EVIDENCIA');
  });

  it('plantilla() lanza ante un id desconocido', () => {
    expect(() => plantilla('NO_EXISTE')).toThrow(/plantilla desconocida/);
  });
});

describe('catálogo de reglas', () => {
  it('declara 28 reglas', () => {
    expect(TOTAL_REGLAS).toBe(28);
  });

  it('ningún id se repite', () => {
    const ids = REGLAS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('toda regla apunta a una plantilla existente', () => {
    for (const r of REGLAS) expect(() => plantilla(r.plantilla)).not.toThrow();
  });

  it('toda regla declara su disparador', () => {
    for (const r of REGLAS) expect(r.disparador.trim()).not.toBe('');
  });

  it('ningún disparador usa lenguaje prescriptivo', () => {
    for (const r of REGLAS) expect(terminosProhibidos(r.disparador)).toEqual([]);
  });

  it('esRegla reconoce las catalogadas y rechaza el resto', () => {
    expect(esRegla('PIE-01')).toBe(true);
    expect(esRegla('PIE-99')).toBe(false);
  });

  it('definicionRegla devuelve undefined si no existe', () => {
    expect(definicionRegla('PIE-99')).toBeUndefined();
  });

  it('las plantillas de capacidad pertenecen a reglas de capacidad', () => {
    const deCapacidad = REGLAS.filter((r) => r.bloque === 'capacidad');
    expect(deCapacidad.length).toBeGreaterThanOrEqual(14);
  });
});

describe('render', () => {
  it('sustituye un hueco', () => {
    const texto = render('CAP_SIN_EVIDENCIA', { capacidad: 'fuerza máxima (A-01)' });
    expect(texto).toContain('fuerza máxima (A-01)');
    expect(texto).not.toContain('{');
  });

  it('sustituye varios huecos', () => {
    const texto = render('CAP_CARACTERIZADA', {
      capacidad: 'fuerza máxima (A-01)', nivel: 'moderado', pruebas: 'P-01',
    });
    expect(texto).toContain('moderado');
    expect(texto).toContain('P-01');
  });

  it('lanza si falta un hueco', () => {
    expect(() => render('CAP_CARACTERIZADA', { capacidad: 'x' })).toThrow(/faltan huecos/);
  });

  it('lanza si un hueco viene vacío', () => {
    expect(() =>
      render('CAP_SIN_EVIDENCIA', { capacidad: '' })
    ).toThrow(/faltan huecos/);
  });

  it('lanza ante un hueco no declarado', () => {
    expect(() =>
      render('CONSISTENCIA_COMPLETA', { sobra: 'x' })
    ).toThrow(/no declarados/);
  });

  it('lanza si un valor inyectado trae léxico prohibido', () => {
    expect(() =>
      render('CAP_SIN_EVIDENCIA', { capacidad: 'su riesgo de caída' })
    ).toThrow(/léxico prohibido/);
  });

  it('renderiza una plantilla sin huecos', () => {
    expect(render('CONSISTENCIA_COMPLETA')).toContain('completa');
  });

  it('es determinista', () => {
    const uno = render('CAP_SIN_EVIDENCIA', { capacidad: 'agilidad (D-02)' });
    const otro = render('CAP_SIN_EVIDENCIA', { capacidad: 'agilidad (D-02)' });
    expect(uno).toBe(otro);
  });

  it('sustituye todas las apariciones del mismo hueco', () => {
    const texto = render('CAP_ALCANCE', { capacidad: 'X', alcance: 'Y' });
    expect(texto).not.toContain('{');
  });
});

describe('enumerar', () => {
  it('lista vacía devuelve un guion', () => {
    expect(enumerar([])).toBe('—');
  });

  it('un elemento', () => {
    expect(enumerar(['a'])).toBe('a');
  });

  it('dos elementos', () => {
    expect(enumerar(['a', 'b'])).toBe('a y b');
  });

  it('tres o más', () => {
    expect(enumerar(['a', 'b', 'c'])).toBe('a, b y c');
  });
});

describe('vocabulario prohibido', () => {
  it('declara al menos 20 términos', () => {
    expect(VOCABULARIO_PROHIBIDO.length).toBeGreaterThanOrEqual(20);
  });

  it.each(['mejor', 'peor', 'óptimo', 'deficiente', 'riesgo', 'lesión', 'debe', 'ideal'])(
    'detecta «%s»',
    (termino) => {
      expect(esTextoAdmisible(`El atleta ${termino} algo.`)).toBe(false);
    }
  );

  it('no confunde «plan» dentro de «plantilla»', () => {
    expect(esTextoAdmisible('La plantilla se aplica sin cambios.')).toBe(true);
  });

  it('no confunde «mejor» dentro de «mejorar»… pero «mejorar» también está prohibido', () => {
    expect(terminosProhibidos('conviene mejorar')).toContain('mejorar');
    expect(terminosProhibidos('conviene mejorar')).not.toContain('mejor');
  });

  it('no confunde «debe» dentro de «debería»', () => {
    const encontrados = terminosProhibidos('debería revisarse');
    expect(encontrados).toContain('debería');
    expect(encontrados).not.toContain('debe');
  });

  it('respeta fronteras de palabra con acento', () => {
    expect(esTextoAdmisible('La sesión concluyó.')).toBe(true);
  });

  it('es insensible a mayúsculas', () => {
    expect(esTextoAdmisible('RIESGO elevado')).toBe(false);
  });

  it('un texto descriptivo pasa', () => {
    expect(esTextoAdmisible('No existe evidencia registrada para caracterizar la capacidad.')).toBe(true);
  });

  it('devuelve todos los términos encontrados', () => {
    expect(terminosProhibidos('debe corregir el plan').sort()).toEqual(
      ['corregir', 'debe', 'plan'].sort()
    );
  });
});

describe('etiquetas', () => {
  it('el nivel concuerda en masculino con «nivel»', () => {
    expect(etiquetaNivel('moderada')).toBe('moderado');
    expect(etiquetaNivel('baja')).toBe('bajo');
    expect(etiquetaNivel('muy_baja')).toBe('muy bajo');
  });

  it('traduce todas las poblaciones sin dejar códigos crudos', () => {
    expect(etiquetaPoblacion('adultos_mayores')).toBe('adultos mayores');
    expect(etiquetaPoblacion('ninos')).toBe('niños');
  });

  it('traduce las limitaciones de la PKB', () => {
    expect(etiquetaLimitacion('validez_constructo_no_verificada')).toContain('constructo');
  });

  it('ninguna etiqueta de limitación trae léxico prohibido', () => {
    const codigos = [
      'validez_constructo_no_verificada', 'especifica_del_ejercicio',
      'especifica_del_angulo', 'estimacion_mediada_por_ecuacion',
      'requiere_normalizacion', 'contaminada_por_aprendizaje',
      'indice_oculta_componentes', 'varianza_dominada_por_edad_y_sexo',
      'confundida_por_proporciones_corporales', 'alcance_restringido',
      'poblacion_restringida',
    ] as const;
    for (const codigo of codigos) {
      expect(terminosProhibidos(etiquetaLimitacion(codigo))).toEqual([]);
    }
  });
});
