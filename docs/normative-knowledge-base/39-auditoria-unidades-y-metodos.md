---
modulo: 39
titulo: Auditoría de unidades, instrumentos y métodos
estado: v1.0
sprint: NKB-3.5
---

# 39 · Unidades y métodos

---

## Parte I · Unidades

### Estado

| Unidad | Fichas | Normas | Fuentes |
|---|---|---|---|
| **kg** · kilogramos | 7 | 176 | Alemania, Colombia ×3 |
| **kgf** · kilogramo-fuerza | 6 | 156 | Brasil |
| **lbf** · libras-fuerza | 2 | 48 | Chile |

**Conversiones realizadas: 0.** Comprobado leyendo CN-06 de las quince fichas:
ninguna mezcla dos unidades y ninguna publica un valor que la fuente no
publicara en esa unidad.

### kg y kgf no se tratan como la misma unidad

Aunque numéricamente coincidan en la práctica de la dinamometría, **se
registran como las publica cada fuente**. Igualarlas sería una decisión nuestra
sobre la equivalencia de dos magnitudes, y no nos corresponde tomarla.

### El contrato de detección de unidad

El NIE debe poder detectar la desigualdad **sin que la NKB convierta nada**:

| Lo que la NKB expone | Lo que el NIE puede concluir |
|---|---|
| `CN-06` de la norma | La unidad en que están sus valores |
| La unidad de la medición que recibe | La unidad del sujeto |
| — | Si coinciden o **no coinciden** |

Y ahí se detiene la NKB. Si no coinciden, el resultado es
**NO_DETERMINABLE**, no una conversión.

> Convertir es una operación con supuestos: qué factor, con cuántos decimales,
> con qué redondeo, y si la magnitud es realmente la misma. Esos supuestos deben
> vivir en una **capa explícita y auditable**, nunca dentro de una biblioteca de
> evidencia.

**Esa capa no existe y este sprint no la crea.**

### Un caso real que demuestra por qué

`martinez_torres_hgs_colombia_2022` compara sus valores con los chilenos de
`gomez_campos_hgs_chile_2018`, que están publicados en **lbf**. Para poder
compararlos, **los convirtió a kg**.

Comprobamos esa conversión contra nuestra propia transcripción:

| | Varones 6 años | 12 años | 17 años |
|---|---|---|---|
| Nuestro P50 en lbf | 20,4 | 49,5 | 93,7 |
| Convertido a kg | 9,3 | 22,5 | 42,5 |
| Lo que publica Martínez-Torres | 9,3 | 22,4 | 42,5 |

**Coincidencia dentro de ±0,1 kg en las 24 celdas**, atribuible al redondeo.

De aquí salen dos conclusiones distintas:

1. **Verificación independiente de nuestra transcripción chilena.** Un tercero
   leyó la misma tabla, la convirtió y llegó a los mismos números.
2. **Y aun así, esos valores en kg no entran en la NKB.** Son una conversión
   hecha por un tercero para comparar, con su propio redondeo. La ficha chilena
   sigue en lbf, que es como su fuente los publicó.

> Tener delante los valores convertidos, verificados y coincidentes **no es
> motivo para adoptarlos**. La NKB guarda lo publicado, no lo conveniente.

---

## Parte II · Instrumentos

### Los seis instrumentos de la base

| Instrumento | Tipo | Fabricante | Fichas | Unidad |
|---|---|---|---|---|
| **Takei TKK 5101** | Digital | Takei Scientific, Tokio | `HGS-CO-TN1` | kg |
| **Takei T-18 TKK SMEDLY III** | Analógico, mango ajustable | Takei Scientific, Niigata | `HGS-CO-UNI-*` | kg |
| **Camry** digital | Digital, mango ajustable | GENERAL ASDE, España | `HGS-CO-CUC-*` | kg |
| **JAMAR PC-5030 J1** | Hidráulico | Fred Sammons, Illinois | `HGS-CL-*` | lbf |
| **JAMAR J00105** | Hidráulico | Lafayette Instruments | `HGS-BR-*` | kgf |
| **Smedley S** | Mecánico | Tokio | `HGS-DE-*` | kg |

### Tres colisiones de nombre que NO son equivalencias

Este es el motivo por el que el módulo existe.

| Colisión | Por qué no son el mismo método |
|---|---|
| **Takei ≠ Takei** · TKK 5101 vs T-18 SMEDLY III | Uno es **digital** y el otro **analógico de mango ajustable**. Protocolos distintos: brazo extendido lateralmente frente a brazos paralelos con el índice a 90°. Poblaciones distintas |
| **JAMAR ≠ JAMAR** · PC-5030 J1 vs J00105 | Modelos y fabricantes distintos —Fred Sammons y Lafayette—. Uno se mide con el brazo libre en sedestación con 2 intentos por mano; el otro con el codo a 90° pegado a la silla y 3 repeticiones. **Y publican en unidades distintas: lbf y kgf** |
| **Smedley ≠ Smedley** · Smedley S vs TKK SMEDLY III | Comparten el principio mecánico y el nombre histórico del diseño. Distinto fabricante, distinto modelo, distinto país, distinto protocolo |

