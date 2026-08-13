---
modulo: 22
titulo: Modelo de conflictos
estado: congelado
sprint: NKB-2.0
---

# 22 · Modelo de conflictos

Qué es un conflicto, cómo se registra y por qué no se resuelve.

## Qué NO es un conflicto

Se aclara primero porque la mayoría de las diferencias entre normas **no** son
conflictos, y tratarlas como tales llenaría la base de alarmas falsas.

Dos normas que difieran en **cualquiera** de las cuatro coordenadas de identidad
—variable, método, población, estrato— simplemente son **normas distintas**.
Deben coexistir, y que sus valores difieran es lo esperable.

| Diferencia | ¿Conflicto? |
|---|---|
| Distinto método | No. Son normas distintas (`18`) |
| Distinta población | No (`17`) |
| Distinto estrato | No (`19`) |
| Distinta definición operacional de la variable | No: son variables distintas |
| Distinto tipo de norma | No (`15`) |

## Qué es un conflicto

> Dos normas que comparten **las cuatro coordenadas de identidad** y afirman
> cosas incompatibles.

Solo entonces. Es una situación poco frecuente y muy informativa: significa que
dos fuentes estudiaron lo mismo, del mismo modo, en la misma población, y no
coinciden.

---

## Tipos de conflicto

| Código | Tipo | Situación |
|---|---|---|
| **CF-1** | De valores | Mismas coordenadas, estadísticos incompatibles |
| **CF-2** | De clasificación | Mismas coordenadas, categorías con límites incompatibles |
| **CF-3** | De definición | Misma etiqueta de variable, definiciones operacionales incompatibles |
| **CF-4** | De estratificación | Mismas coordenadas, límites de estrato incompatibles |
| **CF-5** | De transcripción | Una fuente secundaria reproduce mal a la primaria |

**CF-3 no es realmente un conflicto entre normas: es un descubrimiento de que
las variables son distintas.** Se registra como conflicto para que quede visible,
y se resuelve separando las variables — que es lo único que la NKB puede hacer
sin elegir entre fuentes.

**CF-5 sí tiene resolución**, y es la única: prevalece la primaria (`20`, PR-05).
No se elige entre dos afirmaciones científicas, se corrige un error de copia.

---

## Cómo se registra

Un conflicto es un **hecho registrado**, no una anomalía a resolver. Se declara
en ambas normas implicadas (CN-39) y contiene:

| Elemento | Contenido |
|---|---|
| Normas implicadas | Las dos —o más— entradas |
| Tipo | CF-1 a CF-5 |
| En qué difieren | La discrepancia concreta, sin valorarla |
| Coordenadas compartidas | Las cuatro que las hacen comparables |
| Diferencias no coincidentes | Lo que sí difiere entre las fuentes, aunque no sea coordenada: año, muestreo, tamaño |
| Estado | Abierto o cerrado |

**Las diferencias no coincidentes son lo más útil del registro.** Suelen explicar
el conflicto: dos poblaciones idénticas sobre el papel pero separadas por veinte
años, o dos muestreos de naturaleza distinta. Registrarlas permite a un
consumidor decidir con criterio, que es exactamente lo que la NKB no puede hacer
por él.

## Lo prohibido

Recordatorio de NKB-ADR-04, ahora con las cinco formas concretas que adoptará la
tentación:

| Prohibido | Por qué |
|---|---|
| **Elegir la más reciente** | Supone que lo nuevo corrige lo viejo. No siempre |
| **Elegir la de mayor muestra** | Supone que el tamaño domina sobre el diseño. No siempre |
| **Elegir la de mejor calidad** | El nivel de calidad valora la evidencia, no arbitra entre hallazgos |
| **Promediar** | Produce una norma que ninguna fuente publicó, sobre una población que no existe |
| **Ponderar** | Igual, con un peso inventado encima |

Las cinco son **hipótesis sobre cuál fuente acierta**, y la NKB no dispone de
información para elegir entre ellas. Además, cualquiera de las cinco produce un
resultado que parece decidido cuando no lo está.

## Cierre de un conflicto

Un conflicto se cierra por **hechos**, no por criterio:

| Motivo de cierre | Qué ocurrió |
|---|---|
| Retractación | Una de las fuentes fue retirada formalmente |
| Corrección | Una fuente publicó una corrección que elimina la discrepancia |
| Separación | Se detectó que las coordenadas no eran realmente iguales (CF-3, CF-4) |
| Transcripción corregida | CF-5 resuelto contra la primaria |

**No existe el cierre «por decisión».** Un conflicto sin ninguno de estos hechos
permanece abierto indefinidamente, y eso es correcto: refleja el estado real del
conocimiento.

## Qué recibe el consumidor

Ambas normas, ambas vigentes, con el conflicto declarado.

**No existe una vista «sin conflictos».** Filtrarlos al publicar permitiría a un
motor consumir una de las dos sin saber que la otra existe — que es
precisamente esconder la incertidumbre.

Qué hacer con un conflicto es del NIE, que decidirá según su propio contrato y
responderá por ello.

## Lo que este módulo NO decide

- **Ningún criterio de preferencia**, ni siquiera como sugerencia.
- **Ninguna forma de agregar** dos normas en conflicto.
- **Ninguna política para el NIE** sobre qué hacer al encontrarse uno.
