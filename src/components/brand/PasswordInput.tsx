"use client";

import { useState } from "react";
import Input from "@/components/brand/Input";
import { Eye, EyeOff } from "@/components/brand/icons";

// ── Input de contraseña con botón mostrar/ocultar ───────────────────────────
// Envuelve Input sin tocar su API — solo añade el toggle. Vive en brand/
// porque login, signup y update-password lo necesitan los tres (2+ usos,
// se extrae en vez de duplicar el botón del ojo en cada formulario).

type Props = Omit<React.ComponentProps<typeof Input>, "type">;

export default function PasswordInput(props: Props) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input {...props} type={visible ? "text" : "password"} className="pr-11" />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Ocultar contraseña" : "Mostrar contraseña"}
        tabIndex={-1}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/45 hover:text-white/80 transition-colors cursor-pointer"
      >
        {visible ? <EyeOff className="w-4 h-4" strokeWidth={2} /> : <Eye className="w-4 h-4" strokeWidth={2} />}
      </button>
    </div>
  );
}
