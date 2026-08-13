---
modulo: 04
titulo: Invariantes, casos de prueba y hallazgos
sprint: NIE-1.3 + NIE-1.4
---

# 04 · Invariantes y casos

## Los quince invariantes

Congelados. Cada uno tiene al menos un test que falla si se rompe.

| # | Invariante |
|---|---|
| **I-01** | El contexto de entrada no admite el valor medido del sujeto |
| **I-02** | El motor es puro: sin ficheros, fecha, azar, red ni consola |
| **I-03** | El motor no importa el adaptador que lee la NKB |
| **I-04** | El NIE no duplica las 356 normas ni contiene valores codificados |
| **I-05** | Las coordenadas se declaran por ficha y deben coincidir con su campo CN |
| **I-06** | La aplicabilidad no se puntúa |
| **I-07** | Las dimensiones son independientes entre sí |
| **I-08** | Una incompatibilidad real se evalúa antes que la falta de información |
| **I-09** | ES-2 permanece visible y propaga su advertencia |
| **I-10** | Calidad y aplicabilidad son ejes independientes |
| **I-11** | Con varias aplicables, el motor las devuelve todas |
| **I-12** | «Sin norma admisible» nunca significa «fuera de lo normal» |
| **I-13** | EQ-3 impide asumir equivalencia entre instrumentos |
| **I-14** | No se convierten unidades |
| **I-15** | No se clasifica al sujeto |

### Dos añadidos en este sprint

| # | Invariante |
|---|---|
| **I-16** | El valor normativo se transporta; no se crea, modifica, convierte ni interpola |
| **I-17** | El motor no descubre conflictos: solo propaga los que la NKB declara |

---

## Casos de prueba

**134 tests** del NIE, en cuatro ficheros.

### `cargador.test.ts` · el adaptador refleja la NKB

Recuento contra la auditoría: 356 normas, 15 fichas, 0 ids duplicados, 29 en
ES-2, reparto de calidad 0/332/24, tres unidades sin convertir. Más la
comprobación de que **cada coordenada declarada aparece literalmente en el
campo CN del que dice proceder**.

### `casos.test.ts` · los diez casos de NIE-1.1 + NIE-1.2

Colombiano de 20, de 45 y de 75 años; instrumento incompatible; unidad
incompatible; sexo incompatible; instrumento ausente; norma ES-2; dos normas;
calidad frente a aplicabilidad.

### `conjunto.test.ts` · los quince casos de NIE-1.3 + NIE-1.4

Los del listado obligatorio, más: contrato de resultado con valores y
trazabilidad, no reducción arbitraria, TN-1 frente a TN-2, las cuatro colisiones
de instrumento, matriz de diferencias, y el caso ENSIN completo.

### `pureza.test.ts` · lo que el motor no puede hacer

Pureza, prohibiciones sobre el código fuente, ausencia de valores codificados,
no reordenación, determinismo y **la auditoría de vocabulario**.

---

## La auditoría de vocabulario

Distingue dos cosas que se confunden con facilidad:

| | Ejemplo | Veredicto |
|---|---|---|
| **Vocabulario del motor** | `estadoGlobal`, advertencias, motivos de dimensión | Se audita: no puede emitir juicio |
| **Vocabulario de las fuentes** | Limitaciones y advertencias de las fichas | Se transporta intacto |

La ficha de Cúcuta menciona las categorías *deficiente… excelente* que la NKB
rechazó (RN-04). **Que el motor las transporte sin tocarlas es lo correcto**;
lo que no puede es escribirlas él.

La búsqueda de las diez palabras de clasificación —*normal, anormal, bajo,
alto, deficiente, insuficiente, riesgo, adecuado, malo, bueno*— se hace sobre el
texto que redacta el motor, **descontando las negaciones**: una frase como «el
mejor intento y el promedio no son equivalentes» no es un juicio sobre nadie.

> Dos versiones anteriores de este test buscaban las palabras en la salida
> serializada completa. Fallaban por prosa legítima de las fichas. La lección
> quedó en el diseño: **auditar quién escribe, no qué aparece.**

---

## Casos rechazados

Comportamientos que se consideraron y **no** se implementaron:

| Rechazado | Motivo |
|---|---|
| Ordenar candidatas por calidad | Sería elegir con otro nombre |
| Devolver «la mejor» junto a las demás | Ídem, y más engañoso por parecer informativo |
| Puntuación de aplicabilidad 0–100 | Mezclaría preguntas distintas en un número que no responde ninguna |
| Marcar conflicto al ver valores distintos | El motor no descubre conflictos (`22`) |
| Convertir lbf a kg para poder comparar | La capa de conversión no existe y no se improvisa |
| Calcular percentiles desde L, M y S | Derivación OR-3 que `21` no permite |
| Rellenar la posición alemana con «de pie» | Lo que no consta no se rellena |

---

## Hallazgos sobre la NKB

Registrados, no corregidos en silencio.

### H-01 · Las fichas alemanas no declaran la posición corporal

| | |
|---|---|
| **Archivo** | `fichas/HGS-DE-TN2-media-dispersion.md`, `fichas/HGS-DE-TN1-mediana.md` |
| **Campo** | CN-08 |
| **Evidencia** | Dicen «dos mediciones por mano; se registra el máximo de ambas manos», y nada sobre postura. CN-33 ya lo admitía: «protocolo incompleto» |
| **Impacto** | La dimensión `posicion` da **NO_DETERMINABLE** frente a cualquier medición cuya posición sí se conozca |
| **Estado** | **Corregido en `39`**, que afirmaba «Alemania y Colombia miden de pie». Era una inferencia, no un dato de la fuente |

Detectado en NIE-1.1, cuando el adaptador intentó comparar la posición y no
encontró qué comparar.

**No se han encontrado hallazgos nuevos en NIE-1.3 ni NIE-1.4.**
