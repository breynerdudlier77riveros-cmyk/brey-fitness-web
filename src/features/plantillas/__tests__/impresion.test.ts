// ── Que la plantilla se pueda imprimir ─────────────────────────────────────
//
// EL FALLO QUE ESTE FICHERO EXISTE PARA IMPEDIR:
//
//   El editor entero lleva `print:hidden`, y el documento solo se dibujaba en
//   la pestaña de vista previa. Imprimir desde «Editar» producía una hoja SIN
//   NADA — y el navegador no dice «esto está vacío»: se queda girando en
//   «generando vista previa». Desde fuera parece que el botón está roto.
//
//   Es un fallo que ningún test de dominio puede ver, porque los datos estaban
//   perfectos: lo que faltaba era que llegaran al papel.
//
// LOS DOS INVARIANTES:
//
//   1 · SIEMPRE hay documento que imprimir, en cualquier pestaña.
//   2 · El documento lleva `hoja-print`. Sin esa clase el papel sale con
//       texto blanco sobre fondo blanco, porque las utilidades de Tailwind son
//       `text-white/x` y el papel no es oscuro. Es invisible hasta que alguien
//       imprime de verdad, así que se comprueba aquí.

import { describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

// Las acciones de servidor no se pueden importar en un test —arrastran
// `next/headers` y el cliente de Supabase— y no hacen falta: aquí se comprueba
// lo que se PINTA, no lo que se guarda.
vi.mock('@/lib/plantillas/actions', () => ({
  guardarContenido: vi.fn(),
  crearEnlacePlantilla: vi.fn(),
  revocarEnlacePlantilla: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn(), push: vi.fn() }),
}));

const { default: PlantillaEditor } = await import(
  '@/features/plantillas/components/PlantillaEditor'
);
const { default: SessionView } = await import(
  '@/features/plantillas/components/SessionView'
);

const { bloqueNuevo, diaNuevo, ejercicioNuevo } = await import('@/lib/plantillas/contenido');
type Plantilla = import('@/lib/plantillas/tipos').Plantilla;

const SEMANAS = 2;
const NOMBRE_EJERCICIO = 'Press de Banca con Barra';

function plantilla(): Plantilla {
  const ejercicio = ejercicioNuevo(NOMBRE_EJERCICIO, SEMANAS, 'press-banca-barra');
  ejercicio.semanas = [
    { series: [{ reps: '4', pesoKg: 80, rir: 2, notas: null }] },
    { series: [{ reps: '4', pesoKg: 85, rir: 1, notas: null }] },
  ];

  const bloque = bloqueNuevo('principal');
  bloque.ejercicios = [ejercicio];

  const dia = diaNuevo('Día 1 · Empuje');
  dia.bloques = [bloque];

  return {
    id: 'p1',
    entrenador_id: 'u1',
    nombre: 'Hipertrofia · Bloque 1',
    descripcion: null,
    semanas: SEMANAS,
    contenido: { dias: [dia] },
    estado: 'publicada',
    created_at: '2026-08-24',
    actualizado_el: '2026-08-24',
  };
}

const render = (p: Plantilla): string =>
  renderToStaticMarkup(
    createElement(PlantillaEditor, {
      plantilla: p,
      enlaces: [],
      clientes: [],
      catalogo: [{ nombre: NOMBRE_EJERCICIO, slug: 'press-banca-barra' }],
      baseUrl: 'https://ejemplo.test',
    }),
  );

describe('el documento existe en las dos pestañas', () => {
  // El editor arranca en «Editar»: es el estado en el que el fallo aparecía.
  const html = render(plantilla());

  it('CONTROL POSITIVO · el documento suelto sí pinta el ejercicio', () => {
    // Sin esto, la comprobación de abajo pasaría también si SessionView
    // hubiera dejado de pintar nada en absoluto.
    const solo = renderToStaticMarkup(
      createElement(SessionView, { contenido: plantilla().contenido, semanas: SEMANAS }),
    );
    expect(solo).toContain(NOMBRE_EJERCICIO);
    expect(solo).toContain('Semana 2');
  });

  it('desde la pestaña de edición TAMBIÉN hay documento que imprimir', () => {
    expect(html).toContain(NOMBRE_EJERCICIO);
    expect(html).toContain('Semana 2');
  });

  it('ese documento está oculto en pantalla y visible en papel', () => {
    // `hidden print:block`: si alguien quita el `print:block`, la hoja vuelve
    // a salir vacía y el navegador vuelve a colgarse en la vista previa.
    expect(html).toMatch(/class="hidden print:block"/);
  });

  it('el editor y sus controles NO se imprimen', () => {
    expect(html).toContain('print:hidden');
  });
});

