import type { EcosystemProgram } from '@/lib/types';

export const programas: EcosystemProgram[] = [

  // ── PERFORMANCE START ───────────────────────────────────────────────────
  {
    slug: 'performance-start',
    nombre: 'Performance Start',
    tagline: 'La base correcta desde el primer día.',
    descripcion:
      'El punto de entrada al Brey Performance System. Diseñado para quien parte de cero o lleva tiempo entrenando sin método. En 12 semanas construyes la base de movimiento, fuerza funcional y hábitos que harán que todo lo demás funcione.',
    para:
      'Principiantes absolutos, personas que entrenaron sin estructura, o atletas que regresan después de una pausa. Si nunca has entrenado con método, empieza aquí.',
    nivel: 'principiante',
    duracion: '12 semanas',
    precio: 47,
    precioFormato: '$47',
    modulos: [
      {
        nombre: 'Fundamentos del Movimiento',
        descripcion:
          'Dominas los 6 patrones de movimiento fundamentales: empuje, tracción, bisagra, sentadilla, carga y rotación. Sin base de movimiento, todo lo demás es construir sobre arena.',
        semanas: 4,
        sesionesSemanales: 3,
      },
      {
        nombre: 'Acondicionamiento Físico',
        descripcion:
          'Capacidad cardiovascular y muscular básica. Tu cuerpo aprende a rendir, recuperarse y adaptarse. Se introduce la sobrecarga progresiva desde el primer día.',
        semanas: 4,
        sesionesSemanales: 3,
      },
      {
        nombre: 'Introducción a la Fuerza',
        descripcion:
          'Los primeros pasos con cargas reales. Peso muerto, sentadilla, press de banca y remo con progresión semana a semana. Terminas con una base sólida lista para cualquier ecosistema avanzado.',
        semanas: 4,
        sesionesSemanales: 4,
      },
    ],
    incluye: [
      'Programa estructurado de 12 semanas',
      'Videos de técnica para cada ejercicio',
      'Guía de nutrición para principiantes',
      'Tabla de seguimiento semana a semana',
      'Acceso a la biblioteca de ejercicios',
      'Soporte por comunidad privada',
    ],
    color: {
      gradient: 'from-emerald-950/60 via-emerald-900/20 to-slate-950',
      badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      accent: 'text-emerald-400',
      glow: 'bg-emerald-600/8',
      dot: 'bg-emerald-400',
      border: 'border-emerald-500/20',
      cta: 'bg-emerald-500 hover:bg-emerald-400',
    },
    seo: {
      title: 'Performance Start — Programa para Principiantes | Brey Fitness',
      description:
        'El programa de 12 semanas para construir la base correcta desde cero. Fundamentos de movimiento, acondicionamiento y fuerza con el Brey Performance System.',
    },
  },

  // ── PERFORMANCE GYM ────────────────────────────────────────────────────
  {
    slug: 'performance-gym',
    nombre: 'Performance Gym',
    tagline: 'El sistema científico para el gym.',
    descripcion:
      'El ecosistema completo para quien entrena con pesas y quiere un método real. Hipertrofia, fuerza, powerbuilding y definición en un único sistema periodizado de 16 semanas, con protocolo nutricional y estrategias de recuperación integradas.',
    para:
      'Personas que llevan al menos 6 meses entrenando en gym y quieren pasar de improvisar a tener un sistema. Nivel intermedio a avanzado.',
    nivel: 'intermedio',
    duracion: '16 semanas',
    precio: 97,
    precioFormato: '$97',
    modulos: [
      {
        nombre: 'Hipertrofia Científica',
        descripcion:
          'Volumen, frecuencia e intensidad optimizados para maximizar la síntesis proteica muscular. Cada serie tiene un propósito medible.',
        semanas: 4,
        sesionesSemanales: 4,
      },
      {
        nombre: 'Fuerza Máxima',
        descripcion:
          'Periodización de fuerza con énfasis en los tres levantamientos fundamentales. Progresión lineal avanzada y RPE como herramienta de autorregulación.',
        semanas: 4,
        sesionesSemanales: 4,
      },
      {
        nombre: 'Powerbuilding',
        descripcion:
          'La fusión de fuerza e hipertrofia. Sesiones duales con trabajo principal de fuerza y volumen accesorio de hipertrofia. El módulo que más transforma la composición corporal.',
        semanas: 4,
        sesionesSemanales: 5,
      },
      {
        nombre: 'Definición y Mantenimiento',
        descripcion:
          'Estrategias para preservar masa muscular en déficit calórico. Ajuste de volumen, intensidad y recuperación durante la fase de definición.',
        semanas: 4,
        sesionesSemanales: 5,
      },
    ],
    incluye: [
      'Programa periodizado de 16 semanas',
      'Módulo de movilidad y prevención de lesiones',
      'Protocolo nutricional completo (volumen y definición)',
      'Estrategias de recuperación y manejo del sueño',
      'Tablas de seguimiento con RPE y RIR',
      'Videos de técnica avanzada por ejercicio',
      'Acceso a la biblioteca de ejercicios de gym',
      'Comunidad privada de miembros',
    ],
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
      title: 'Performance Gym — Sistema Completo de Gym | Brey Fitness',
      description:
        'Hipertrofia, fuerza, powerbuilding y definición en 16 semanas. El sistema científico de entrenamiento en gym con el Brey Performance System.',
    },
  },

  // ── PERFORMANCE CALISTHENICS ────────────────────────────────────────────
  {
    slug: 'performance-calisthenics',
    nombre: 'Performance Calisthenics',
    tagline: 'Domina tu cuerpo. Desde la primera dominada hasta la planche.',
    descripcion:
      'El sistema completo de calistenia — desde los fundamentos de peso corporal hasta los elementos estáticos avanzados. 24 semanas de progresión estructurada con el mismo rigor científico que el entrenamiento con pesas.',
    para:
      'Atletas que entrenan en parque o casa, quieren dominar su peso corporal y alcanzar habilidades como el muscle up, handstand, front lever o planche. Todos los niveles.',
    nivel: 'todos',
    duracion: '24 semanas',
    precio: 97,
    precioFormato: '$97',
    modulos: [
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
      'Programa de 24 semanas con 4 fases progresivas',
      'Videos técnicos de cada habilidad y progresión',
      'Protocolo de movilidad y acondicionamiento articular',
      'Guía de nutrición para atletas de peso corporal',
      'Tablas de progresión semanal por habilidad',
      'Biblioteca completa de ejercicios de calistenia',
      'Comunidad privada de calistenia',
    ],
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
      title: 'Performance Calisthenics — Sistema Completo de Peso Corporal | Brey Fitness',
      description:
        'De cero al front lever en 24 semanas. El sistema científico de calistenia para dominar el peso corporal con el Brey Performance System.',
    },
  },

  // ── PERFORMANCE HYBRID ─────────────────────────────────────────────────
  {
    slug: 'performance-hybrid',
    nombre: 'Performance Hybrid',
    tagline: 'El mejor físico funcional. Gym y calistenia como uno solo.',
    descripcion:
      'Para el atleta que no quiere elegir entre pesas y peso corporal. Performance Hybrid combina la fuerza absoluta del gym con la fuerza relativa de la calistenia en un sistema periodizado de 20 semanas que produce el físico más completo posible.',
    para:
      'Atletas intermedios a avanzados que entrenan gym y calistenia, o quieren empezar a combinar ambas disciplinas. Requiere acceso a gym y a barra o paralelas.',
    nivel: 'avanzado',
    duracion: '20 semanas',
    precio: 127,
    precioFormato: '$127',
    modulos: [
      {
        nombre: 'Evaluación y Base Híbrida',
        descripcion:
          'Evaluación de fuerza relativa y absoluta. Establecimiento de líneas base. Introducción a la periodización dual que integra pesas y peso corporal en el mismo bloque.',
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
          'Preparación para competencias o eventos de rendimiento máximo. Picos de fuerza absoluta y relativa simultáneos. El cierre del sistema híbrido.',
        semanas: 6,
        sesionesSemanales: 5,
      },
    ],
    incluye: [
      'Programa híbrido periodizado de 20 semanas',
      'Tablas de fuerza relativa (ratio peso corporal)',
      'Protocolo de recuperación avanzado para alto volumen',
      'Guía de nutrición para atleta híbrido',
      'Videos de los movimientos compuestos híbridos',
      'Acceso a ambas bibliotecas (gym + calistenia)',
      'Comunidad privada de atletas híbridos',
    ],
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
      title: 'Performance Hybrid — Sistema Híbrido Gym + Calistenia | Brey Fitness',
      description:
        'Fuerza absoluta y relativa en un solo sistema. 20 semanas de entrenamiento híbrido con el Brey Performance System.',
    },
  },

  // ── PERFORMANCE ELITE ──────────────────────────────────────────────────
  {
    slug: 'performance-elite',
    nombre: 'Performance Elite',
    tagline: 'El acceso completo. Más coaching directo.',
    descripcion:
      'La membresía más completa del ecosistema Brey Fitness. Acceso ilimitado a los 4 sistemas de entrenamiento, análisis biomecánico personalizado, plan ajustado mensualmente y línea directa con el coach. Para atletas que quieren el siguiente nivel sin límites.',
    para:
      'Atletas de cualquier nivel que quieren el máximo apoyo, personalización y acceso completo. Performance Elite incluye todo lo que existe en la plataforma más acceso directo al coach.',
    nivel: 'todos',
    duracion: 'Membresía mensual',
    precio: 197,
    precioFormato: '$197/mes',
    modulos: [
      {
        nombre: 'Acceso Total al Sistema BPS',
        descripcion:
          'Los 4 ecosistemas completos: Start, Gym, Calisthenics y Hybrid. Acceso ilimitado a todos los módulos, videos y materiales de entrenamiento.',
        semanas: 0,
        sesionesSemanales: 0,
      },
      {
        nombre: 'Evaluación Biomecánica Mensual',
        descripcion:
          'Análisis de tu técnica, patrones de movimiento y áreas de mejora. Cada mes recibes un informe específico con correcciones y ajustes para tu anatomía.',
        semanas: 0,
        sesionesSemanales: 0,
      },
      {
        nombre: 'Plan Individualizado',
        descripcion:
          'Tu programa ajustado a tu historial, limitaciones, objetivos y disponibilidad de tiempo. No es un programa genérico — es tuyo.',
        semanas: 0,
        sesionesSemanales: 0,
      },
      {
        nombre: 'Coaching Directo',
        descripcion:
          'Mensajería directa ilimitada + llamada mensual de revisión de 45 minutos. Respuestas garantizadas en menos de 24 horas.',
        semanas: 0,
        sesionesSemanales: 0,
      },
    ],
    incluye: [
      'Acceso completo a los 4 ecosistemas de entrenamiento',
      'Plan individualizado ajustado mensualmente',
      'Análisis biomecánico mensual con video feedback',
      'Mensajería directa ilimitada (respuesta <24h)',
      'Llamada mensual de revisión (45 min)',
      'Acceso prioritario a nuevos contenidos',
      'Comunidad Elite privada',
      'Cancelación en cualquier momento',
    ],
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
      title: 'Performance Elite — Coaching Personalizado y Acceso Total | Brey Fitness',
      description:
        'El nivel más alto del Brey Performance System. Acceso completo a los 4 ecosistemas más coaching directo, plan individualizado y análisis biomecánico mensual.',
    },
  },
];

export function getProgramBySlug(slug: string): EcosystemProgram | undefined {
  return programas.find((p) => p.slug === slug);
}
