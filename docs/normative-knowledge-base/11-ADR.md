---
modulo: 11
titulo: Decisiones arquitectónicas (ADR)
estado: congelado
---

# 11 · Decisiones arquitectónicas

Las decisiones que podrían haberse tomado de otra manera, con lo que se descartó
y qué cuesta cada una. Una decisión sin alternativa descartada no es una
decisión: es una descripción.

---

## NKB-ADR-01 · El sujeto es la variable, no la capacidad

**Contexto.** La NKB nace como respuesta a una necesidad del PAS. Lo cómodo
sería indexar las normas por capacidad funcional.

**Decisión.** El sujeto de una norma es una **variable medible**. La NKB no
conoce el concepto de capacidad.

**Alternativas descartadas.**

| Alternativa | Por qué no |
|---|---|
| Indexar por capacidad del PAS | El día que el BCS necesite valores de referencia habría que duplicar la base |
| Un campo «dominio» con valores del ecosistema | Mismo problema, disfrazado |
| Una NKB por dominio | Tres bases con tres criterios de calidad distintos |

**Consecuencias.** La correspondencia variable→capacidad se resuelve fuera, y
alguien tiene que mantenerla. A cambio, la misma base sirve para composición
corporal, laboratorio, nutrición y cualquier sistema futuro. Es la decisión de
la que cuelga la universalidad.

---

## NKB-ADR-02 · La NKB almacena; el NIE aplica

**Contexto.** Una sola pieza que guardara y aplicara sería más simple y más
rápida de construir.

**Decisión.** Separadas. La NKB publica; el NIE elige y responde.

**Alternativa descartada.** Un único módulo «normativo» que resolviera «dame la
norma de esta persona».

**Consecuencias.** Dos módulos que mantener y un contrato entre ellos. A cambio,
la elección de norma —que es donde se cometen los errores— queda a la vista y
puede auditarse, en vez de enterrada en la biblioteca.

---

## NKB-ADR-03 · El método forma parte de la identidad de la norma

**Contexto.** Podría tratarse como metadato del contexto, junto a otros.

**Decisión.** Es una de las cuatro coordenadas de identidad. Sin él, la norma no
se almacena.

**Alternativa descartada.** Método opcional, «cuando la fuente lo declare».

**Consecuencias.** Se rechazan normas que de otro modo entrarían. Se asume: la
misma variable medida por dos procedimientos produce dos distribuciones, y
mezclarlas es el error silencioso más frecuente de este terreno.

---

## NKB-ADR-04 · Un conflicto no se resuelve

**Contexto.** Dos normas con las mismas coordenadas y valores distintos. Hay que
devolver algo.

**Decisión.** Se devuelve **el conflicto**.

**Alternativas descartadas.** La más reciente; la de mayor muestra; la de mejor
calidad; el promedio.

**Consecuencias.** Es la decisión más incómoda del modelo, y es deliberada. Las
cuatro alternativas son hipótesis sobre cuál fuente acierta, y la NKB no dispone
de información para elegir. Además, un desempate a ciegas produce un resultado
que parece decidido cuando no lo está. Es el mismo criterio que el PAS congeló
en PAS-ADR-04.

---

## NKB-ADR-05 · Las clasificaciones son las de la fuente

**Contexto.** Cada publicación usa sus etiquetas. Un vocabulario común haría la
base mucho más usable.

**Decisión.** Se almacenan las etiquetas literales, sin traducir ni armonizar.

**Alternativa descartada.** Un vocabulario canónico al que mapear todas.

**Consecuencias.** El consumidor recibe vocabularios heterogéneos y tiene más
trabajo. A cambio, no se destruye la diferencia entre dos fuentes que usan la
misma palabra para tramos distintos — que es precisamente la información que un
vocabulario común borraría.

---

## NKB-ADR-06 · Se rechazan las normas de fabricante sin publicación

**Contexto.** Para varias variables, la única norma disponible viene impresa en
el informe del propio instrumento, ya calculada.

**Decisión.** Inadmisible sin publicación revisada por pares que la respalde.

**Alternativa descartada.** Admitirla señalando el conflicto de interés.

