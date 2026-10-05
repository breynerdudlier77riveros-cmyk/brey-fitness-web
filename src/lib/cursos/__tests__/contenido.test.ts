// ── El contenido de un Sistema (Sprint CURSO-1) ────────────────────────────
//
// LO QUE ESTE FICHERO DEFIENDE:
//
//   1 · Los identificadores no se reutilizan.
//   2 · Una URL de video se normaliza o se descarta — nunca se guarda rota.
//   3 · Nada se muta: cada edición devuelve un contenido nuevo.

import { describe, expect, it } from 'vitest';

import {
  agregarLeccion,
  agregarMaterial,
  agregarModulo,
  contenidoVacio,
  detectarOrigenVideo,
  eliminarLeccion,
  eliminarMaterial,
  eliminarModulo,
  escribirLeccion,
  leccionDe,
  leccionesEnOrden,
  moverLeccion,
  moverModulo,
  nuevoId,
  problemasDe,
  renombrarModulo,
  tieneContenidoVendible,
  totalLecciones,
} from '../contenido';

describe('el contenido nace vacío y coherente', () => {
  it('CONTROL POSITIVO', () => {
    expect(contenidoVacio()).toEqual({ modulos: [] });
    expect(problemasDe(contenidoVacio())).toEqual([]);
  });

  it('los identificadores no se repiten', () => {
    const ids = new Set(Array.from({ length: 200 }, () => nuevoId()));
    expect(ids.size).toBe(200);
  });
});

describe('módulos', () => {
  it('agregar, renombrar y eliminar no mutan el original', () => {
    const c0 = contenidoVacio();
    const c1 = agregarModulo(c0, 'Fundamentos');
    expect(c0.modulos).toHaveLength(0); // el original sigue vacío
    expect(c1.modulos).toHaveLength(1);
    expect(c1.modulos[0].titulo).toBe('Fundamentos');

    const c2 = renombrarModulo(c1, c1.modulos[0].id, 'Bases');
    expect(c1.modulos[0].titulo).toBe('Fundamentos'); // c1 intacto
    expect(c2.modulos[0].titulo).toBe('Bases');

    const c3 = eliminarModulo(c2, c2.modulos[0].id);
    expect(c3.modulos).toHaveLength(0);
  });

  it('un título en blanco no crea ni renombra nada', () => {
    const c = agregarModulo(contenidoVacio(), '   ');
    expect(c.modulos).toHaveLength(0);

    const conUno = agregarModulo(contenidoVacio(), 'M1');
    const sinCambio = renombrarModulo(conUno, conUno.modulos[0].id, '   ');
    expect(sinCambio.modulos[0].titulo).toBe('M1');
  });

  it('moverModulo intercambia posiciones, y no sale del rango', () => {
    let c = agregarModulo(contenidoVacio(), 'A');
    c = agregarModulo(c, 'B');
    c = agregarModulo(c, 'C');
    const [a, b] = c.modulos;

    const movido = moverModulo(c, b.id, -1);
    expect(movido.modulos.map((m) => m.titulo)).toEqual(['B', 'A', 'C']);

    // El primero no puede subir más.
    expect(moverModulo(c, a.id, -1)).toEqual(c);
    // El último no puede bajar más.
    expect(moverModulo(c, c.modulos[2].id, 1)).toEqual(c);
  });
});

