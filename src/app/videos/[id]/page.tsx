import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function VideoDetalle({ params }: Props) {
  const { id } = await params;
  const titulo = id.replace(/-/g, " ");

  return (
    <main className="max-w-3xl mx-auto px-4 py-12">
      <Link href="/videos" className="text-sm text-blue-500 hover:underline mb-6 inline-block">
        ← Volver a Videos
      </Link>
      <div className="w-full aspect-video bg-gray-100 rounded-xl flex items-center justify-center mb-6">
        <svg className="w-16 h-16 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold capitalize mb-2">{titulo}</h1>
      <p className="text-gray-500 text-sm mb-4">Duración: 15:00 · Categoría: Entrenamiento</p>
      <p className="text-gray-600 leading-relaxed">
        Descripción del video sobre <strong>{titulo}</strong>. Aquí irá la descripción completa,
        capítulos y recursos relacionados.
      </p>
    </main>
  );
}
