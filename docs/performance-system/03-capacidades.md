---
modulo: 03
titulo: Catálogo de capacidades
estado: congelado
---

# 03 · Catálogo de capacidades

Una **capacidad** es una dimensión funcional evaluable del atleta. Este catálogo congela *qué
dimensiones existen*, no cómo se miden ni cuánto vale cada una.

## Regla de admisión

Una capacidad entra en el catálogo si cumple las cuatro condiciones:

1. **Es evaluable.** Existe al menos una forma concebible de observarla. Una dimensión que solo
   pueda inferirse no es una capacidad.
2. **Es distinguible.** No es un sinónimo ni un caso particular de otra ya presente.
3. **Es independiente del objetivo.** Su definición no presupone para qué entrena nadie.
4. **Es independiente del método.** Se define por lo que es, no por la prueba que la mide. Si su
   definición necesita nombrar una prueba, es una métrica, no una capacidad.

## Estructura del catálogo

Tres niveles. La jerarquía es de **organización**, no de derivación: una subcapacidad no se
calcula a partir de su dominio ni al revés.

```
Dominio  →  Capacidad  →  Subcapacidad
```

El **Dominio** agrupa por naturaleza funcional. La **Capacidad** es la unidad de evaluación y de
estado — es el nivel al que existe un Estado de Capacidad. La **Subcapacidad** cualifica una
capacidad cuando la evidencia justifique distinguirla; en v1.0 se declaran solo las que ya son
distinguibles sin discusión.

---

## Catálogo

### Dominio A · Producción de fuerza

| Código | Capacidad | Definición |
|---|---|---|
| **A-01** | Fuerza máxima | Capacidad de producir tensión máxima con independencia del tiempo empleado |
| **A-02** | Fuerza resistencia | Capacidad de sostener la producción de fuerza de forma repetida |
| **A-03** | Potencia | Capacidad de producir fuerza en el menor tiempo posible |
| **A-04** | Fuerza reactiva | Capacidad de aprovechar el ciclo de estiramiento-acortamiento |
| **A-05** | Fuerza de agarre | Capacidad de producir y sostener tensión con la mano |

*Subcapacidades reconocidas:* A-01 y A-02 admiten distinción por **región corporal** (tren
superior, tren inferior, tronco) y por **patrón de movimiento**. Esa distinción es estructural y
no requiere evidencia adicional; qué patrones concretos se enumeran se decide en el Sprint 2.

### Dominio B · Rango y control articular

| Código | Capacidad | Definición |
|---|---|---|
| **B-01** | Movilidad | Rango de movimiento alcanzable de forma activa |
| **B-02** | Flexibilidad | Rango de movimiento alcanzable de forma pasiva |
| **B-03** | Estabilidad | Capacidad de mantener una posición articular bajo demanda externa |
| **B-04** | Control motor | Capacidad de ejecutar un movimiento con la trayectoria pretendida |

**B-01 y B-02 se mantienen separadas a propósito.** Su distinción —activa frente a pasiva— es
la que da sentido a evaluar ambas; fundirlas en «flexibilidad» perdería información que el
propio catálogo existe para conservar.

### Dominio C · Metabólico

| Código | Capacidad | Definición |
|---|---|---|
| **C-01** | Resistencia aeróbica | Capacidad de sostener trabajo con aporte de oxígeno suficiente |
| **C-02** | Resistencia anaeróbica | Capacidad de sostener trabajo con aporte de oxígeno insuficiente |
| **C-03** | Capacidad de recuperación intra-sesión | Capacidad de restablecerse entre esfuerzos dentro de una misma sesión |

### Dominio D · Neuromuscular y coordinativo

| Código | Capacidad | Definición |
|---|---|---|
| **D-01** | Velocidad | Capacidad de desplazar el cuerpo o un segmento en el menor tiempo |
| **D-02** | Agilidad | Capacidad de cambiar de dirección o de estado de movimiento |
| **D-03** | Coordinación | Capacidad de organizar segmentos corporales en una secuencia |
| **D-04** | Equilibrio | Capacidad de conservar el centro de masas dentro de la base de sustentación |

*Subcapacidad reconocida:* D-04 admite **estático** y **dinámico**.

### Dominio E · Técnico

| Código | Capacidad | Definición |
|---|---|---|
| **E-01** | Competencia técnica | Grado de dominio de la ejecución de un patrón concreto |
| **E-02** | Repertorio de habilidad | Conjunto de patrones que el atleta ejecuta con competencia |

**E-01 se evalúa siempre respecto a un patrón nombrado**, nunca en abstracto: «competencia
técnica» sin objeto no significa nada. El catálogo de patrones no pertenece al PAS: procede del
Master Exercise Dataset (ver `12-integracion-futura.md`).

### Dominio F · Tolerancia y disponibilidad

| Código | Capacidad | Definición |
|---|---|---|
| **F-01** | Tolerancia a la carga | Cantidad de trabajo que el atleta asimila sin degradación de su ejecución |
| **F-02** | Disponibilidad funcional | Ausencia de restricciones que impidan ejecutar un patrón |

⚠ **F-01 y F-02 son las capacidades de mayor riesgo de este catálogo.** Ambas rozan territorio
clínico y ambas son fácilmente confundibles con un juicio sobre la salud del atleta. Quedan
declaradas porque son funcionalmente reales y evaluables, pero:

- **F-02 no es un diagnóstico.** Registra que un patrón no puede ejecutarse, nunca por qué.
- Ninguna de las dos admite clasificación en categorías de riesgo (límite L-03).
- Su desarrollo se pospone deliberadamente al Sprint 5, cuando exista respaldo en la Clinical
  Knowledge Base. Hasta entonces permanecen en el catálogo como reservadas, sin pruebas
  asociadas.

---

## Recuento y estado

| Dominio | Capacidades | Estado en v1.0 |
|---|---|---|
| A · Producción de fuerza | 5 | Activo |
| B · Rango y control articular | 4 | Activo |
| C · Metabólico | 3 | Activo |
| D · Neuromuscular y coordinativo | 4 | Activo |
| E · Técnico | 2 | Activo |
| F · Tolerancia y disponibilidad | 2 | **Reservado — Sprint 5** |
| **Total** | **20** | |

---

## Lo que este catálogo NO decide

- **Ninguna métrica.** Ni unidades, ni escalas, ni rangos.
- **Ninguna prueba.** La correspondencia prueba→capacidad es materia del Sprint 3.
- **Ninguna importancia relativa.** No hay capacidades principales ni secundarias: ordenarlas
  exigiría un objetivo, que el sistema no conoce.
- **Ninguna referencia poblacional.** Si alguna capacidad admite valores de referencia, esos
  valores pertenecen a la Clinical Knowledge Base y el PAS solo los cita.
