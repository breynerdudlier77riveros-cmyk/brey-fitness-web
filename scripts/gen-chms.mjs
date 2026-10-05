// Genera src/lib/pas/evidencia/percentiles-chms.ts desde las DOS fichas de la
// NKB. Se ejecuta desde la raíz del repositorio:  node scripts/gen-chms.mjs
// No se teclea ni una cifra: se leen de docs/normative-knowledge-base/fichas/.

import { readFileSync, writeFileSync } from 'node:fs';

const RAIZ = process.cwd();
const P = ['P5', 'P10', 'P20', 'P30', 'P40', 'P50', 'P60', 'P70', 'P80', 'P90', 'P95'];
const NUMS = [5, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95];

const FICHAS = [
  { prefijo: 'CMJ', prueba: 'P-04', fichero: 'CMJ-CA-TN1-percentiles.md', esperadas: 32 },
  { prefijo: 'SAR', prueba: 'P-06', fichero: 'SAR-CA-TN1-percentiles.md', esperadas: 34 },
];

const problemas = [];
const bandas = [];
const ausentes = [];

for (const f of FICHAS) {
  const texto = readFileSync(`${RAIZ}/docs/normative-knowledge-base/fichas/${f.fichero}`, 'utf8');
  const filas = texto
    .split('\n')
    .filter((l) => l.startsWith(`| ${f.prefijo}-CA-`));

  if (filas.length !== f.esperadas) {
    problemas.push(`${f.fichero}: ${filas.length} filas, la ficha declara ${f.esperadas}`);
  }

  for (const fila of filas) {
    const celdas = fila.split('|').map((c) => c.trim()).filter((c) => c !== '');
    // [id, edad, 11 percentiles] = 13 celdas
    if (celdas.length !== 13) {
      problemas.push(`${celdas[0]}: ${celdas.length} celdas, se esperaban 13`);
      continue;
    }
    const id = celdas[0];
    const m = id.match(/^(CMJ|SAR)-CA-(M|F)-(\d+)_(\d+)$/);
    if (!m) {
      problemas.push(`id no reconocido: ${id}`);
      continue;
    }
    const [, , sexo, min, max] = m;

    // La banda de edad del id tiene que coincidir con la columna Edad.
    if (celdas[1] !== `${min}-${max}`) {
      problemas.push(`${id}: el id dice ${min}-${max} y la columna Edad dice ${celdas[1]}`);
    }

    const puntos = [];
    celdas.slice(2).forEach((celda, i) => {
      if (celda === '\u2014' || celda === '-' || celda === '') {
        // Celda perdida en la extracción del PDF. La ficha manda NO
        // reconstruirla, así que aquí NO entra: se omite el punto, y una
        // referencia con diez percentiles es una referencia honesta.
        ausentes.push(`${id}/${P[i]}`);
        return;
      }
      const v = Number(celda.replace(',', '.'));
      if (!Number.isFinite(v)) {
        problemas.push(`${id}/${P[i]}: valor ilegible «${celda}»`);
        return;
      }
      puntos.push({ p: NUMS[i], valor: v });
    });

    // Monotonía: un percentil superior no puede valer menos que uno inferior.
    for (let i = 1; i < puntos.length; i++) {
      if (puntos[i].valor < puntos[i - 1].valor) {
        problemas.push(
          `${id}: P${puntos[i].p}=${puntos[i].valor} < P${puntos[i - 1].p}=${puntos[i - 1].valor}`,
        );
      }
    }

    bandas.push({
      prueba: f.prueba,
      sexo,
      edadMin: Number(min),
      edadMax: Number(max),
      puntos,
    });
  }
}

