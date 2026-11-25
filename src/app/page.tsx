import type { CSSProperties, ReactNode } from "react";
import Link from "next/link";
import { getSistemaBySlug, sistemas } from "@/data/sistemas";
import { founder } from "@/data/founder";
import { testimonios } from "@/data/testimonials";
import { media, type MediaSlotData } from "@/data/media";
import type { Sistema } from "@/lib/types";
import DashboardPreview from "@/components/DashboardPreview";
import Button from "@/components/brand/Button";
import Kicker from "@/components/brand/Kicker";
import MediaSlot from "@/components/media/MediaSlot";
import Publicacion from "@/components/Publicacion";
import { publicaciones } from "@/data/publicaciones";
import Lineas from "@/components/motion/Lineas";
import Cifra from "@/components/motion/Cifra";
import SuaveScroll from "@/components/motion/SuaveScroll";
import { ArrowRight, Book, Check, Flame, Scale, Target } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

// ── Home ────────────────────────────────────────────────────────────────────
// Movimiento (globals.css, "Capa de movimiento"): dos técnicas firma.
//   1. Máscaras: titulares línea a línea (<Lineas>) y fotos que se descubren
//      (data-reveal="image"); el resto entra con un fundido corto.
//   2. Scroll: el hero se aleja, la cinta de disciplinas corre y las fotos
//      grandes tienen parallax.
// Descartados a propósito: cursor propio y botones magnéticos (no existen en
// celular, que es de donde llega el tráfico de Instagram), preloader (castiga
// la carga), partículas/3D (esto vende entrenamiento, no tecnología) y
// secciones fijadas con pin (rompen el scroll en celular).

const wrap = "mx-auto w-full max-w-7xl px-5 sm:px-8";
const h2 = "font-display text-[length:clamp(2.75rem,6vw,5.5rem)] font-black leading-[0.95] tracking-[-0.01em]";
const flecha = "h-4 w-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1";
const retardo = (ms: number) => ({ "--retardo": `${ms}ms` }) as CSSProperties;

const creencias = [
  { no: "Copiar rutinas", si: "Entender el entrenamiento" },
  { no: "Seguir tendencias", si: "Evidencia científica" },
  { no: "Entrenar más", si: "Entrenar mejor" },
  { no: "Improvisar", si: "Sistemas" },
];

const principios = [
  { titulo: "Sobrecarga progresiva", frase: "Cada sesión, un estímulo mayor al anterior." },
  { titulo: "Autorregulación", frase: "El plan se ajusta a cómo respondes, no al revés." },
  { titulo: "Periodización", frase: "Cada fase tiene un propósito fisiológico distinto." },
  { titulo: "Seguimiento del progreso", frase: "Lo que no se mide, no se puede ajustar." },
  { titulo: "Adaptación individual", frase: "Tu cuerpo, tu historial, tu punto de partida." },
];

const ciclo = ["Entrenamiento", "Registro", "Estadísticas", "Adaptación", "Nuevo entrenamiento"];

const recursos = [
  { href: "/diagnostico", icon: Target, nombre: "Diagnóstico BPS", detalle: "Tu punto de entrada exacto, en 2 minutos." },
  { href: "/ejercicios", icon: Flame, nombre: "Biblioteca de ejercicios", detalle: "Técnica, errores y variantes de cada movimiento." },
  { href: "/calculadoras", icon: Scale, nombre: "Calculadoras", detalle: "1RM, TDEE, macros y más, con evidencia." },
  { href: "/blog", icon: Book, nombre: "Blog científico", detalle: "La evidencia, explicada en español claro." },
];

const disciplinas = ["Calistenia", "Fuerza", "Hipertrofia", "Periodización", "Evidencia", "Método"];

function sistema(slug: string): Sistema {
  const s = getSistemaBySlug(slug);
  if (!s) throw new Error(`Sistema "${slug}" no existe en data/sistemas.ts`);
  return s;
}

const destacados: { s: Sistema; foto: MediaSlotData }[] = [
  { s: sistema("calistenia"), foto: media.sistemaCalistenia },
  { s: sistema("hipertrofia"), foto: media.sistemaHipertrofia },
  { s: sistema("hibrido"), foto: media.sistemaHibrido },
];
const proximamente = sistemas.filter((s) => !s.disponible);

const semanas = sistemas
  .filter((s) => s.disponible)
  .map((s) => parseInt(s.duracion ?? "", 10))
  .filter(Number.isFinite);

