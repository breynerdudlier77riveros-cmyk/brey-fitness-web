import Link from "next/link";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ProductoDetalle({ params }: Props) {
  const { id } = await params;
  const nombre = id.replace(/-/g, " ");

  return (
    <main className="max-w-2xl mx-auto px-4 py-12">
      <Link href="/productos" className="text-sm text-blue-500 hover:underline mb-6 inline-block">
        ← Volver a Productos
      </Link>
      <div className="w-full h-56 bg-gray-100 rounded-xl mb-6" />
      <h1 className="text-3xl font-bold capitalize mb-2">{nombre}</h1>
      <p className="text-2xl font-bold text-blue-600 mb-4">$29.99</p>
      <p className="text-gray-600 leading-relaxed mb-6">
        Descripción detallada del producto <strong>{nombre}</strong>. Aquí irán los beneficios,
        contenido incluido y todo lo que necesitas saber antes de comprar.
      </p>
      <button className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors">
        Comprar ahora
      </button>
    </main>
  );
}
