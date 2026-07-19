interface Props {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

// Reemplaza el <div><p className="text-white/50 text-sm">...</p><h1>...</h1></div>
// repetido a mano en cada página de /app.
export default function PageHeader({ title, description, actions }: Props) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
      <div>
        <h1 className="font-black text-2xl sm:text-3xl text-white">{title}</h1>
        {description && <p className="text-white/50 text-sm mt-1">{description}</p>}
      </div>
      {actions && <div className="flex-shrink-0">{actions}</div>}
    </div>
  );
}