const cifras = [
  { valor: founder.stats[0].value, label: "Años en calistenia" },
  { valor: String(sistemas.filter((s) => s.disponible).length), label: "Sistemas disponibles" },
  { valor: `${Math.min(...semanas)}–${Math.max(...semanas)}`, label: "Semanas por sistema" },
  { valor: "30", label: "Días de garantía" },
];

const [nombre, ...apellidos] = founder.nombre.split(" ");
const experiencia = founder.credenciales.find((c) => c.titulo === "Experiencia")?.items ?? [];

// Rótulo de sección que entra con el resto del bloque.
function Rotulo({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div data-reveal="up" className={className}>
      <Kicker>{children}</Kicker>
    </div>
  );
}

// Una fila de la cinta: las disciplinas dos veces, para que nunca se vea el final al desplazarse.
function FilaCinta({ contorno = false }: { contorno?: boolean }) {
  const palabras = contorno ? [...disciplinas].reverse() : disciplinas;
  return [0, 1].flatMap((vuelta) =>
    palabras.map((d) => (
      <span key={`${vuelta}-${d}`} className="flex items-center whitespace-nowrap">
        {d}
        <span
          className={cn(
            "mx-[0.35em] inline-block h-[0.14em] w-[0.7em] -skew-x-12",
            contorno ? "border-2 border-neutral-950" : "bg-neutral-950"
          )}
        />
      </span>
    ))
  );
}

