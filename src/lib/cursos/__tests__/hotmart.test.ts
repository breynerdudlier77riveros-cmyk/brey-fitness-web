// ── Interpretar una notificación de Hotmart (Sprint CURSO-1) ───────────────
//
// Sin acceso a una cuenta real de Hotmart, estos payloads se arman a partir
// de la documentación pública (developers.hotmart.com, webhook 2.0.0) y de
// implementaciones reales publicadas que parsean el mismo formato — ver el
// comentario en `hotmart.ts` sobre por qué se prueban varias rutas.

import { describe, expect, it } from 'vitest';

import { interpretarEventoHotmart } from '../hotmart';

const COMPRA_APROBADA = {
  event: 'PURCHASE_APPROVED',
  id: 'evt-001',
  data: {
    product: { id: '987654', name: 'Sistema de Calistenia' },
    purchase: { transaction: 'HP12345678', status: 'APPROVED' },
    buyer: { email: 'Comprador@Ejemplo.com', name: 'Ana' },
  },
};

describe('interpretarEventoHotmart · compra aprobada', () => {
  it('CONTROL POSITIVO · extrae email, producto e id de evento', () => {
    const e = interpretarEventoHotmart(COMPRA_APROBADA);
    expect(e.categoria).toBe('otorga_acceso');
    expect(e.email).toBe('comprador@ejemplo.com'); // en minúsculas
    expect(e.productoId).toBe('987654');
    expect(e.idEvento).toBe('evt-001');
    expect(e.eventoCrudo).toBe('PURCHASE_APPROVED');
  });

  it('sin `id` de nivel superior, usa la transacción de la compra', () => {
    const sinIdTop = { ...COMPRA_APROBADA };
    delete (sinIdTop as { id?: string }).id;
    const e = interpretarEventoHotmart(sinIdTop);
    expect(e.idEvento).toBe('HP12345678');
  });
});

describe('interpretarEventoHotmart · revocación de acceso', () => {
  it.each(['PURCHASE_CANCELED', 'PURCHASE_REFUNDED', 'PURCHASE_CHARGEBACK', 'PURCHASE_EXPIRED'])(
    '%s revoca',
    (evento) => {
      const e = interpretarEventoHotmart({ ...COMPRA_APROBADA, event: evento });
      expect(e.categoria).toBe('revoca_acceso');
    },
  );

  it.each(['SUBSCRIPTION_CANCELLATION', 'SUBSCRIPTION_CANCELED'])('%s también revoca', (evento) => {
    const e = interpretarEventoHotmart({ ...COMPRA_APROBADA, event: evento });
    expect(e.categoria).toBe('revoca_acceso');
  });
});

describe('interpretarEventoHotmart · rutas alternativas del comprador', () => {
  it('lee `data.shopper.email` si no hay `data.buyer`', () => {
    const e = interpretarEventoHotmart({
      event: 'PURCHASE_APPROVED',
      data: { shopper: { email: 'x@y.com' } },
    });
    expect(e.email).toBe('x@y.com');
  });

  it('lee `data.subscriber.email` para eventos de suscripción', () => {
    const e = interpretarEventoHotmart({
      event: 'SUBSCRIPTION_REACTIVATED',
      data: { subscriber: { email: 'x@y.com' } },
    });
    expect(e.email).toBe('x@y.com');
    expect(e.categoria).toBe('otorga_acceso');
  });

  it('sin ningún email reconocible, `email` es null — no se inventa uno', () => {
    const e = interpretarEventoHotmart({ event: 'PURCHASE_APPROVED', data: {} });
    expect(e.email).toBeNull();
  });
});

describe('interpretarEventoHotmart · robustez', () => {
  it('un payload vacío no lanza, y no otorga ni revoca', () => {
    const e = interpretarEventoHotmart({});
    expect(e.categoria).toBe('sin_accion');
    expect(e.email).toBeNull();
    expect(e.productoId).toBeNull();
  });

  it('un evento que Hotmart no documenta hoy no se asume ni a favor ni en contra', () => {
    const e = interpretarEventoHotmart({ event: 'ALGO_NUEVO_QUE_NO_EXISTE_TODAVIA' });
    expect(e.categoria).toBe('sin_accion');
  });

  it('null o un tipo inesperado no lanza', () => {
    expect(() => interpretarEventoHotmart(null)).not.toThrow();
    expect(() => interpretarEventoHotmart('texto')).not.toThrow();
    expect(() => interpretarEventoHotmart(42)).not.toThrow();
    expect(interpretarEventoHotmart(null).categoria).toBe('sin_accion');
  });
});