describe('el tema de impresión viaja con el documento', () => {
  it('SessionView lleva `hoja-print` sin que nadie se lo ponga', () => {
    // Es lo que convierte el papel a fondo claro. Si dependiera de que cada
    // sitio la añada, un día se olvidaría y saldría blanco sobre blanco: un
    // fallo que no se ve hasta que alguien imprime de verdad.
    const solo = renderToStaticMarkup(
      createElement(SessionView, { contenido: plantilla().contenido, semanas: SEMANAS }),
    );
    expect(solo).toMatch(/class="hoja-print/);
  });

  it('y llega también cuando se imprime desde el editor', () => {
    expect(render(plantilla())).toMatch(/class="hoja-print/);
  });
});

describe('el RIR está siempre, aunque no se haya rellenado ninguno', () => {
  // EL FALLO: la columna solo se pintaba si alguna serie traía un RIR. Un
  // entrenador que no había escrito ninguno no veía la columna y concluyó
  // —con razón— que el sistema no tenía RIR. Una casilla que se esconde
  // cuando está vacía no se puede rellenar nunca.
  const sinRir = plantilla();
  const ejercicio = sinRir.contenido.dias[0].bloques[0].ejercicios[0];
  ejercicio.semanas = ejercicio.semanas.map((s) => ({
    series: s.series.map((x) => ({ ...x, rir: null })),
  }));

  const html = renderToStaticMarkup(
    createElement(SessionView, { contenido: sinRir.contenido, semanas: SEMANAS }),
  );

  it('CONTROL POSITIVO · el fixture no trae ni un RIR', () => {
    const rires = sinRir.contenido.dias[0].bloques[0].ejercicios[0].semanas.flatMap((s) =>
      s.series.map((x) => x.rir),
    );
    expect(rires.every((r) => r === null)).toBe(true);
  });

  it('la columna RIR se pinta igual', () => {
    expect(html).toContain('>RIR<');
  });

  it('y las tres columnas van siempre, para que las tablas no queden desalineadas', () => {
    expect(html).toContain('>reps<');
    expect(html).toContain('>kg<');
  });

  it('el hueco es un punto, nunca un cero', () => {
    // Un cero se leería como una indicación que nadie escribió.
    expect(html).toContain('data-vacio');
  });

  it('y el documento explica qué es un RIR, para quien no lo sepa', () => {
    // Quien abre el enlace puede ser el cliente, no el entrenador.
    expect(html).toContain('Repeticiones en reserva');
    expect(html).toContain('Cómo leer estas tablas');
  });
});

describe('la gráfica de volumen', () => {
  it('dibuja una barra por semana, con su valor escrito', () => {
    const html = renderToStaticMarkup(
      createElement(SessionView, { contenido: plantilla().contenido, semanas: SEMANAS }),
    );
    expect(html).toContain('Tonelaje por semana');
    expect(html).toMatch(/<svg[^>]*role="img"/);
    // El texto alternativo lleva la lectura completa: un lector de pantalla
    // no recorre una rejilla de rectángulos.
    expect(html).toMatch(/aria-label="Tonelaje por semana\. Semana 1: \d+ kg/);
  });

  it('sin ninguna carga prescrita cae a series, en vez de pintar ceros', () => {
    // Un gráfico de barras a cero con sus números encima parece roto, y lo
    // que diría ya lo dice la tabla.
    const sinCarga = plantilla();
    const e = sinCarga.contenido.dias[0].bloques[0].ejercicios[0];
    e.semanas = e.semanas.map((s) => ({ series: s.series.map((x) => ({ ...x, pesoKg: null })) }));

    const html = renderToStaticMarkup(
      createElement(SessionView, { contenido: sinCarga.contenido, semanas: SEMANAS }),
    );
    expect(html).toContain('Series por semana');
    expect(html).not.toContain('Tonelaje por semana');
  });

  it('no deforma los números: el lienzo escala en proporción', () => {
    // `preserveAspectRatio="none"` estiraría las letras de los valores.
    const html = renderToStaticMarkup(
      createElement(SessionView, { contenido: plantilla().contenido, semanas: SEMANAS }),
    );
    expect(html).not.toContain('preserveAspectRatio="none"');
  });
});

describe('el descanso', () => {
  it('se escribe en minutos y segundos, no en segundos crudos', () => {
    // El campo pedía segundos y alguien escribió «3» pensando en minutos: se
    // guardaron TRES SEGUNDOS de descanso entre series de press de banca.
    const conDescanso = plantilla();
    conDescanso.contenido.dias[0].bloques[0].ejercicios[0].descansoSeg = 150;

    const html = renderToStaticMarkup(
      createElement(SessionView, { contenido: conDescanso.contenido, semanas: SEMANAS }),
    );
    expect(html).toContain('2 min 30 s');
  });

  it('sin descanso prescrito no se inventa uno', () => {
    const html = renderToStaticMarkup(
      createElement(SessionView, { contenido: plantilla().contenido, semanas: SEMANAS }),
    );
    expect(html).not.toContain('Descanso');
  });
});

describe('la rejilla de semanas no se recorta en papel', () => {
  const solo = renderToStaticMarkup(
    createElement(SessionView, { contenido: plantilla().contenido, semanas: SEMANAS }),
  );

  it('las columnas de TODAS las semanas están en el marcado', () => {
    // El recorte de una tabla ancha lo hace el CSS `overflow`, no el marcado:
    // lo que se comprueba aquí es que el marcado las trae todas, para que la
    // regla de impresión que abre el overflow tenga qué enseñar.
    expect(solo).toContain('Semana 1');
    expect(solo).toContain('Semana 2');
    expect(solo).toContain('80');
    expect(solo).toContain('85');
  });
});
