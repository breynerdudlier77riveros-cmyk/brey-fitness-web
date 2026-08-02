---
modulo: 14
titulo: Roadmap
estado: congelado
---

# 14 · Roadmap

Qué queda por decidir, en qué orden y por qué en ese orden.

## Criterio de entrega

Desde el Sprint 2, **cada entrega nace implementada, probada e integrada**, no solo
especificada. El Sprint 1 es la excepción deliberada y única: congelar el lenguaje antes de
escribir código evita que el modelo de dominio acabe siendo lo que la primera implementación
resultó ser.

## Regla de dependencia

El orden **no es negociable** en un punto: el Sprint 3 depende del 2, y todo lo demás depende del
3. Sin pruebas concretas no hay nada que correlacionar con capacidades, y sin correspondencias no
se deriva ningún perfil.

---

## Sprint 2 · Catálogo concreto y registro

**Decide:** las pruebas concretas de cada familia y los patrones de movimiento a los que se
refieren E-01, E-02 y la familia F-H.

| Entrega | Detalle |
|---|---|
| Fichas de prueba | Anatomía completa de `04`, una por prueba |
| Patrones de movimiento | Enumerados **desde el Master Exercise Dataset**, no definidos aquí |
| Subcapacidades de A-01 y A-02 | Por región y por patrón (`03`) |
| Registro | Alta, consulta y anulación de Registros de Prueba y Evaluaciones |

**Estado del sistema al cerrar:** puede registrar pruebas y **no puede derivar ningún Perfil
Funcional**. Es correcto y está anticipado en `05`. Un perfil derivado de correspondencias
inventadas sería peor que ningún perfil.

**Riesgo:** definir pruebas por costumbre en lugar de por uso real. Mitigación: entra al catálogo
lo que vaya a registrarse, no lo que exista en la literatura.

---

## Sprint 3 · Correspondencias y vigencia

El sprint que convierte al PAS en un sistema que responde su pregunta.

| Entrega | Detalle |
|---|---|
| Correspondencias prueba→capacidad | Una por una, cada una con su clave de la Clinical Knowledge Base |
| Pesos relativos | Cuánto informa cada prueba de cada capacidad |
| Valores de vigencia | Por prueba o por familia, con respaldo |
| Reglas de elegibilidad | EL-01…EL-06 de `09`, implementadas y probadas |
| Motor de derivación | Los cinco estados de capacidad de `02`, con traza |

**Condición de cierre, sin excepción:** ninguna correspondencia sin referencia verificada entra al
catálogo (I-10). Una capacidad sin correspondencias respaldadas se queda *desconocida*, y el
sprint se declara cerrado igualmente.

**Riesgo:** que la evidencia disponible no cubra las 18 capacidades activas. Es un resultado
posible y aceptable — el sistema declarará lo que no puede evaluar en lugar de fingir que puede.

---

## Sprint 4 · Evolución

**Decide** qué significa comparar dos Perfiles Funcionales.

| Entrega | Detalle |
|---|---|
| Comparación de perfiles | Qué es comparable y qué no |
| Advertencia de versión | Cuándo dos perfiles no son directamente comparables (I-11) |
| Cambio significativo | Qué diferencia deja de ser ruido, con respaldo por prueba |

**Frontera:** comparar es describir una diferencia. **No es** explicarla, ni proyectarla, ni
juzgarla (L-05, I-13). El PAS dirá que una capacidad cambió; nunca por qué ni hacia dónde.

**Precedente disponible:** el BCS ya resolvió este problema para composición corporal —umbrales de
cambio insignificante por variable, comparación intraindividual, sin proyección—. Conviene
reutilizar el criterio, no la implementación.

---

## Sprint 5 · Tolerancia y disponibilidad

**Activa** lo reservado: capacidades F-01 y F-02, familia F-K.

Pospuesto a propósito hasta este punto por ser el territorio de mayor riesgo del catálogo: ambas
capacidades rozan lo clínico y son fácilmente confundibles con un juicio sobre la salud del
atleta (`03`).

**Condiciones de activación:**

1. Respaldo en la Clinical Knowledge Base para las pruebas que las alimenten.
2. F-02 registra que un patrón no puede ejecutarse, **nunca por qué**.
3. Ninguna de las dos admite categorías de riesgo (L-03).

Si las condiciones no se cumplen, **el sprint no se ejecuta y las capacidades siguen reservadas**.
Es un desenlace legítimo.

---

## Sprint 6 · Publicación

**Cierra** el contrato de salida hacia los motores consumidores.

| Entrega | Detalle |
|---|---|
| Contrato del Perfil Funcional | Estable y versionado |
| Entrega íntegra | Con limitaciones y trazas (I-09) |
| Advertencias de comparabilidad | Coordenadas de versión en toda salida |
| Primer consumidor | El que exista entonces |

**Lo que este sprint no hace:** construir el Workout Engine. El PAS publica; quién consuma y cómo
es decisión de cada motor (`12`).

---

## Fuera del roadmap, permanentemente

| No se hará | Motivo |
|---|---|
| Puntuación global del atleta | Entidad descartada en `01` |
| Comparación entre atletas | L-04, I-13 |
| Predicción de rendimiento | L-05, I-13 |
| Clasificación clínica o de riesgo | L-03 |
| Recomendación de qué entrenar | L-01, I-12 |
| Periodicidad de reevaluación | Ninguna fuente del ecosistema la documenta (`06`, `07`) |
