---
modulo: 23
titulo: Estados normativos, retirada y sustitución
estado: congelado
sprint: NKB-2.0
---

# 23 · Estados normativos, retirada y sustitución

NKB-1 congeló dos estados —vigente y retirada— suficientes para el modelo. Este
módulo los desarrolla y añade **solo** los que protegen situaciones reales que
aquellos dos no distinguen.

## Los cinco estados

Excluyentes. No hay un sexto.

| Código | Estado | Puede aplicarse | Significado |
|---|---|---|---|
| **ES-1** | Activa | Sí | Admitida y sin objeciones registradas |
| **ES-2** | Cuestionada | Sí, con advertencia | Hay una objeción registrada y sin resolver |
| **ES-3** | Pendiente de verificación | **No** | Admitida bajo criterios anteriores; falta reevaluarla |
| **ES-4** | Sustituida | **No** | Otra norma la reemplaza; conserva su historia |
| **ES-5** | Retirada | **No** | No puede aplicarse por un motivo declarado |

### Por qué estos y no más

Cada uno responde a una situación que los demás no cubren:

- **ES-2** existe porque «hay una duda» y «no sirve» no son lo mismo. Retirar
  ante la primera objeción perdería normas válidas; ignorarla las usaría a
  ciegas.
- **ES-3** existe porque los criterios evolucionan (CN-38). Sin él, una norma
  admitida bajo criterios laxos seguiría aplicándose como si cumpliera los
  actuales.
- **ES-4** y **ES-5** se separan porque sustituir no es invalidar: una norma
  sustituida pudo ser correcta con la evidencia de su momento.

**No se añaden estados como «preferente», «recomendada» o «principal».** Serían
una elección, y la NKB no elige (I-09).

---

## Transiciones

| Desde | Hacia | Cuándo |
|---|---|---|
| Activa | Cuestionada | Se registra una objeción |
| Activa | Pendiente de verificación | Cambian los criterios de admisión |
| Activa | Sustituida | Entra una norma que la reemplaza |
| Activa | Retirada | Concurre un motivo de retirada |
| Cuestionada | Activa | La objeción se resuelve a favor |
| Cuestionada | Retirada | La objeción se confirma |
| Pendiente | Activa | Se reevalúa y cumple |
| Pendiente | Retirada | Se reevalúa y no cumple |
| Sustituida | — | **Terminal** |
| Retirada | — | **Terminal** |

**Los dos estados terminales no vuelven.** Si una norma retirada recupera
validez, entra como **entrada nueva** con su propia traza. Una entrada que va y
viene haría imposible reconstruir qué estaba vigente en un momento dado.

---

## Motivos de retirada

La lista es cerrada (heredada de `06`), con su comprobación:

| Motivo | Cómo se comprueba |
|---|---|
| La publicación fue retractada | Aviso formal de la editorial |
| Incumple un criterio de admisión | Reevaluación contra `13` |
| La fuente resultó no localizable | El localizador dejó de resolver y no hay alternativa |
| Fue sustituida por una entrada corregida | Existe la nueva entrada |
| La fuente publicó una corrección de valores | Aviso formal de corrección |

### Lo que NO es motivo de retirada

| No retira | Por qué |
|---|---|
| **La antigüedad** | Se declara como limitación, no como causa (NKB-ADR-08) |
| **Que exista una norma más reciente** | Coexisten, salvo sustitución explícita |
| **Que su calidad sea baja** | Baja calidad es información, no exclusión |
| **Que resulte incómoda** para un producto | No es un criterio |
| **Que esté en conflicto** con otra | El conflicto se declara, no se poda (`22`) |

---

## Sustitución

Una norma sustituye a otra **solo** cuando comparte sus cuatro coordenadas de
identidad y procede de una corrección o de una edición posterior de la misma
fuente.

> **Dos normas de fuentes distintas nunca se sustituyen entre sí.** Coexisten, y
> si son incompatibles, están en conflicto (`22`).

Es la distinción que impide que «sustitución» se convierta en la puerta trasera
por la que se elige entre fuentes.

### Procedimiento

1. La anterior pasa a **ES-4 · Sustituida**, con fecha y motivo.
2. La nueva entra como entrada independiente, con su traza completa.
3. La relación queda registrada **en ambas** (CN-40).
4. La versión de la base avanza (`06`).

La anterior **no se marca como incorrecta**. Se declara sustituida.

---

## Reconstrucción histórica

Toda norma retirada o sustituida debe permitir responder, en cualquier momento:

| Pregunta | Dónde se responde |
|---|---|
| ¿Qué norma existía? | La entrada, que nunca se borra |
| ¿Desde cuándo y hasta cuándo? | Fechas de incorporación y de cambio de estado |
| ¿Por qué cambió? | Motivo registrado en la transición |
| ¿Qué la sustituyó, si algo lo hizo? | Relación de sustitución (CN-40) |
| ¿Quién decidió el cambio? | Traza (`24`) |

**Ninguna norma se borra y ningún cambio es silencioso.** Un consumidor que
aplicó una norma hace seis meses debe poder averiguar qué aplicó exactamente.

## Vigencia

Se congela porque el término es ambiguo y peligroso:

> **«Vigente» significa que la NKB permite aplicarla, no que siga
> representando a la población actual.**

Lo segundo es una cuestión de aplicabilidad que depende de la población, el
método y el contexto — y la juzga el consumidor con lo que la norma declara. La
NKB no calcula vigencia y no fija caducidad.

## Lo que este módulo NO decide

- **Ninguna política de revisión periódica** de la base.
- **Ningún plazo** para reevaluar normas en ES-3.
- **Ninguna preferencia** entre una norma activa y otra cuestionada.
