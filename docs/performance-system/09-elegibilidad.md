---
modulo: 09
titulo: Modelo de elegibilidad
estado: congelado
---

# 09 · Modelo de elegibilidad

Qué condiciones debe cumplir un Registro de Prueba para participar en el estado vigente.

La elegibilidad se evalúa **por registro**, no por evaluación ni por atleta: dos registros de la
misma sesión pueden tener elegibilidad distinta.

## Las seis condiciones

Un registro es elegible si las cumple **todas**. El incumplimiento de una sola lo excluye, y el
motivo queda en la traza (TR-03).

| Código | Condición | Qué comprueba |
|---|---|---|
| **EL-01** | Vigencia de estado | El registro no está anulado |
| **EL-02** | Vigencia temporal | Su antigüedad no supera la vigencia declarada para su prueba |
| **EL-03** | Integridad | Tiene valor, fecha y prueba identificada |
| **EL-04** | Correspondencia vigente | Su prueba declara contribución a la capacidad, en la versión de catálogo aplicada |
| **EL-05** | Condiciones registradas | Constan las condiciones que su definición exige |
| **EL-06** | Precondiciones cumplidas | Las precondiciones del atleta se cumplían en el momento de la toma |

## Notas por condición

**EL-01.** Un registro anulado nunca vuelve a ser elegible. La anulación es terminal, igual que
en el BCS.

**EL-02.** La vigencia es atributo de la **prueba**, no del sistema: distintas pruebas caducan a
ritmos distintos. El PAS congela que el atributo existe; su valor por familia es materia de
evidencia (Sprint 3).

**EL-04.** Esta condición es la que permite que un cambio de catálogo altere un perfil sin que el
atleta haya hecho nada. Si una correspondencia se retira por evidencia nueva, los registros que
dependían de ella dejan de contribuir. Es el comportamiento correcto, y por eso el perfil declara
su versión de catálogo (`07`).

**EL-05 y EL-06.** Ambas fallan por **ausencia de información**, no por un valor incorrecto. Un
registro sin sus condiciones no es un registro malo: es un registro del que no puede saberse si es
bueno. La distinción importa porque su tratamiento difiere — no se anula, se excluye.

## Elegibilidad y calidad no son lo mismo

| Elegibilidad | Calidad |
|---|---|
| Decide si un registro **participa** | Describe cuánto **respalda** lo que se afirma |
| Binaria | Gradual |
| Se resuelve en este módulo | Se resuelve en `10-incertidumbre.md` |

Un registro puede ser elegible y aun así sostener débilmente una afirmación —por ser el único, o
por estar cerca del límite de su vigencia—. Confundir ambas cosas llevaría a excluir datos útiles
o, peor, a tratar como firme lo que no lo es.

## Lo que este modelo NO decide

- **Ningún valor de vigencia.** Ni días, ni semanas, ni por familia.
- **Ningún criterio de calidad de ejecución.** Qué invalida un intento pertenece al protocolo de
  cada prueba, no a la elegibilidad.
- **Ningún mínimo de registros.** Cuántos hacen falta para considerar evaluada una capacidad es
  parte de su definición de catálogo.
