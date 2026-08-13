---
modulo: 13
titulo: Criterios de admisión
estado: congelado
sprint: NKB-2.0
---

# 13 · Criterios de admisión

La puerta de la NKB. Este módulo responde una sola pregunta, y debe poder
responderla otra persona sin consultar a nadie:

> **¿Esta fuente puede producir una norma admisible?**

Y su corolario: **¿qué falta para admitirla?**

---

## El embudo · cinco niveles

Un documento no se convierte en norma de golpe. Atraviesa cinco niveles, y cada
uno responde una pregunta distinta. Confundirlos es el error que llena una
biblioteca normativa de material inutilizable.

| Nivel | Nombre | Pregunta que supera | Estado si se queda aquí |
|---|---|---|---|
| **E-1** | Fuente encontrada | ¿Existe un documento? | Localizada |
| **E-2** | Fuente verificada | ¿Es este documento realmente lo que dice ser? | Verificada |
| **E-3** | Evidencia admisible | ¿Su naturaleza y procedencia son aceptables? | Admisible como evidencia |
| **E-4** | Norma admisible | ¿Contiene una norma completa y recuperable? | Admisible como norma |
| **E-5** | Norma publicada | ¿Está incorporada con su traza y su calidad? | Publicada en la NKB |

**Cada nivel es condición del siguiente y ninguno se salta.** Una fuente puede
detenerse en cualquiera, y detenerse no es un fallo: es un resultado, y se
registra como tal (`24`).

### E-1 · Fuente encontrada

Existe un documento que alguien afirma que contiene una norma.

No supone nada. Una tabla circulando sin autor está en E-1.

### E-2 · Fuente verificada

El documento se localizó y se comprobó que es lo que dice ser: su título, su
publicación, su año y su localizador coinciden con lo declarado.

**Verificar no es haberlo visto citado.** Una referencia que solo aparece en la
bibliografía de otro documento sigue en E-1 (`20`).

### E-3 · Evidencia admisible

La naturaleza de la fuente es aceptable (`19`) y su procedencia es trazable
hasta el estudio que produjo los datos.

Aquí caen las exclusiones categóricas: fabricante sin publicación, material
comercial, contenido sin autoría atribuible.

### E-4 · Norma admisible

El documento contiene una norma **completa**: las cuatro coordenadas de
identidad, el tipo de distribución, los estadísticos recuperables y las
limitaciones que la propia fuente declara.

Es el nivel que más fuentes pierde. Un artículo excelente puede no contener una
norma admisible porque no publica su método, o porque los valores solo aparecen
en una figura.

### E-5 · Norma publicada

Incorporada a la NKB con su traza (`24`), su calidad (`16`) y su estado (`23`).

---

## Los ocho criterios de admisión

Se comprueban en este orden. **El primero que falla detiene el proceso** y fija
el nivel del embudo en el que la fuente se queda.

| Código | Criterio | Nivel que desbloquea |
|---|---|---|
| **CA-01** | La fuente es localizable e identificable | E-2 |
| **CA-02** | La naturaleza de la fuente es admisible | E-3 |
| **CA-03** | La procedencia del dato normativo es trazable hasta su origen | E-3 |
| **CA-04** | La variable tiene definición operacional | E-4 |
| **CA-05** | El método está descrito de forma identificable | E-4 |
| **CA-06** | La población está definida por criterios, no solo por etiqueta | E-4 |
| **CA-07** | El tipo de distribución y sus estadísticos son recuperables | E-4 |
| **CA-08** | Las limitaciones declaradas por la fuente constan | E-4 |

### CA-01 · Localizable e identificable

Debe existir un localizador estable —identificador persistente, registro de
repositorio o dirección estable— que permita a un tercero llegar al mismo
documento.

*No cumple:* una tabla sin autor; una captura de pantalla; un documento cuyo
localizador no resuelve.

### CA-02 · Naturaleza admisible

La categoría de la fuente está entre las aceptadas (`19`).

*No cumple:* material comercial, documentación de instrumento sin publicación
que la respalde, contenido de divulgación, texto generado por un modelo de
lenguaje.

### CA-03 · Procedencia trazable

Si el documento reproduce una norma de otro, debe poder llegarse al original.
Una fuente secundaria localiza; no sustituye (`20`).

*No cumple:* una revisión que cita una tabla cuyo estudio original no aparece o
no es recuperable.

### CA-04 · Definición operacional de la variable

Debe constar **qué se midió exactamente**, no solo cómo se llama. Dos estudios
pueden usar el mismo nombre para magnitudes distintas.

*No cumple:* una variable nombrada sin decir qué comprende.

### CA-05 · Método identificable

Suficiente para saber si un valor medido de otra manera es comparable (`18`).

*No cumple:* «se midió con el protocolo habitual».

### CA-06 · Población definida

Criterios de inclusión y, cuando la fuente los declare, de exclusión (`17`).

*No cumple:* «deportistas», «adultos sanos», sin nada más.

### CA-07 · Estadísticos recuperables

Los valores deben estar **explícitos y legibles**. Si solo aparecen en una
figura y no se pueden recuperar con fidelidad, no cumple (`21`).

*No cumple:* una tabla incompleta; valores que hay que leer de un gráfico.

### CA-08 · Limitaciones declaradas

Lo que la propia fuente reconoce sobre su alcance. Que una fuente no declare
ninguna es en sí un dato, y se registra como tal.

---

## Qué NO es criterio de admisión

Se congela porque son las cuatro presiones que más van a intentar entrar.

| No es criterio | Por qué |
|---|---|
| **El prestigio del emisor** | Se evalúa la evidencia concreta, no la institución. Una sociedad científica puede publicar un documento que no contenga norma admisible |
| **La antigüedad** | Ni a favor ni en contra. La vigencia es otra cosa (`23`) |
| **El tamaño muestral** | Se registra y se evalúa (`16`), pero no hay umbral de entrada. No existe fundamento para fijar uno en abstracto |
| **La utilidad para el producto** | Que una norma haga falta no la hace admisible. Es la presión más peligrosa y la razón de que estos criterios se congelen antes de existir ninguna norma |

## Resultado de la evaluación

Toda fuente evaluada produce exactamente uno de estos resultados, y **todos se
registran**, incluidos los negativos:

| Resultado | Significa |
|---|---|
| **Admitida** | Alcanzó E-5 |
| **Detenida en E-n** | Superó hasta ese nivel; se declara qué criterio falló |
| **Rechazada por naturaleza** | Falló CA-02: no volverá a evaluarse salvo que aparezca publicación que la respalde |

Registrar los rechazos no es burocracia: sin ese registro, dentro de seis meses
alguien reevaluará la misma fuente, o peor, la incorporará sin saber que ya se
descartó (`24`).

## Lo que este módulo NO decide

- **Ninguna fuente concreta.** Ni una, de ningún dominio.
- **Ningún umbral numérico.**
- **Ningún orden de preferencia** entre fuentes que cumplan todos los criterios.