**Consecuencias.** Habrá variables sin norma admisible teniendo una a mano. Se
asume: el fabricante no publica muestra ni método, tiene interés en el
resultado, y admitirla llenaría la base de normas cómodas sin respaldo. Es la
misma exclusión que la PKB aplica a las fuentes comerciales, y por el mismo
motivo.

---

## NKB-ADR-07 · La NKB no contiene sujetos

**Contexto.** Guardar el valor medido junto a la norma permitiría entregar el
percentil ya resuelto.

**Decisión.** Ni un dato de ninguna persona.

**Alternativa descartada.** Una tabla de mediciones para acelerar la lectura.

**Consecuencias.** Toda aplicación exige juntar dos fuentes en tiempo de
consulta. A cambio, la NKB no maneja información personal, no necesita
protegerla y no puede filtrarla. Una biblioteca no tiene por qué saber quién la
consulta.

---

## NKB-ADR-08 · No se fija caducidad por antigüedad

**Contexto.** Una norma de hace treinta años puede no representar a la población
actual.

**Decisión.** La antigüedad se declara como **limitación**, nunca como motivo de
retirada. No se fija ningún umbral.

**Alternativa descartada.** Retirar automáticamente por encima de N años.

**Consecuencias.** Convivirán normas antiguas con otras nuevas y alguien tendrá
que juzgarlo. A cambio no se inventa un umbral que ninguna fuente documenta —
el mismo hueco que la PKB declaró para la vigencia de las pruebas.

---

## NKB-ADR-09 · Se reutiliza la escala de calidad del ecosistema

**Contexto.** La NKB gradúa un objeto distinto de lo que gradúan la CKB y la
PKB.

**Decisión.** Se adopta la misma escala de cinco niveles, con criterios propios
por fijar en el Sprint 2.

**Alternativa descartada.** Una escala propia adaptada a lo normativo.

**Consecuencias.** Los criterios de cada nivel no son trasladables entre bases y
hay que definirlos igual. A cambio, no existe un tercer vocabulario para decir
«cuánto respalda esto», que es lo que confundiría a quien lea dos informes del
mismo ecosistema.

---

## NKB-ADR-11 · Los niveles de calidad son cualitativos, no numéricos

**Contexto.** NKB-1 dejó los criterios de nivel para el Sprint 2. El encargo del
Sprint 2 prohíbe fijar umbrales sin fundamento metodológico. Son dos
instrucciones en tensión.

**Decisión.** Los cinco niveles se definen por **condiciones verificables**
—diseño del estudio, muestreo, reproducibilidad— y **ningún corte numérico**. La
suficiencia de una muestra se juzga contra el diseño del propio estudio y contra
el estrato concreto.

**Alternativas descartadas.**

| Alternativa | Por qué no |
|---|---|
| Umbrales de N por nivel | La N necesaria depende de la variabilidad de la variable y del uso. Ninguna fuente autoriza un número en abstracto |
| Puntuación agregada de calidad | Un número único oculta qué dimensión falló |
| Dejar los criterios para el Sprint 3 | Se fijarían con normas concretas delante, y se acomodarían a ellas |

**Consecuencias.** Graduar exige leer el estudio, no rellenar una casilla. A
cambio, no se inventa un umbral que parecería riguroso y sería arbitrario. Es la
misma renuncia que la PKB hizo con la vigencia.

**Relación con invariantes.** Sostiene I-06; añade contenido a `05` sin
redefinirlo.

---

## NKB-ADR-12 · El embudo tiene cinco niveles explícitos

**Contexto.** «Admisible» era binario en NKB-1. En la práctica una fuente falla
en momentos muy distintos, y decir solo «no cumple» pierde toda la información.

**Decisión.** Cinco niveles: fuente encontrada, verificada, evidencia admisible,
norma admisible, norma publicada. Toda evaluación registra en cuál se detuvo.

**Alternativa descartada.** Mantener el binario admitida / rechazada.

**Consecuencias.** Más estados que registrar. A cambio, un rechazo se convierte
en información accionable: «falta el método» permite retomar el trabajo, «no
cumple» obliga a repetirlo entero.

**Relación con invariantes.** Introduce I-15 y I-21.

---

## NKB-ADR-13 · Se separa la calidad de la norma de la confianza en la admisión