// ── CONTROL CRUZADO contra lo que estaba tecleado a mano ──────────────────
// ── Las OCHO bandas que estaban tecleadas a mano hasta PAS-17 ─────────────
// Congeladas aquí desde el commit 9b3e913, que es el último en que existieron
// escritas a mano en registro.ts. Son el control cruzado del parser: si lo
// que se lee de la ficha no coincide punto por punto con lo que una persona
// tecleó del mismo PDF, uno de los dos está mal y hay que saber cuál ANTES de
// sustituir ocho valores comprobados por sesenta y seis sin comprobar.
const A_MANO = {"P-04/chms/m-20-24":[[5,32.6],[10,36.6],[20,41.2],[30,44.3],[40,47],[50,49.4],[60,51.7],[70,54.1],[80,56.9],[90,60.7],[95,63.8]],"P-04/chms/m-25-29":[[5,31.5],[10,35.5],[20,40],[30,43.1],[40,45.7],[50,48],[60,50.3],[70,52.6],[80,55.3],[90,59],[95,61.9]],"P-04/chms/f-20-24":[[5,22.8],[10,24.7],[20,27.1],[30,28.9],[40,30.4],[50,31.8],[60,33.3],[70,34.8],[80,36.7],[90,39.3],[95,41.4]],"P-04/chms/f-25-29":[[5,22.2],[10,24.1],[20,26.5],[30,28.3],[40,29.9],[50,31.3],[60,32.8],[70,34.3],[80,36.2],[90,38.8],[95,41]],"P-06/chms/m-20-24":[[5,8.9],[10,11.7],[20,15.5],[30,18.7],[40,21.7],[50,24.6],[60,27.5],[70,30.4],[80,33.5],[90,37.2],[95,39.9]],"P-06/chms/m-25-29":[[5,8.8],[10,11.6],[20,15.4],[30,18.6],[40,21.6],[50,24.5],[60,27.4],[70,30.3],[80,33.4],[90,37.1],[95,39.7]],"P-06/chms/f-20-24":[[5,14.4],[10,18.3],[20,22.9],[30,26.1],[40,28.7],[50,31.1],[60,33.5],[70,36],[80,38.8],[90,42.6],[95,45.7]],"P-06/chms/f-25-29":[[5,14.1],[10,17.9],[20,22.5],[30,25.8],[40,28.5],[50,31.1],[60,33.7],[70,36.2],[80,39.1],[90,42.9],[95,45.8]]};

let cruzadas = 0;
for (const b of bandas) {
  const id = `${b.prueba}/chms/${b.sexo.toLowerCase()}-${b.edadMin}-${b.edadMax}`;
  const esperado = A_MANO[id];
  if (esperado === undefined) continue;
  const izq = JSON.stringify(esperado);
  const der = JSON.stringify(b.puntos.map((p) => [p.p, p.valor]));
  if (izq !== der) problemas.push(`${id}: DIVERGE
    a mano: ${izq}
    ficha : ${der}`);
  cruzadas++;
}

console.log(`Bandas leídas .......... ${bandas.length} (CMJ ${bandas.filter((b) => b.prueba === 'P-04').length}, SAR ${bandas.filter((b) => b.prueba === 'P-06').length})`);
console.log(`Celdas ausentes ........ ${ausentes.length} ${ausentes.join(', ')}`);
console.log(`Cruzadas contra la mano  ${cruzadas}`);
console.log(`Problemas .............. ${problemas.length}`);
for (const p of problemas) console.log('  ✗ ' + p);
if (problemas.length > 0 || cruzadas !== 8) {
  console.log('\nNO SE ESCRIBE NADA.');
  process.exit(1);
}

// ── Emisión ────────────────────────────────────────────────────────────────
const NL = String.fromCharCode(10);
const lineas = bandas.map((b) => {
  const pts = b.puntos.map((p) => `{ p: ${p.p}, valor: ${p.valor} }`).join(', ');
  return `  { prueba: '${b.prueba}', sexo: '${b.sexo}', edadMin: ${b.edadMin}, edadMax: ${b.edadMax}, puntos: [${pts}] },`;
});

