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
