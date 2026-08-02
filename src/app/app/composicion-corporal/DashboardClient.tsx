"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/app/PageHeader";
import Section from "@/components/app/Section";
import MetricCard from "@/components/app/MetricCard";
import Input from "@/components/brand/Input";
import Button from "@/components/brand/Button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/brand/Dialog";
import ClienteCard from "@/features/composicion-corporal/components/ClienteCard";
import ClienteForm from "@/features/composicion-corporal/components/ClienteForm";
import { Search } from "@/components/brand/icons";
import type { Cliente } from "@/lib/bcs/tipos";

interface Props {
  totalActivos: number;
  medicionesEstaSemana: number;
  recientes: Cliente[];
  resto: Cliente[];
  enlaceActivoPorCliente: Record<string, boolean>;
}

export default function DashboardClient({ totalActivos, medicionesEstaSemana, recientes, resto, enlaceActivoPorCliente }: Props) {
  const router = useRouter();
  const [busqueda, setBusqueda] = useState("");
  const [dialogoAbierto, setDialogoAbierto] = useState(false);

  const todos = useMemo(() => [...recientes, ...resto], [recientes, resto]);
  const filtrados = useMemo(
    () => (busqueda.trim() ? todos.filter((c) => c.nombre.toLowerCase().includes(busqueda.trim().toLowerCase())) : null),
    [busqueda, todos]
  );

  function handleClienteCreado(cliente: Cliente) {
    setDialogoAbierto(false);
    router.push(`/app/composicion-corporal/${cliente.id}`);
  }

  return (
    <>
      <PageHeader
        title="Composición Corporal"
        description="Mediciones, evolución y reportes de tus clientes."
        actions={
          <div className="flex items-center gap-2">
            <Button href="/app/composicion-corporal/analitica" variant="outline" size="md">
              Analítica
            </Button>
            <Button onClick={() => setDialogoAbierto(true)}>Nuevo Cliente</Button>
          </div>
        }
      />

      {/* Zona 1 · Resumen — nunca oculto */}
      <Section label="Resumen" className="mb-8">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-4">
          <MetricCard label="Clientes activos" value={totalActivos} />
          <MetricCard label="Mediciones esta semana" value={medicionesEstaSemana} />
        </div>
      </Section>

      {/* Zona 2 · Buscador */}
      <Section label="Buscar cliente" className="mb-8">
        <div className="relative max-w-sm">
          <Search className="w-4 h-4 text-white/40 absolute left-4 top-1/2 -translate-y-1/2" strokeWidth={2} />
          <Input
            placeholder="Nombre del cliente…"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="pl-11"
            aria-label="Buscar cliente"
          />
        </div>
      </Section>

      {filtrados ? (
        <Section label={`Resultados (${filtrados.length})`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtrados.map((c) => (
              <ClienteCard key={c.id} cliente={c} enlaceActivo={enlaceActivoPorCliente[c.id]} />
            ))}
          </div>
        </Section>
      ) : (
        <>
          {/* Zona 3 · Clientes recientes */}
          {recientes.length > 0 && (
            <Section label="Actividad reciente" className="mb-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {recientes.map((c) => (
                  <ClienteCard key={c.id} cliente={c} enlaceActivo={enlaceActivoPorCliente[c.id]} />
                ))}
              </div>
            </Section>
          )}

          {/* Zona 4 · Lista completa */}
          <Section label={`Todos los clientes (${todos.length})`}>
            {todos.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center py-14 px-6">
                <p className="font-bold text-white text-sm mb-1">Todavía no tienes clientes</p>
                <p className="text-white/50 text-xs leading-relaxed max-w-xs mb-5">
                  Crea tu primer cliente para empezar a registrar su composición corporal.
                </p>
                <Button size="sm" onClick={() => setDialogoAbierto(true)}>
                  Crear el primer cliente
                </Button>
              </div>
            ) : resto.length === 0 ? (
              <p className="text-white/40 text-xs">Todos tus clientes activos aparecen arriba, en Actividad reciente.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {resto.map((c) => (
                  <ClienteCard key={c.id} cliente={c} />
                ))}
              </div>
            )}
          </Section>
        </>
      )}

      <Dialog open={dialogoAbierto} onOpenChange={setDialogoAbierto}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nuevo cliente</DialogTitle>
          </DialogHeader>
          <ClienteForm onCancel={() => setDialogoAbierto(false)} onSaved={handleClienteCreado} />
        </DialogContent>
      </Dialog>
    </>
  );
}
