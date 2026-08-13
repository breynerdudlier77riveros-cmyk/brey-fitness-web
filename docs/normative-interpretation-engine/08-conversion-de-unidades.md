---
modulo: 08
titulo: Capa explícita de conversión de unidades
sprint: NIE-1.5
---

# 08 · Conversión de unidades

## La frase que ordena todo el módulo

> **Unidad compatible ≠ método compatible.**
>
> **Conversión de unidad ≠ resolución de EQ-3.**

Convertir cambia **cómo se escribe** una magnitud. No cambia el instrumento, el
protocolo, la posición, la definición operacional, la población, el tipo de
norma, la calidad, el estado ni la aplicabilidad.

El riesgo real de esta capa no es equivocarse en un factor. Es que alguien lea
«unidades ya unificadas» como «normas ya comparables».

---

## Qué se autoriza, y por qué tan poco

Tres unidades, seis pares posibles. **Uno autorizado.**

| Par | Estado | Motivo |
|---|---|---|
| **kgf ↔ lbf** | ✅ **AUTORIZADO** | Ambas miden **fuerza**. Factor exacto |
| kg ↔ kgf | ❌ NO AUTORIZADO | Masa frente a fuerza |
| kg ↔ lbf | ❌ NO AUTORIZADO | Ídem |

Los seis pares están **declarados**, también los prohibidos: un par ausente
sería indistinguible de un olvido, y aquí no puede haber olvidos.

### Por qué kgf ↔ lbf sí

```
1 kgf = 9,80665 N                    gravedad estándar, exacta por definición
1 lbf = 0,45359237 × 9,80665 N       libra avoirdupois, exacta desde 1959

kgf → lbf = 9,80665 / (0,45359237 × 9,80665) = 1 / 0,45359237
```

**La gravedad se cancela.** El factor queda como el recíproco exacto de la libra
avoirdupois: `2,204622621848776`. No es una medida, es una definición.

### Por qué kg ↔ kgf no

Dos razones independientes, y basta cualquiera:

**1 · Física.** El kilogramo mide masa; el kilogramo-fuerza, fuerza. Son
dimensiones distintas. Pasar de una a otra exige multiplicar por la gravedad,
que no es un factor de conversión de unidades sino una constante física.

**2 · Doctrina congelada.** `39` ya decidió:

> «Aunque numéricamente coincidan en la práctica de la dinamometría, se
> registran como las publica cada fuente. Igualarlas sería una decisión nuestra
> sobre la equivalencia de dos magnitudes, y no nos corresponde tomarla.»

Y el dato que lo cierra: **ninguna fuente de la NKB declara que su «kg»
signifique «kgf»**. Convertir exigiría suponerlo.

> Es tentador: 176 normas están en kg y 156 en kgf, y unificarlas parecería
> ampliar mucho lo utilizable. No lo haría — las normas en kg y las normas en
> kgf están además en EQ-3 entre sí. Se ganaría representación numérica y cero
> comparabilidad.

---

## La tabla es cerrada

No se añade una unidad porque sea matemáticamente convertible. **N, lb, oz y g
no existen en esta capa**, porque no existen en la NKB.

Un par no declarado no se convierte: devuelve `NO_AUTORIZADA` con ese motivo.

Todos los factores viven en `conversiones.ts` y **en ningún otro sitio**. Un
test recorre los once ficheros del motor y comprueba que `0.45359237` y
`9.80665` solo aparecen ahí.

---

## Inmutabilidad

El resultado **nunca sustituye** el original:

```
ValorConvertido
├── valorOriginal          ─┐ siempre presentes
├── unidadOriginal         ─┘
├── valorConvertido         resultado aritmético completo
├── unidadDestino
├── representacion          redondeado a los decimales del original
├── decimalesOriginales
├── operacion               CONVERSION_UNIDAD · IDENTIDAD
├── trazabilidad            factor · exacto · definición · referencia
└── advertencia             la metodológica, siempre
```

Convertir a la misma unidad devuelve `IDENTIDAD` con factor 1 — también con su
estructura completa, para que el consumidor no tenga dos formas distintas de
leer el resultado.

---

## Precisión · sin inventar resolución

`30,7 kgf` convertido da `67,68189…` lbf. Presentarlo así afirmaría que la
fuente midió con cinco decimales, y midió con uno.

| Campo | Valor | Para qué |
|---|---|---|
| `valorConvertido` | 67,68189… | **Volver a convertir.** Redondear dos veces pierde información |
| `representacion` | 67,7 | **Mostrar.** Respeta la resolución del original |

Reversibilidad comprobada sobre 60 valores: `kgf → lbf → kgf` devuelve el
original con 10 decimales de tolerancia, y los dos factores son recíprocos
exactos.

### Una limitación conocida

`decimalesDe(30.70)` devuelve 1, no 2: en coma flotante el cero final ya se
perdió antes de llegar aquí. **La precisión declarada por una fuente vive en su
ficha, no en un `number`.**

---

## La capa no se aplica sola

Es lo más importante después de la tabla.

| | |
|---|---|
| ¿`UNIT_MISMATCH` sigue bloqueando la aplicabilidad? | **Sí** |
| ¿La resolución convierte automáticamente? | **No** |
| ¿Existe una opción `autoConvert`? | **No, y no debe existir** |
| ¿Algún módulo del motor importa esta capa? | **No.** Hay un test que lo comprueba |

Convertir es **una decisión externa que debe declararse**. La capa ofrece el
mecanismo; usarlo es responsabilidad de quien lo llame, y queda registrado en
su código, no escondido en la biblioteca.

### La demostración

Brasil publica en kgf y Chile en lbf: el par **está autorizado**. Y aun así, con
la unidad ya unificada, sus normas siguen siendo **NO_APLICABLE** entre sí —
distinto instrumento, distinta población, distinta definición operacional.

> Es exactamente el punto del módulo, comprobado con datos reales: unificar la
> unidad no acercó las normas ni un milímetro.

---

## Invariantes añadidos

| # | Invariante |
|---|---|
| **I-23** | Toda conversión conserva valor y unidad originales |
| **I-24** | Los factores viven en un único módulo declarativo |
| **I-25** | La tabla es cerrada: lo no declarado no se convierte |
| **I-26** | Una conversión nunca resuelve una relación EQ-3 |
| **I-27** | La capa no se aplica automáticamente en ningún punto del motor |

---

## Estado de la NKB

**Cero conversiones.** Los valores almacenados no cambiaron: la ficha chilena
sigue publicando en lbf y la brasileña en kgf, comprobado por test.

Esta capa convierte **valores en tránsito**, nunca la biblioteca.

---

## Limitaciones

- **Un solo par autorizado**, y conecta dos poblaciones que de todos modos no
  son comparables. Su utilidad práctica hoy es baja, y eso es honesto.
- **kg queda aislado**: 176 normas que no se pueden convertir a nada.
- Desbloquear kg exigiría que alguna fuente declarara qué magnitud reporta, o
  una decisión de proyecto que `39` deliberadamente no tomó. **No es trabajo de
  ingeniería: es una decisión científica pendiente.**