describe('lecciones', () => {
  function conModulo() {
    return agregarModulo(contenidoVacio(), 'M1');
  }

  it('se agregan dentro de SU módulo, no de otro', () => {
    let c = conModulo();
    c = agregarModulo(c, 'M2');
    const [m1, m2] = c.modulos;

    c = agregarLeccion(c, m1.id, 'L1');
    expect(c.modulos.find((m) => m.id === m1.id)!.lecciones).toHaveLength(1);
    expect(c.modulos.find((m) => m.id === m2.id)!.lecciones).toHaveLength(0);
  });

  it('escribirLeccion normaliza la URL del video, o la descarta', () => {
    let c = conModulo();
    c = agregarLeccion(c, c.modulos[0].id, 'L1');
    const leccionId = c.modulos[0].lecciones[0].id;

    const conVideo = escribirLeccion(c, c.modulos[0].id, leccionId, {
      videoUrl: 'youtube.com/watch?v=abc123',
    });
    const l = leccionDe(conVideo, leccionId)!;
    expect(l.videoUrl).toBe('https://youtube.com/watch?v=abc123');
    expect(l.origenVideo).toBe('youtube');

    const urlRota = escribirLeccion(conVideo, c.modulos[0].id, leccionId, {
      videoUrl: 'javascript:alert(1)',
    });
    const l2 = leccionDe(urlRota, leccionId)!;
    expect(l2.videoUrl).toBeNull();
    expect(l2.origenVideo).toBeNull();
  });

  it('detectarOrigenVideo reconoce YouTube y Vimeo, y no inventa para el resto', () => {
    expect(detectarOrigenVideo('https://www.youtube.com/watch?v=x')).toBe('youtube');
    expect(detectarOrigenVideo('https://youtu.be/x')).toBe('youtube');
    expect(detectarOrigenVideo('https://vimeo.com/12345')).toBe('vimeo');
    expect(detectarOrigenVideo('https://player.vimeo.com/video/12345')).toBe('vimeo');
    expect(detectarOrigenVideo('https://misitio.com/video.mp4')).toBe('otro');
  });

  it('eliminar y mover lecciones dentro del módulo correcto', () => {
    let c = conModulo();
    c = agregarLeccion(c, c.modulos[0].id, 'L1');
    c = agregarLeccion(c, c.modulos[0].id, 'L2');
    const [l1, l2] = c.modulos[0].lecciones;

    const movido = moverLeccion(c, c.modulos[0].id, l2.id, -1);
    expect(movido.modulos[0].lecciones.map((l) => l.titulo)).toEqual(['L2', 'L1']);

    const sinL1 = eliminarLeccion(c, c.modulos[0].id, l1.id);
    expect(sinL1.modulos[0].lecciones.map((l) => l.id)).toEqual([l2.id]);
  });

  it('gratis es false por defecto: mostrar contenido sin haber pagado es explícito, no un descuido', () => {
    let c = conModulo();
    c = agregarLeccion(c, c.modulos[0].id, 'L1');
    expect(c.modulos[0].lecciones[0].gratis).toBe(false);
  });
});

describe('materiales', () => {
  it('se agregan y quitan de SU lección', () => {
    let c = agregarModulo(contenidoVacio(), 'M1');
    c = agregarLeccion(c, c.modulos[0].id, 'L1');
    const leccionId = c.modulos[0].lecciones[0].id;

    c = agregarMaterial(c, c.modulos[0].id, leccionId, {
      nombre: 'Guía en PDF',
      archivoPath: 'calistenia/guia.pdf',
    });
    const l = leccionDe(c, leccionId)!;
    expect(l.materiales).toHaveLength(1);
    expect(l.materiales[0].nombre).toBe('Guía en PDF');

    c = eliminarMaterial(c, c.modulos[0].id, leccionId, l.materiales[0].id);
    expect(leccionDe(c, leccionId)!.materiales).toHaveLength(0);
  });
});

describe('consultas', () => {
  it('leccionesEnOrden recorre todos los módulos, en orden', () => {
    let c = agregarModulo(contenidoVacio(), 'M1');
    c = agregarModulo(c, 'M2');
    c = agregarLeccion(c, c.modulos[0].id, 'L1');
    c = agregarLeccion(c, c.modulos[1].id, 'L2');

    const orden = leccionesEnOrden(c);
    expect(orden.map((x) => x.leccion.titulo)).toEqual(['L1', 'L2']);
    expect(totalLecciones(c)).toBe(2);
  });

  it('tieneContenidoVendible exige al menos un video, no solo lecciones vacías', () => {
    let c = agregarModulo(contenidoVacio(), 'M1');
    c = agregarLeccion(c, c.modulos[0].id, 'L1');
    expect(tieneContenidoVendible(c)).toBe(false);

    c = escribirLeccion(c, c.modulos[0].id, c.modulos[0].lecciones[0].id, {
      videoUrl: 'https://youtube.com/watch?v=x',
    });
    expect(tieneContenidoVendible(c)).toBe(true);
  });
});

describe('problemasDe', () => {
  it('detecta módulos y lecciones sin título', () => {
    const c = { modulos: [{ id: 'm1', titulo: '  ', lecciones: [] }] };
    expect(problemasDe(c).join(' ')).toMatch(/no tiene título/);
  });

  it('detecta identificadores repetidos', () => {
    const c = {
      modulos: [
        { id: 'm1', titulo: 'A', lecciones: [] },
        { id: 'm1', titulo: 'B', lecciones: [] },
      ],
    };
    expect(problemasDe(c).join(' ')).toMatch(/identificadores repetidos/);
  });
});