**Contexto.** Un solo eje de calidad mezclaba dos cosas: cuánto respalda la
evidencia, y cuánto tuvimos que interpretar al registrarla.

**Decisión.** Dos campos independientes y ambos obligatorios (CN-29 y CN-31).

**Alternativa descartada.** Un único nivel que absorbiera ambas.

**Consecuencias.** Un campo más en cada norma. A cambio queda visible el punto
donde alguien tuvo que deducir algo —el estrato leído del texto en vez de la
tabla—, que es exactamente donde se cometen los errores silenciosos.

**Relación con invariantes.** Hace operativo I-16.

---

## NKB-ADR-14 · El dato reconstruido no entra

**Contexto.** Muchas fuentes presentan sus valores solo en figuras, o publican
tablas incompletas. Leer del gráfico o estimar la celda ausente daría acceso a
normas que de otro modo se pierden.

**Decisión.** Solo entran datos explícitos (OR-1) o derivados con supuesto
sostenido por la fuente (OR-2). Lo reconstruido se rechaza y se declara.

**Alternativas descartadas.** Admitir la reconstrucción marcándola como tal;
admitirla degradando la calidad.

**Consecuencias.** Se pierden normas recuperables. Se asume porque un valor
aproximado se almacena con la misma apariencia de exactitud que uno publicado, y
esa apariencia no se corrige después con una etiqueta.

**Relación con invariantes.** Introduce I-17 e I-18.

---

## NKB-ADR-15 · La referencia es siempre la fuente primaria

**Contexto.** Las revisiones y guías localizan normas mucho mejor que la búsqueda
directa, y citarlas a ellas sería más cómodo y más rápido.

**Decisión.** La secundaria localiza; la referencia es la primaria. Si la
primaria no se recupera, la norma no entra.

**Alternativa descartada.** Admitir la secundaria como referencia cuando sea de
alta reputación.

**Consecuencias.** Recorrer la cadena cuesta trabajo, y algunas normas se
perderán porque su origen ya no existe. A cambio se corta el mecanismo por el
que las tablas de origen desconocido acaban pareciendo respaldadas por toda la
cadena que las cita.

**Relación con invariantes.** Introduce I-20; desarrolla I-10.

---

## NKB-ADR-16 · Cinco estados normativos en lugar de dos

**Contexto.** NKB-1 congeló vigente y retirada. No distinguen una objeción sin
resolver, una norma admitida bajo criterios anteriores ni una sustitución.

**Decisión.** Cinco: activa, cuestionada, pendiente de verificación, sustituida y
retirada.

**Alternativas descartadas.** Mantener dos; añadir además estados de preferencia
como «principal» o «recomendada».

**Consecuencias.** Más transiciones que gobernar. Los estados de preferencia se
descartan sin discusión: serían una elección, y la NKB no elige (I-09).

**Relación con invariantes.** Introduce I-22; desarrolla `06`.

---

## NKB-ADR-17 · Los criterios no se modifican para admitir una fuente

**Contexto.** Llegará un caso urgente en el que una norma haga mucha falta y no
cumpla por poco.

**Decisión.** El caso se registra como no cubierto y se eleva como propuesta de
cambio de criterios. Si los criterios cambian, cambian para todos, y las normas
ya admitidas pasan a pendientes de verificación.

**Alternativa descartada.** Una excepción documentada caso a caso.

**Consecuencias.** El proceso es lento justo cuando hay prisa. Se asume: una
excepción documentada sigue siendo una excepción, y la segunda cuesta menos que
la primera. Es la decisión que protege el sentido de todo el sprint.

**Relación con invariantes.** Introduce I-23.

---

## NKB-ADR-10 · Este sprint no almacena ni una norma

**Contexto.** Cargar unas pocas normas evidentes daría utilidad inmediata.

**Decisión.** Cero normas en v1.0.

**Alternativa descartada.** Un conjunto inicial «obvio», revisable después.

**Consecuencias.** La base no sirve para nada todavía. Se asume porque los
criterios de admisión y calidad se fijan mejor **sin** una norma concreta que se
quiera meter: en cuanto existe, los criterios se acomodan a ella. Es la misma
decisión que la PKB tomó al no fijar ninguna correspondencia en su Sprint 1
(PKB-ADR-06).
