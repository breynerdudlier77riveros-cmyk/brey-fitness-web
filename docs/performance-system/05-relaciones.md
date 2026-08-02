---
modulo: 05
titulo: Sistema de relaciones
estado: congelado
---

# 05 · Sistema de relaciones

Cómo la información asciende desde un hecho registrado hasta un motor consumidor.

```
Registro de Prueba
      │  (1) contribución
      ▼
Estado de Capacidad
      │  (2) composición
      ▼
Perfil Funcional
      │  (3) publicación
      ▼
Motores consumidores
```

Tres saltos, tres reglas distintas. Ninguno de los tres se salta: un motor consumidor **no puede
leer un Registro de Prueba directamente**, porque perdería la elegibilidad, la incertidumbre y la
traza que el PAS existe para aportar (invariante I-08).

---

## Salto 1 · Del registro a la capacidad — *contribución*

Un Registro de Prueba **contribuye** al Estado de una o varias Capacidades.

### Qué congela este sprint

- La contribución es **N a M**: una prueba puede contribuir a varias capacidades, y una capacidad
  recibe de varias pruebas.
- La contribución es **ponderada**: no toda prueba informa por igual de una capacidad.
- La contribución es **condicional**: solo contribuye si el registro es elegible (`09`).
- La contribución es **declarada, nunca inferida**: una prueba contribuye a una capacidad porque
  su definición de catálogo lo declara y cita su fuente, jamás porque el motor lo deduzca.

### Qué NO congela este sprint

**Ninguna correspondencia concreta.** Este documento no afirma que ninguna prueba mida ninguna
capacidad.

El motivo es el mismo principio que gobierna todo el ecosistema: *afirmar que una prueba
determinada informa de una capacidad determinada es una afirmación científica*. Producirla aquí
sería inventar ciencia, que es exactamente lo que el encargo prohíbe.

Esas correspondencias se establecerán en el **Sprint 3**, una por una, cada una con su
referencia verificada en la Clinical Knowledge Base. Una prueba sin referencia no entra al
catálogo con capacidades asignadas — puede registrarse, pero no contribuye a ningún estado.

> **Consecuencia asumida:** al terminar el Sprint 2, el sistema podrá registrar pruebas y no
> podrá derivar ningún Perfil Funcional. Es correcto. Un perfil derivado de correspondencias
> inventadas sería peor que ningún perfil.

---

## Salto 2 · De la capacidad al perfil — *composición*

El Perfil Funcional **agrupa** los Estados de Capacidad. Es composición, no cálculo:

- **No se resume.** El perfil no produce un número global (`01`, entidades descartadas).
- **No se pondera entre capacidades.** Ordenar capacidades por importancia exigiría un objetivo.
- **No se rellena.** Una capacidad sin pruebas figura como *desconocida*, no se omite ni se
  estima.
- **Incluye sus limitaciones.** Un perfil sin ellas está incompleto.

La única operación de este salto es **agregar la incertidumbre**: el perfil declara cuántas
capacidades están evaluadas, cuántas desconocidas, cuántas desactualizadas y cuántas en
conflicto. Eso es aritmética sobre estados ya derivados, no interpretación nueva.

---

## Salto 3 · Del perfil a los motores — *publicación*

El Perfil Funcional es el **contrato de salida** del PAS.

Reglas del contrato, congeladas:

1. **De solo lectura.** Ningún motor modifica un perfil.
2. **Completo o nada.** Un consumidor recibe el perfil íntegro, con sus limitaciones. No existe
   una vista «solo lo evaluado»: permitirla haría que un motor pudiera ignorar lo que no se sabe.
3. **Con traza.** Todo Estado de Capacidad llega acompañado de su traza (`08`).
4. **Sin obligación de uso.** El PAS no exige que ningún motor lo consuma, ni sabe si lo hace.

### Hacia el Workout Engine

El caso de consumo que motiva el sistema, descrito **sin implementarlo**:

| El PAS aporta | El Workout Engine decide |
|---|---|
| Qué capacidades están evaluadas y cuáles no | Qué entrenar |
| Con qué certeza | Cuánta carga |
| Qué patrones tienen competencia técnica registrada | Qué ejercicios seleccionar |
| Qué capacidades están en conflicto o desactualizadas | Si necesita reevaluar antes de decidir |

**La frontera:** el PAS nunca sugiere qué hacer con una capacidad desconocida. Que el Workout
Engine pida una reevaluación, asuma un punto de partida conservador o rechace generar es
**decisión suya**, y el PAS no la anticipa ni la condiciona.

Esta separación reproduce la que ya existe entre el Motor BPS y los motores que deciden
contenido: un orquestador que informa, y motores que resuelven.

---

## Lo que ninguna relación puede hacer

| Prohibido | Motivo |
|---|---|
| Un Estado de Capacidad alimentando a otro | Encadenaría derivaciones cuyo error se acumularía sin traza (`02`) |
| Un perfil alimentando otro perfil | Mismo motivo |
| Un motor consumidor leyendo registros directamente | Perdería elegibilidad, incertidumbre y traza |
| Una capacidad derivada de la ausencia de pruebas de otra | Sería inferencia, no evaluación (límite L-06) |
| Una correspondencia prueba→capacidad sin referencia | Sería ciencia inventada |
