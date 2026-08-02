---
modulo: 12
titulo: Integración futura
estado: congelado
---

# 12 · Integración futura

Contratos **conceptuales** con el resto del ecosistema. Ninguno es una interfaz técnica: este
módulo fija quién puede pedir qué a quién, y sobre todo qué no.

## Regla general de integración

> El PAS **publica** el Perfil Funcional y **consume** referencias de la Clinical Knowledge Base.
> Nada más. No llama a ningún motor, no reacciona a ningún evento de otro sistema y no sabe si
> alguien lo está usando.

Esto lo mantiene en la posición correcta de la arquitectura: es una **fuente**, no un
participante. Un sistema que consulta a otros acaba dependiendo de ellos, y un modelo de estado
que depende de motores de decisión deja de ser una fuente fiable.

---

## Sistemas que consumen el PAS

### Workout Engine *(no existe)*

El consumidor que motiva la existencia del PAS.

| El PAS le entrega | El Workout Engine decide |
|---|---|
| Qué capacidades están evaluadas, y con qué certeza | Qué entrenar y con cuánta carga |
| Qué patrones tienen competencia técnica registrada (E-01) | Qué ejercicios seleccionar |
| Qué capacidades están en conflicto o desactualizadas | Si reevaluar antes de decidir |
| Las limitaciones del perfil | Si puede generar o debe abstenerse |

**Frontera:** el PAS nunca sugiere qué hacer ante una capacidad desconocida. Pedir una
reevaluación, partir de un supuesto conservador o negarse a generar son decisiones del motor.

### Progression Engine

Consume perfiles **sucesivos** para observar evolución. Dos advertencias que el PAS le debe:

- Dos perfiles calculados con versiones distintas de catálogo o motor **no son directamente
  comparables** (`07`). El PAS entrega la advertencia; el motor decide qué hacer con ella.
- El PAS **no calcula la evolución** (`02`). Comparar perfiles es operación del consumidor, y su
  definición formal es materia del Sprint 4.

### Recovery Engine

Su insumo natural serían las capacidades F-01 (tolerancia a la carga) y F-02 (disponibilidad
funcional), **reservadas hasta el Sprint 5**. Hasta entonces el PAS no tiene nada que ofrecerle,
y decirlo es preferible a ofrecerle un sustituto inventado.

### Nutrition Engine *(no existe)*

**Sin relación con el PAS.** El estado funcional no informa de requerimientos nutricionales, y
afirmar lo contrario sería una afirmación clínica fuera de los límites L-03 y L-05.

### Analytics

Consume perfiles y trazas para agregación descriptiva. **Nunca lee Registros de Prueba
directamente** (invariante I-08): perdería elegibilidad, incertidumbre y traza, y produciría
agregados que parecen sólidos porque han olvidado lo que no se sabía.

### AI Clinical Copilot

Puede redactar sobre un Perfil Funcional bajo las reglas que ya lo gobiernan en el BCS: sin
inventar, citando trazabilidad, sin lenguaje prescriptivo ni diagnóstico. El PAS no le concede
ninguna licencia adicional — y en particular, **no puede rellenar con lenguaje una capacidad
desconocida**.

---

## Sistemas de los que el PAS depende

### Clinical Knowledge Base

**La única dependencia real.** Es la autoridad de toda correspondencia prueba→capacidad (`05`) y
de toda referencia poblacional citada.

La dependencia es de **lectura y cita**: el PAS no escribe en la CKB, y una correspondencia sin
clave de referencia verificable no entra al catálogo.

### Master Exercise Dataset

Provee el catálogo de patrones de movimiento al que se refieren E-01, E-02 y la familia F-H. El
PAS **no define patrones propios**: los nombra usando los que el dataset ya define. Definir un
segundo catálogo de patrones crearía dos nombres para el mismo movimiento.

---

## Sistemas paralelos

### Body Composition System (BCS)

**Vecindad, no contención.** Ni el PAS absorbe al BCS ni al revés:

| BCS | PAS |
|---|---|
| Sujeto: Cliente de un entrenador | Sujeto: Atleta |
| Pregunta: ¿cómo está compuesto este cuerpo? | Pregunta: ¿qué puede hacer este atleta? |
| Salida: reporte de composición corporal | Salida: Perfil Funcional |

**En v1.0 el PAS no consulta al BCS.** La familia F-J registra medidas antropométricas que una
prueba concreta necesite como contexto, y eso no es hacer composición corporal (`04`).

Que un mismo ser humano sea Cliente del BCS y Atleta del PAS es posible, y **la correspondencia
se resuelve fuera de ambos sistemas**. Es la misma decisión que ya separa al Cliente BCS del
Usuario de la aplicación, y por el mismo motivo: unificar identidades por conveniencia acopla dos
contextos que evolucionan por separado.

### Motor BPS

Orquesta el ciclo de vida del usuario. Comparte con el PAS **cero entidades**: sus «estados» son
fases del recorrido del usuario; los del PAS son afirmaciones sobre capacidades.

Su Diagnóstico —cuestionario que asigna un Sistema a partir de preferencias y disponibilidad
declaradas— **no es una evaluación funcional** y no produce Registros de Prueba. Confundir ambos
es el riesgo que motivó el cambio de nombre (`15`, PAS-ADR-01).

---

## Lo que ninguna integración puede hacer

| Prohibido | Motivo |
|---|---|
| Escribir en el PAS desde otro motor | Solo se registra lo que una persona evaluó |
| Leer Registros de Prueba sin pasar por el perfil | Invariante I-08 |
| Recibir un perfil «solo con lo evaluado» | Permitiría ignorar lo que no se sabe (`05`) |
| Que el PAS reaccione a eventos de otro sistema | Lo convertiría en participante, no en fuente |
| Unificar Atleta con Usuario o con Cliente BCS dentro del PAS | Acoplaría contextos independientes |