**Ninguna de las tres se ha declarado equivalente.** Las seis parejas posibles
entre los seis instrumentos están en **EQ-3 · distintos**, que es la relación
por defecto de `18`.

### Equivalencias declaradas en cinco sprints

| Relación | Veces usada |
|---|---|
| **EQ-3 · distintos** | **Todas** |
| EQ-2 | 0 |
| EQ-1 · equivalentes | 0 |

**Cero equivalencias inventadas.** Y cero declaradas, porque `18` exige
evidencia publicada de equivalencia y no se ha buscado ninguna: sin ella, EQ-3
es el estado correcto, no un estado provisional.

> Una fuente de la base —`vivas_diaz_hgs_universitarios_2016`— advierte
> expresamente de que «se ha descrito sesgo sistemático al comparar
> dinamómetros distintos». Es evidencia **a favor** de EQ-3, no en contra.

---

## Parte III · El método completo

El método no es el aparato. `18` lo define como el procedimiento, y la base lo
registra en seis componentes:

| Componente | Campo | Ejemplo de por qué importa |
|---|---|---|
| Instrumento y modelo | CN-07 | Digital, analógico o hidráulico dan lecturas distintas |
| Posición corporal | CN-08 | Colombia mide **de pie**; Brasil y Chile, **sentados**. **Alemania no la declara** |
| Posición del brazo | CN-08 | Codo extendido frente a codo a 90° cambia la fuerza producible |
| Número de intentos | CN-08 | 2 o 3, con descansos distintos |
| Consolidación | CN-02 | Máximo, media de 2.ª y 3.ª, media de ambas manos… |
| Unidad | CN-06 | kg, kgf, lbf |

### Las seis definiciones operacionales de la base

Todas distintas. Ninguna intercambiable.

| Definición operacional | Ficha |
|---|---|
| Media de ambas manos, mayor intento por mano | `HGS-CO-TN1` |
| Media de los máximos de ambas manos, sin considerar dominancia | `HGS-CO-UNI-*` |
| Mayor de la **mano dominante** / **no dominante** | `HGS-CO-CUC-D` / `-ND` |
| Mejor de dos intentos con la **mano derecha** / **izquierda** | `HGS-CL-D` / `-I` |
| Media de la 2.ª y 3.ª de tres, **mano dominante** | `HGS-BR-*` |
| Máximo de dos intentos por mano, el mayor de ambas | `HGS-DE-*` |

**«Mano dominante» y «mano derecha» no son la misma coordenada.** La dominancia
se declara —Cúcuta la preguntó y excluyó a los ambidiestros—; la lateralidad
anatómica se observa. Una norma de mano derecha aplicada a una persona zurda es
un error que ninguna etiqueta compartida disculpa.

---

## Parte IV · Comprobaciones

| # | Comprobación | Resultado |
|---|---|---|
| 1 | Conversiones de unidad en la base | **0** |
| 2 | Fichas que mezclan unidades | **0** |
| 3 | Equivalencias instrumentales declaradas | **0** |
| 4 | Equivalencias inferidas por marca | **0** |
| 5 | Equivalencias inferidas por tipo de dinamómetro | **0** |
| 6 | Instrumentos sin marca y modelo | **0** de 6 |
| 7 | Fichas sin posición corporal en CN-08 | **2** · las dos alemanas. Ver abajo |
| 8 | Fichas sin número de intentos en CN-08 | **0** |
| 9 | Fichas sin definición operacional en CN-02 | **0** |
| 10 | Fabricante usado como autoridad normativa | **0** |
| 11 | Valores adoptados de una conversión de terceros | **0** |

### Sobre el punto 7 · Alemania no declara la posición

Corregido en NIE-1.1, cuando el adaptador del motor intentó comparar la
posición corporal y no encontró qué comparar.

`HGS-DE-TN2` y `HGS-DE-TN1` describen su protocolo como «dos mediciones por
mano; se registra el máximo de ambas manos», **y nada más**. No dicen si el
sujeto está de pie o sentado, ni el ángulo de codo. La propia ficha ya lo
reconocía en CN-33: «protocolo incompleto», y era una de las dos razones de su
D-03.

Una versión anterior de este módulo afirmaba que «Alemania y Colombia miden de
pie». **Era una inferencia, no un dato de la fuente**, y queda retirada.

Consecuencia práctica, y es la correcta: frente a una medición cuya posición sí
se conoce, las normas alemanas no pueden confirmarse ni descartarse por esa
dimensión. El resultado es **NO_DETERMINABLE**, no una coincidencia supuesta.

> Es exactamente la regla que la NKB aplica a las fuentes, aplicada esta vez a
> la NKB misma: lo que no consta no se rellena.

### Sobre el punto 6

Solo una fuente describe su instrumento de forma parcialmente genérica:
`ramirez_velez_hgs_colombia_6_64_2021` dice «dinamómetro de mango ajustable».
**No está admitida**, de modo que no afecta a ninguna norma de la base. Su método
concreto se conoce igualmente por otra vía —son las mediciones de la ENSIN-2015,
las mismas que `HGS-CO-TN1`—, y eso es lo que permitió cerrar el conflicto
(`40`) sin haberla leído.