const cabecera = [
  '// ── Percentiles del CHMS · salto y sit-and-reach (Sprint PAS-17) ───────────',
  '//',
  '// ⚠ FICHERO GENERADO. No se edita a mano.',
  '//',
  '//   Fuente: `hoffmann_chms_2019` (Canadian Health Measures Survey, ciclo 5).',
  '//   Transcripción: las fichas `CMJ-CA-TN1-percentiles.md` (32 normas, 8 a 69',
  '//   años) y `SAR-CA-TN1-percentiles.md` (34 normas, 6 a 69 años) de la NKB.',
  '//   Generado por `scratchpad/gen-chms.mjs`.',
  '//',
  '// ── POR QUÉ EXISTE ────────────────────────────────────────────────────────',
  '//',
  '//   Las 66 normas llevaban desde el Sprint PAS-12 transcritas y verificadas en',
  '//   la NKB, y solo OCHO llegaban al motor: varones y mujeres de 20 a 29 años,',
  '//   tecleadas a mano en `registro.ts`. Las otras cincuenta y ocho existían en',
  '//   el repositorio y no situaban a nadie. Un niño de 12, un adulto de 45 y una',
  '//   mujer de 60 salían sin posición en dos de las cinco pruebas que la tienen,',
  '//   no porque falte ciencia sino porque faltaba el cable.',
  '//',
  '//   Esto no admite ninguna norma nueva: la fuente ya estaba admitida, la ficha',
  '//   ya estaba verificada y las cifras son las mismas. Lo único que cambia es',
  '//   cuántas de ellas llegan a la pantalla.',
  '//',
  '// ── LAS TRES VERIFICACIONES DEL GENERADOR ─────────────────────────────────',
  '//',
  '//   1 · RECUENTO. Cada ficha declara cuántas normas contiene en su cabecera',
  '//       —32 y 34— y el generador aborta si lee otra cantidad. Es el control',
  '//       que atrapa una fila comida por el parser.',
  '//',
  '//   2 · MONOTONÍA. En cada banda, P95 ≥ P90 ≥ … ≥ P5. Un percentil que baja',
  '//       es una columna desalineada, y en una tabla de once columnas leídas de',
  '//       markdown ese es el fallo más probable y el más silencioso.',
  '//',
  '//   3 · CONTROL CRUZADO. Las ocho bandas adultas ya estaban tecleadas a mano',
  '//       desde PAS-12. El generador las compara punto por punto con lo que lee',
  '//       de la ficha y aborta si difieren. Sustituir ocho valores comprobados',
  '//       por ochenta sin comprobar sería cambiar cobertura por confianza.',
  '//',
  '// ── LAS DOS CELDAS QUE NO ESTÁN ───────────────────────────────────────────',
  '//',
  '//   `CMJ-CA-F-60_64/P95` y `SAR-CA-F-50_54/P95` se perdieron en la extracción',
  '//   del PDF y las fichas los conservan como «—», con la instrucción expresa de',
  '//   no reconstruirlos. Aquí NO se emiten: esas dos bandas salen con diez',
  '//   percentiles en vez de once. Una banda con un hueco declarado sitúa peor',
  '//   que una completa y muchísimo mejor que una con un número inventado.',
  '',
  'export interface BandaCHMS {',
  "  /** Prueba del catálogo: 'P-04' salto, 'P-06' sit-and-reach. */",
  "  prueba: 'P-04' | 'P-06';",
  "  sexo: 'M' | 'F';",
  '  edadMin: number;',
  '  edadMax: number;',
  '  puntos: readonly { p: number; valor: number }[];',
  '}',
  '',
  `/** ${bandas.length} bandas: ${bandas.filter((b) => b.prueba === 'P-04').length} de salto y ${bandas.filter((b) => b.prueba === 'P-06').length} de sit-and-reach. */`,
  'export const PERCENTILES_CHMS: readonly BandaCHMS[] = [',
];

writeFileSync(
  `${RAIZ}/src/lib/pas/evidencia/percentiles-chms.ts`,
  cabecera.join(NL) + NL + lineas.join(NL) + NL + '];' + NL,
  'utf8',
);
console.log('\n✓ escrito src/lib/pas/evidencia/percentiles-chms.ts');