export default function HomePage() {
  return (
    <div className="overflow-x-clip">
      <SuaveScroll />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      {/* En celular el video ocupa la parte alta y funde a negro bajo el texto;
          desde sm cubre todo el hero. */}
      <section className="hero-escena relative isolate flex min-h-[100svh] flex-col overflow-clip bg-neutral-950">
        {/* sizes: en celular el póster se recorta (object-cover) y se ve ~2,8 veces
            el ancho de la pantalla; con "100vw" llegaba borroso. En celular el
            texto cubre casi todo el video: velo más oscuro para leer el rótulo
            aunque detrás haya cielo. */}
        <MediaSlot
          slot={media.hero}
          sizes="(max-width: 639px) 280vw, 100vw"
          prioridad
          className="hero-medio absolute inset-x-0 top-0 h-[72svh] sm:inset-0 sm:h-auto"
          velo="bg-[linear-gradient(to_top,#0a0a0a_0%,rgba(10,10,10,0.72)_42%,rgba(10,10,10,0.5)_72%,rgba(10,10,10,0.7)_100%)] sm:bg-[linear-gradient(to_top,#0a0a0a_0%,rgba(10,10,10,0.62)_38%,rgba(10,10,10,0.18)_68%,rgba(10,10,10,0.6)_100%)]"
          controlesClassName="right-5 top-[5.25rem] sm:right-8 sm:top-28"
          notaClassName="hidden sm:block right-8 top-28 max-w-xs text-right"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 h-[72svh] bg-[radial-gradient(120%_90%_at_50%_40%,transparent_55%,rgba(0,0,0,0.55)_100%)] sm:inset-0 sm:h-auto"
        />
        {/* pointer-events solo en enlaces: la capa de texto cubre todo el ancho
            y no debe tapar el botón de pausa del video. */}
        <div
          className={cn(
            wrap,
            // pt-36 en celular: deja libre la franja del botón de pausa, encima del rótulo.
            "hero-salida-texto pointer-events-none relative z-10 flex flex-1 flex-col justify-end pb-10 pt-36 sm:pt-28 md:pb-12 [&_a]:pointer-events-auto"
          )}
        >
          <div className="max-w-5xl">
            <div className="entra-subir" style={retardo(0)}>
              <Kicker>Calistenia · Fuerza · Hipertrofia</Kicker>
            </div>
            <Lineas
              as="h1"
              modo="carga"
              className="mt-6 font-display text-[length:clamp(3.25rem,10vw,7.5rem)] font-black leading-[0.88] tracking-[-0.01em]"
              lineas={["El fin del", "entrenamiento", <span key="c" className="italic text-orange-500">a ciegas.</span>]}
            />
            <p className="entra-subir mt-7 max-w-xl text-lg leading-relaxed text-white/80" style={retardo(550)}>
              Un sistema que convierte la evidencia científica en un camino claro: qué hacer hoy, por qué hacerlo y
              qué esperar de tu cuerpo mañana.
            </p>
            <div className="entra-subir mt-9 flex flex-wrap items-center gap-4" style={retardo(700)}>
              <Button href="/diagnostico" size="lg">
                Empezar mi diagnóstico
                <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
              </Button>
              <Button href="#sistemas" variant="outline" size="lg">
                Ver los sistemas
              </Button>
            </div>
          </div>
        </div>
        <div
          className="entra-subir relative z-10 border-t border-white/10 bg-neutral-950/70 backdrop-blur-sm"
          style={retardo(900)}
        >
          <dl className={cn(wrap, "grid grid-cols-2 gap-x-6 gap-y-5 py-6 md:grid-cols-4")}>
            {cifras.map((c, i) => (
              <div key={c.label} className="flex flex-col-reverse gap-1.5 border-l-2 border-orange-500 pl-4">
                <dt className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white/65">{c.label}</dt>
                <dd className="font-display text-4xl font-black leading-none md:text-5xl">
                  <Cifra valor={c.valor} retardo={900 + i * 120} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── Cinta de disciplinas: corre con el scroll (decorativa) ───────── */}
      <div aria-hidden className="overflow-clip bg-orange-500 py-5 text-neutral-950 md:py-7">
        <div className="cinta-izquierda flex w-max items-center font-display text-[length:clamp(3rem,8vw,7rem)] font-black uppercase italic leading-[0.95]">
          <FilaCinta />
        </div>
        <div className="cinta-derecha mt-1 flex w-max items-center font-display text-[length:clamp(3rem,8vw,7rem)] font-black uppercase italic leading-[0.95] text-transparent [-webkit-text-stroke:1.5px_#0a0a0a]">
          <FilaCinta contorno />
        </div>
      </div>

      {/* ── Manifiesto ───────────────────────────────────────────────────── */}
      <section className="bg-neutral-950">
        <div className={cn(wrap, "grid gap-14 py-24 md:py-32 lg:grid-cols-12 lg:gap-12")}>
          <div className="lg:col-span-7">
            <Rotulo>En qué creemos</Rotulo>
            <Lineas className={cn(h2, "mt-6")} lineas={["Entrena con", <span key="c" className="text-orange-500">criterio.</span>]} />
            <ul className="mt-12 divide-y divide-white/10 border-y border-white/10">
              {creencias.map((c, i) => (
                <li
                  key={c.si}
                  data-reveal="up"
                  style={retardo(i * 90)}
                  className="grid gap-1 py-6 sm:grid-cols-[minmax(0,13rem)_1fr] sm:items-baseline sm:gap-8"
                >
                  <span className="font-display text-lg font-bold uppercase tracking-wide text-white/55 line-through decoration-orange-500 decoration-2">
                    <span className="sr-only">En lugar de </span>
                    {c.no}
                  </span>
                  <span className="font-display text-3xl font-black uppercase leading-none md:text-4xl">{c.si}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-5">
            <div data-reveal="image" style={retardo(150)}>
              <MediaSlot
                slot={media.manifiesto}
                sizes="(min-width: 1024px) 40vw, 100vw"
                parallax
                className="aspect-[3/4] w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── El método ────────────────────────────────────────────────────── */}
      <section className="bg-neutral-900">
        <div className={cn(wrap, "py-24 md:py-32")}>
          <div className="flex flex-wrap items-end justify-between gap-8">
            <div>
              <Rotulo>El método</Rotulo>
              <Lineas
                className={cn(h2, "mt-6")}
                lineas={["Cinco principios.", <span key="o" className="text-orange-500">Ninguno es opcional.</span>]}
              />
            </div>
            <div data-reveal="up" style={retardo(200)}>
              <Button href="/bps" variant="outline">
                Conocer el método completo
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </div>
          </div>
          <ol className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {principios.map((p, i) => (
              <li key={p.titulo} data-reveal="up" style={retardo(i * 80)}>
                <div className="group relative h-full overflow-clip rounded-2xl border border-white/10 bg-neutral-950 p-6 transition-colors duration-300 hover:border-orange-500/50">
                  <span
                    aria-hidden
                    data-reveal="draw"
                    style={retardo(350 + i * 80)}
                    className="absolute inset-x-0 top-0 h-1 bg-orange-500"
                  />
                  <span className="block font-display text-4xl font-black leading-none text-orange-500 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:-translate-y-1 lg:text-5xl">
                    0{i + 1}
                  </span>
                  <p className="mt-6 font-display text-2xl font-extrabold uppercase leading-[0.95]">{p.titulo}</p>
                  <p className="mt-3 text-sm leading-relaxed text-white/65">{p.frase}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ── Sistemas ─────────────────────────────────────────────────────── */}
      <section id="sistemas" className="scroll-mt-20 bg-neutral-950">
        <div className={cn(wrap, "py-24 md:py-32")}>
          <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
            <div className="lg:col-span-7">
              <Rotulo>Sistemas</Rotulo>
              <Lineas className={cn(h2, "mt-6")} lineas={["Elige tu", <span key="s" className="text-orange-500">sistema.</span>]} />
            </div>
            <div data-reveal="up" style={retardo(150)} className="lg:col-span-5">
              <p className="text-lg leading-relaxed text-white/70">
                No necesitas adivinar qué Sistema elegir. El Diagnóstico BPS analiza tus objetivos, experiencia y
                disponibilidad para recomendarte el Sistema — y el nivel — más adecuado para ti.
              </p>
              <Link
                href="/diagnostico"
                className="group mt-4 inline-flex min-h-11 items-center gap-2 font-display text-base font-bold uppercase tracking-[0.08em] text-orange-400 transition-colors hover:text-orange-300"
              >
                Hacer el diagnóstico gratis
                <ArrowRight className={flecha} strokeWidth={2.5} />
              </Link>
            </div>
          </div>

          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {destacados.map(({ s, foto }, i) => (
              <div key={s.slug} data-reveal="up" style={retardo(i * 120)} className="flex">
                <Link
                  href={`/sistemas/${s.slug}`}
                  className="group flex w-full flex-col overflow-clip rounded-2xl border border-white/10 bg-neutral-900 transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-orange-500/60 motion-reduce:hover:translate-y-0"
                >
                  <div className="relative">
                    <div data-reveal="image" style={retardo(i * 120 + 100)}>
                      <MediaSlot
                        slot={foto}
                        sizes="(min-width: 768px) 33vw, 100vw"
                        className="aspect-[4/5] w-full"
                        zoom
                        velo="bg-[linear-gradient(to_top,rgba(23,23,23,1)_0%,rgba(23,23,23,0.25)_45%,transparent_70%)]"
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 p-6">
                      <div className="flex flex-wrap gap-2">
                        <span className="rounded-full bg-orange-500 px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-950">
                          {s.duracion}
                        </span>
                        <span className="rounded-full border border-white/25 bg-black/40 px-3 py-1 font-display text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                          {s.niveles.length} niveles
                        </span>
                      </div>
                      <h3 className="mt-4 font-display text-3xl font-black uppercase leading-[0.9] lg:text-4xl">{s.nombre}</h3>
                    </div>
                  </div>
                  <div className="flex flex-1 flex-col p-6 pt-3">
                    <p className="text-white/70">{s.tagline}</p>
                    <ul className="mb-6 mt-5 space-y-2">
                      {s.incluye.slice(0, 3).map((item) => (
                        <li key={item} className="flex items-start gap-2 text-sm leading-snug text-white/70">
                          <Check className="mt-0.5 h-4 w-4 shrink-0 text-orange-400" strokeWidth={3} />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <div className="mt-auto flex items-center justify-between border-t border-white/10 pt-5">
                      <span className="font-display text-3xl font-black">{s.precioFormato}</span>
                      <span className="inline-flex items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.1em] text-orange-400">
                        Ver sistema
                        <ArrowRight className={flecha} strokeWidth={2.5} />
                      </span>
                    </div>
                  </div>
                </Link>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {proximamente.map((s, i) => (
              <div key={s.slug} data-reveal="up" style={retardo(i * 100)} className="flex">
                <Link
                  href={`/sistemas/${s.slug}`}
                  className="group flex w-full items-center justify-between gap-6 rounded-2xl border border-dashed border-white/15 px-6 py-5 transition-colors hover:border-orange-500/50"
                >
                  <div>
                    <p className="font-display text-xs font-bold uppercase tracking-[0.18em] text-white/60">Próximamente</p>
                    <p className="mt-1 font-display text-2xl font-black uppercase leading-none">{s.nombre}</p>
                    <p className="mt-2 text-sm text-white/60">{s.objetivo}</p>
                  </div>
                  <span className="inline-flex shrink-0 items-center gap-2 font-display text-sm font-bold uppercase tracking-[0.1em] text-orange-400">
                    Lista de espera
                    <ArrowRight className={flecha} strokeWidth={2.5} />
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pausa cinematográfica: la planche a todo lo ancho ────────────── */}
      {/* El texto sube solo hasta la franja de pasto (el 20 % inferior de la
          foto, ya fundido a negro): más arriba taparía cara, manos y barras. */}
      <section className="relative bg-neutral-950">
        <div data-reveal="image">
          <MediaSlot
            slot={media.planche}
            sizes="100vw"
            parallax
            className="aspect-[4/5] w-full sm:aspect-[3/2] lg:max-h-[100svh]"
            velo="bg-[linear-gradient(to_top,#0a0a0a_0%,rgba(10,10,10,0.55)_18%,transparent_42%)]"
          />
        </div>
        <div className="relative z-10 -mt-16 sm:-mt-[9vw]">
          <div className={cn(wrap, "pb-24 md:pb-32")}>
            <div className="max-w-4xl">
              <Rotulo>{founder.stats[0].value} años en las barras</Rotulo>
              <Lineas
                className={cn(h2, "mt-6")}
                lineas={["El progreso real", <span key="n" className="text-orange-500">no se improvisa.</span>]}
              />
              <p data-reveal="up" style={retardo(250)} className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
                Cada habilidad que hoy parece imposible se construye con paciencia, método y miles de repeticiones bien
                pensadas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Progreso ─────────────────────────────────────────────────────── */}
      <section className="bg-neutral-900">
        <div className={cn(wrap, "grid items-center gap-14 py-24 md:py-32 lg:grid-cols-2 lg:gap-16")}>
          <div>
            <Rotulo>Retención, no rutina</Rotulo>
            <Lineas className={cn(h2, "mt-6")} lineas={["Así se ve", <span key="p" className="text-orange-500">tu progreso.</span>]} />
            <p data-reveal="up" style={retardo(150)} className="mt-6 max-w-md text-lg leading-relaxed text-white/70">
              No es una rutina que terminas. Es un ciclo que se repite cada semana — y que mejora cada vez que se
              repite.
            </p>
            <ol className="mt-10 space-y-3">
              {ciclo.map((paso, i) => (
                <li key={paso} data-reveal="up" style={retardo(200 + i * 80)} className="flex items-center gap-4">
                  <span className="grid size-10 shrink-0 place-items-center rounded-lg bg-orange-500/10 font-display text-lg font-black text-orange-400">
                    {i + 1}
                  </span>
                  <span className={cn("font-display text-2xl font-extrabold uppercase", i === ciclo.length - 1 && "text-orange-400")}>
                    {paso}
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <div data-reveal="up" style={retardo(200)}>
            <DashboardPreview />
          </div>
        </div>
      </section>

      {/* ── Tu entrenador ────────────────────────────────────────────────── */}
      <section className="bg-neutral-950">
        <div className={cn(wrap, "grid gap-12 py-24 md:py-32 lg:grid-cols-12 lg:gap-12")}>
          <div className="lg:col-span-5">
            <div className="relative">
              <div data-reveal="image">
                <MediaSlot
                  slot={media.fundadorRetrato}
                  sizes="(min-width: 1024px) 40vw, 100vw"
                  parallax
                  encuadre="object-[50%_30%]"
                  className="aspect-[4/5] w-full rounded-2xl"
                  velo="bg-[linear-gradient(to_top,rgba(10,10,10,0.8)_0%,transparent_38%)]"
                />
              </div>
              <div data-reveal="up" style={retardo(600)} className="absolute inset-x-5 bottom-5 flex flex-wrap gap-2">
                <span className="rounded-full bg-orange-500 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-neutral-950">
                  {founder.stats[0].value} {founder.stats[0].label.toLowerCase()}
                </span>
                {experiencia[1] && (
                  <span className="rounded-full border border-white/25 bg-black/45 px-3 py-1.5 font-display text-xs font-bold uppercase tracking-[0.12em] text-white backdrop-blur-sm">
                    {experiencia[1]}
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <Rotulo>Tu entrenador</Rotulo>
            <Lineas
              className={cn(h2, "mt-6")}
              lineas={[nombre, <span key="a" className="text-orange-500">{apellidos.join(" ")}</span>]}
            />
            <p data-reveal="up" style={retardo(150)} className="mt-4 font-display text-lg font-bold uppercase tracking-[0.12em] text-white/65">
              {founder.titulo}
            </p>
            <blockquote
              data-reveal="up"
              style={retardo(250)}
              className="mt-8 border-l-4 border-orange-500 pl-6 text-xl leading-relaxed text-white/85 md:text-2xl"
            >
              “{founder.cierre}”
            </blockquote>
            <dl className="mt-10 grid gap-x-8 gap-y-6 sm:grid-cols-2">
              {founder.credenciales.map((c, i) => (
                <div key={c.titulo} data-reveal="up" style={retardo(300 + i * 80)}>
                  <dt className="font-display text-sm font-bold uppercase tracking-[0.18em] text-orange-400">{c.titulo}</dt>
                  <dd className="mt-1.5 text-[15px] leading-relaxed text-white/70">{c.items.join(" · ")}</dd>
                </div>
              ))}
            </dl>
            {publicaciones.length > 0 && (
              <Publicacion p={publicaciones[0]} variante="compacta" retardo={380} />
            )}
            <div data-reveal="up" style={retardo(460)}>
              <Button href="/historia" variant="outline" className="mt-10">
                Conoce mi historia
                <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Resultados: solo con testimonios reales en data/testimonials.ts ── */}
      {testimonios.length > 0 && (
        <section className="bg-neutral-900">
          <div className={cn(wrap, "py-24 md:py-32")}>
            <Rotulo>Resultados</Rotulo>
            <Lineas className={cn(h2, "mt-6")} lineas={["En sus", <span key="p" className="text-orange-500">palabras.</span>]} />
            <ul className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonios.map((t, i) => (
                <li
                  key={t.nombre}
                  data-reveal="up"
                  style={retardo(i * 100)}
                  className="rounded-2xl border border-white/10 bg-neutral-950 p-7"
                >
                  <p className="font-display text-sm font-bold uppercase tracking-[0.14em] text-orange-400">{t.objetivo}</p>
                  <blockquote className="mt-4 text-lg leading-relaxed text-white/85">“{t.comentario}”</blockquote>
                  <p className="mt-6 font-display text-lg font-extrabold uppercase">{t.nombre}</p>
                  <p className="text-sm text-white/60">
                    {t.sistema} · {t.tiempo}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ── Recursos gratuitos ───────────────────────────────────────────── */}
      <section className="border-t border-white/5 bg-neutral-900">
        <div className={cn(wrap, "py-24 md:py-28")}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <Rotulo>Gratis</Rotulo>
              <Lineas className={cn(h2, "mt-6")} lineas={[<>Empieza <span className="text-orange-500">hoy.</span></>]} />
            </div>
            <p data-reveal="up" style={retardo(150)} className="max-w-sm text-lg leading-relaxed text-white/70">
              Herramientas abiertas para entrenar con criterio desde hoy, sin pagar nada.
            </p>
          </div>
          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recursos.map((r, i) => (
              <li key={r.href} data-reveal="up" style={retardo(i * 80)}>
                <Link
                  href={r.href}
                  className="group flex h-full flex-col rounded-2xl border border-white/10 bg-neutral-950 p-6 transition-[border-color,translate] duration-300 hover:-translate-y-0.5 hover:border-orange-500/60 motion-reduce:hover:translate-y-0"
                >
                  <r.icon className="h-7 w-7 text-orange-400" strokeWidth={1.75} />
                  <span className="mt-8 font-display text-2xl font-black uppercase leading-none">{r.nombre}</span>
                  <span className="mt-3 text-sm leading-relaxed text-white/65">{r.detalle}</span>
                  <span className="mt-auto inline-flex items-center gap-2 pt-6 font-display text-sm font-bold uppercase tracking-[0.1em] text-orange-400">
                    Abrir
                    <ArrowRight className={flecha} strokeWidth={2.5} />
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Cierre ───────────────────────────────────────────────────────── */}
      <section className="bg-orange-500 text-neutral-950">
        <div className={cn(wrap, "flex flex-col items-start gap-10 py-20 md:py-28 lg:flex-row lg:items-end lg:justify-between")}>
          <div className="max-w-3xl">
            <p data-reveal="up" className="font-display text-sm font-bold uppercase tracking-[0.22em]">
              2 minutos · Sin registro · Gratis
            </p>
            <Lineas className={cn(h2, "mt-5")} lineas={["¿No sabes por", "dónde empezar?"]} />
            <p data-reveal="up" style={retardo(200)} className="mt-6 max-w-xl text-lg font-medium leading-relaxed text-neutral-950/90">
              El diagnóstico analiza tu objetivo, nivel, equipo y situación actual para recomendarte el ecosistema
              exacto — y explicarte por qué.
            </p>
          </div>
          <div data-reveal="up" style={retardo(300)} className="shrink-0">
            <Button
              href="/diagnostico"
              size="xl"
              className="bg-neutral-950 text-white hover:bg-neutral-800 active:bg-neutral-900 focus-visible:border-neutral-950 focus-visible:ring-neutral-950 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
            >
              Empezar mi diagnóstico
              <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
