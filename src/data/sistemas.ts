import type { ComponenteEcosistema, Sistema } from '@/lib/types';
import { Bolt, TrendingUp, Cycle, Merge, Star } from '@/components/brand/icons';

// ── Los 5 Sistemas del BPS (arquitectura BREY v2, decisión jul 2026) ────────
// Reglas del catálogo:
// · El usuario compra un Sistema, pero entra a un ecosistema.
// · El nivel NO es un producto: cada Sistema tiene niveles internos y el
//   Diagnóstico BPS asigna el punto de entrada.
// · disponible: false → "Próximamente" + lista de espera. Sin precio.
//   Nunca se vende lo que todavía no existe.
// · Lanzamiento inicial: Hipertrofia ($39) · Calistenia ($49) · Híbrido ($59).
//   Precios pensados para Colombia/LatAm — barrera de entrada razonable.

// El ecosistema que acompaña a todo Sistema. Lo 'en-camino' es visión con
// acceso incluido — no una promesa de fecha.
const ecosistemaBase: ComponenteEcosistema[] = [
  { etiqueta: 'Entrenamiento por niveles',    estado: 'incluido' },
  { etiqueta: 'Seguimiento RPE / RIR',        estado: 'incluido' },
  { etiqueta: 'Biblioteca de ejercicios',     estado: 'incluido' },
  { etiqueta: 'Actualizaciones continuas',    estado: 'incluido' },
  { etiqueta: 'Dashboard de entrenamiento',   estado: 'en-camino' },
  { etiqueta: 'Comunidad',                    estado: 'en-camino' },
  { etiqueta: 'Nutrición inteligente',        estado: 'en-camino' },
  { etiqueta: 'IA Coach',                     estado: 'en-camino' },
];

export const sistemas: Sistema[] = [

  // ── SISTEMA DE HIPERTROFIA ── disponible · lanzamiento ──────────────────
  {
    slug: 'hipertrofia',
    icon: TrendingUp,
    nombre: 'Sistema de Hipertrofia',
    objetivo: 'Construir masa muscular con método',
    tagline: 'Músculo construido con ciencia, no con ensayo y error.',
    descripcion:
      'El Sistema completo para ganar masa muscular bajo la metodología BPS. 16 semanas periodizadas — técnica, volumen científico, sobrecarga y definición — con protocolo nutricional y seguimiento integrados. Tu nivel de entrada lo define el Diagnóstico, no la suerte.',
    para:
      'Personas que quieren un físico más desarrollado y entrenan (o van a entrenar) con pesas. Desde quien toca una barra por primera vez hasta el intermedio estancado — el nivel interno se adapta a ti.',
    duracion: '16 semanas',
    disponible: true,
    precio: 39,
    precioFormato: '$39 USD',
    modeloPrecio: 'unico',
    niveles: [
      { nombre: 'Nivel Inicial',    descripcion: 'Técnica de los patrones fundamentales y primeras progresiones de carga. La base que hace posible todo lo demás.' },
      { nombre: 'Nivel Intermedio', descripcion: 'Volumen, frecuencia e intensidad optimizados para maximizar la síntesis proteica muscular.' },
      { nombre: 'Nivel Avanzado',   descripcion: 'Sobrecarga avanzada, especialización por grupos musculares y autorregulación con RPE/RIR.' },
    ],
    fases: [
      {
        nombre: 'Fundamentos y Técnica',
        descripcion:
          'Los patrones de movimiento ejecutados con técnica sólida y las primeras progresiones cuantificadas. Sin base técnica, el volumen es solo riesgo.',
        semanas: 4,
        sesionesSemanales: 3,
      },
      {
        nombre: 'Hipertrofia Científica',
        descripcion:
          'Volumen, frecuencia e intensidad optimizados para maximizar la síntesis proteica muscular. Cada serie tiene un propósito medible.',
        semanas: 4,
        sesionesSemanales: 4,
      },
      {
        nombre: 'Sobrecarga y Powerbuilding',
        descripcion:
          'Trabajo principal de fuerza con volumen accesorio de hipertrofia. La fase que más transforma la composición corporal.',
        semanas: 4,
        sesionesSemanales: 5,
      },
      {
        nombre: 'Definición y Mantenimiento',
        descripcion:
          'Preservar masa muscular en déficit calórico: ajuste de volumen, intensidad y recuperación durante la fase de definición.',
        semanas: 4,
        sesionesSemanales: 5,
      },
    ],
    incluye: [
      'Sistema periodizado de 16 semanas con niveles internos',
      'Videos de técnica por ejercicio',
      'Protocolo nutricional completo (volumen y definición)',
      'Tablas de seguimiento con RPE y RIR',
      'Módulo de movilidad y prevención de lesiones',
      'Estrategias de recuperación y manejo del sueño',
    ],
    ecosistema: ecosistemaBase,
    color: {
      gradient: 'from-orange-950/60 via-orange-900/20 to-slate-950',
      badge: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
      accent: 'text-orange-400',
      glow: 'bg-orange-600/8',
      dot: 'bg-orange-400',
      border: 'border-orange-500/20',
      cta: 'bg-orange-500 hover:bg-orange-400',
    },
    seo: {
      title: 'Sistema de Hipertrofia — Masa Muscular con Método | BREY',
      description:
        'El Sistema BPS para construir músculo: 16 semanas periodizadas con técnica, volumen científico y nutrición integrada. Tu nivel lo define el Diagnóstico BPS.',
    },
  },

  // ── SISTEMA DE CALISTENIA ── disponible · lanzamiento ───────────────────
  {
    slug: 'calistenia',
    icon: Cycle,
    nombre: 'Sistema de Calistenia',
    objetivo: 'Dominar tu peso corporal, hasta las skills',
    tagline: 'Domina tu cuerpo. Desde la primera dominada hasta la planche.',
    descripcion:
      'El Sistema completo de peso corporal bajo la metodología BPS — desde los fundamentos hasta los elementos estáticos avanzados. 24 semanas de progresión estructurada con el mismo rigor científico que el entrenamiento con cargas.',
    para:
      'Atletas que entrenan en parque o casa y quieren dominar su peso corporal: muscle up, handstand, front lever, planche. El nivel interno se adapta — de la primera dominada a las skills.',
    duracion: '24 semanas',
    disponible: true,
    precio: 49,
    precioFormato: '$49 USD',
    modeloPrecio: 'unico',
    niveles: [
      { nombre: 'Nivel Inicial',    descripcion: 'Dominadas, fondos, flexiones y sentadillas ejecutados con técnica perfecta.' },
      { nombre: 'Nivel Intermedio', descripcion: 'L-sit, dips avanzados, muscle up australiano y primeras progresiones de handstand.' },
      { nombre: 'Nivel Avanzado',   descripcion: 'Muscle up en barra, handstand libre y planche lean — la transición hacia la maestría.' },
      { nombre: 'Skills',           descripcion: 'Front lever, back lever y planche con protocolos de progresión respaldados por evidencia.' },
    ],
    fases: [
      {
        nombre: 'Fundamentos Peso Corporal',
        descripcion:
          'Dominadas, fondos, flexiones y sentadillas con peso corporal ejecutados con técnica perfecta. La base que hace posible todo lo demás.',
        semanas: 6,
        sesionesSemanales: 4,
      },
      {
        nombre: 'Habilidades Básicas',
        descripcion:
          'Series de dominadas, muscle up australiano, dips avanzados, L-sit y primeras progresiones de handstand. La fase más importante para construir fuerza específica.',
        semanas: 6,
        sesionesSemanales: 4,
      },
      {
        nombre: 'Habilidades Intermedias',
        descripcion:
          'Muscle up en barra, handstand libre, pike push-up avanzado y planche lean. La fase de transición entre fundamentos y maestría.',
        semanas: 6,
        sesionesSemanales: 5,
      },
      {
        nombre: 'Elementos Estáticos Avanzados',
        descripcion:
          'Front lever, back lever, planche progresiva. Las habilidades más exigentes del peso corporal, con protocolos de progresión específicos respaldados por evidencia.',
        semanas: 6,
        sesionesSemanales: 5,
      },
    ],
    incluye: [
      'Sistema de 24 semanas con 4 niveles internos',
      'Videos técnicos de cada habilidad y progresión',
      'Protocolo de movilidad y acondicionamiento articular',
      'Guía de nutrición para atletas de peso corporal',
      'Tablas de progresión semanal por habilidad',
    ],
    ecosistema: ecosistemaBase,
    color: {
      gradient: 'from-sky-950/60 via-sky-900/20 to-slate-950',
      badge: 'text-sky-400 bg-sky-500/10 border-sky-500/20',
      accent: 'text-sky-400',
      glow: 'bg-sky-600/8',
      dot: 'bg-sky-400',
      border: 'border-sky-500/20',
      cta: 'bg-sky-500 hover:bg-sky-400',
    },
    seo: {
      title: 'Sistema de Calistenia — Domina tu Peso Corporal | BREY',
      description:
        'De la primera dominada a la planche en 24 semanas. El Sistema BPS de calistenia con niveles internos que el Diagnóstico adapta a ti.',
    },
  },

  // ── SISTEMA HÍBRIDO ── disponible · lanzamiento ─────────────────────────
  {
    slug: 'hibrido',
    icon: Merge,
    nombre: 'Sistema Híbrido',
    objetivo: 'Fuerza absoluta y relativa en un solo camino',
    tagline: 'El mejor físico funcional. Cargas y peso corporal como uno solo.',
    descripcion:
      'Para el atleta que no quiere elegir entre la barra y las barras. El Sistema Híbrido combina la fuerza absoluta del gym con la fuerza relativa de la calistenia en una periodización de 20 semanas que produce el físico más completo posible.',
    para:
      'Atletas que entrenan gym y calistenia, o quieren combinar ambas disciplinas. Requiere acceso a gym y a barra o paralelas. El nivel interno define tu punto de entrada.',
    duracion: '20 semanas',
    disponible: true,
    precio: 59,
    precioFormato: '$59 USD',
    modeloPrecio: 'unico',
    niveles: [
      { nombre: 'Base Híbrida',  descripcion: 'Evaluación de fuerza relativa y absoluta, líneas base y adaptación a la periodización dual.' },
      { nombre: 'Integración',   descripcion: 'Sesiones combinadas de cargas y peso corporal — el sistema nervioso aprende ambos contextos.' },
      { nombre: 'Rendimiento',   descripcion: 'Streetlifting, picos de fuerza simultáneos y preparación para competencia.' },
    ],
    fases: [
      {
        nombre: 'Evaluación y Base Híbrida',
        descripcion:
          'Evaluación de fuerza relativa y absoluta. Establecimiento de líneas base. Introducción a la periodización dual que integra cargas y peso corporal en el mismo bloque.',
        semanas: 4,
        sesionesSemanales: 5,
      },
      {
        nombre: 'Fuerza Relativa y Absoluta',
        descripcion:
          'Sesiones alternadas de fuerza con barra y habilidades de calistenia. El sistema nervioso aprende a generar tensión máxima en ambos contextos.',
        semanas: 4,
        sesionesSemanales: 5,
      },
      {
        nombre: 'Integración Avanzada',
        descripcion:
          'Sesiones combinadas de gym y calistenia en el mismo entrenamiento. Powerbuilding con habilidades de peso corporal. La fase que más diferencia a un atleta híbrido.',
        semanas: 6,
        sesionesSemanales: 5,
      },
      {
        nombre: 'Streetlifting y Peak',
        descripcion:
          'Preparación para competencias o eventos de rendimiento máximo. Picos de fuerza absoluta y relativa simultáneos. El cierre del Sistema Híbrido.',
        semanas: 6,
        sesionesSemanales: 5,
      },
    ],
    incluye: [
      'Sistema híbrido periodizado de 20 semanas',
      'Tablas de fuerza relativa (ratio peso corporal)',
      'Protocolo de recuperación avanzado para alto volumen',
      'Guía de nutrición para atleta híbrido',
      'Videos de los movimientos compuestos híbridos',
      'Acceso a ambas bibliotecas (cargas + calistenia)',
    ],
    ecosistema: ecosistemaBase,
    color: {
      gradient: 'from-violet-950/60 via-violet-900/20 to-slate-950',
      badge: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
      accent: 'text-violet-400',
      glow: 'bg-violet-600/8',
      dot: 'bg-violet-400',
      border: 'border-violet-500/20',
      cta: 'bg-violet-500 hover:bg-violet-400',
    },
    seo: {
      title: 'Sistema Híbrido — Cargas + Calistenia | BREY',
      description:
        'Fuerza absoluta y relativa en una sola periodización de 20 semanas. El Sistema BPS para el atleta que no quiere elegir.',
    },
  },

  // ── SISTEMA DE FUERZA ── próximamente · lista de espera ─────────────────
  {
    slug: 'fuerza',
    icon: Bolt,
    nombre: 'Sistema de Fuerza',
    objetivo: 'Levantar más — con técnica y progresión reales',
    tagline: 'La fuerza es la base de todo. Constrúyela con método.',
    descripcion:
      'El Sistema BPS dedicado a la fuerza máxima: sentadilla, peso muerto, press de banca y press militar con periodización, autorregulación por RPE y técnica analizada a fondo. En construcción — con el mismo rigor que todo lo demás.',
    para:
      'Personas que quieren ser objetivamente más fuertes en los básicos con barra. Desde la técnica inicial hasta la programación avanzada de fuerza.',
    duracion: null,
    disponible: false,
    precio: null,
    precioFormato: null,
    modeloPrecio: 'unico',
    niveles: [
      { nombre: 'Nivel Inicial',    descripcion: 'Técnica de los levantamientos y progresión lineal.' },
      { nombre: 'Nivel Intermedio', descripcion: 'Periodización por bloques y autorregulación con RPE.' },
      { nombre: 'Nivel Avanzado',   descripcion: 'Programación de picos de fuerza y especialización.' },
    ],
    fases: [],
    incluye: [],
    ecosistema: ecosistemaBase,
    color: {
      gradient: 'from-rose-950/60 via-rose-900/20 to-slate-950',
      badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
      accent: 'text-rose-400',
      glow: 'bg-rose-600/8',
      dot: 'bg-rose-400',
      border: 'border-rose-500/20',
      cta: 'bg-rose-500 hover:bg-rose-400',
    },
    seo: {
      title: 'Sistema de Fuerza — Próximamente | BREY',
      description:
        'El Sistema BPS de fuerza máxima está en construcción. Únete a la lista de espera y sé de los primeros en acceder.',
    },
  },

  // ── SISTEMA ELITE ── próximamente · lista de espera ─────────────────────
  {
    slug: 'elite',
    icon: Star,
    nombre: 'Sistema Elite',
    objetivo: 'Acceso total + coaching directo e individualizado',
    tagline: 'El acceso completo. Más coaching directo.',
    descripcion:
      'El nivel máximo del ecosistema BREY: acceso ilimitado a todos los Sistemas, análisis biomecánico personalizado, plan ajustado mensualmente y línea directa con el coach. En construcción — abrirá cuando pueda entregarse con la calidad que promete.',
    para:
      'Atletas de cualquier nivel que quieren el máximo apoyo, personalización y acceso completo al ecosistema, con acompañamiento directo.',
    duracion: null,
    disponible: false,
    precio: null,
    precioFormato: null,
    modeloPrecio: 'membresia',
    niveles: [],
    fases: [],
    incluye: [],
    ecosistema: ecosistemaBase,
    color: {
      gradient: 'from-yellow-950/60 via-yellow-900/20 to-slate-950',
      badge: 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20',
      accent: 'text-yellow-400',
      glow: 'bg-yellow-600/8',
      dot: 'bg-yellow-400',
      border: 'border-yellow-500/20',
      cta: 'bg-yellow-500 hover:bg-yellow-400',
    },
    seo: {
      title: 'Sistema Elite — Coaching y Acceso Total, Próximamente | BREY',
      description:
        'Acceso completo a los Sistemas BPS más coaching directo e individualización. Únete a la lista de espera.',
    },
  },
];

export function getSistemaBySlug(slug: string): Sistema | undefined {
  return sistemas.find((s) => s.slug === slug);
}

export const sistemasDisponibles = () => sistemas.filter((s) => s.disponible);
