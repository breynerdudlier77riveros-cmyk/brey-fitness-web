---
modulo: 16
titulo: Decisiones de diseño de la base
tipo: fundacional
estado: verificado
---

# 16 · Decisiones de diseño (CKB-ADR)

Decisiones sobre **cómo se construye esta base**, no sobre fisiología ni sobre producto.

---

## CKB-ADR-01 · Markdown con frontmatter, no micro-sitio HTML

**Contexto.** El resto de la documentación del ecosistema son micro-sitios HTML con navegación
y buscador propios.

**Decisión.** Esta base usa Markdown con frontmatter YAML.

**Motivo.** Su destino declarado es alimentar un Knowledge Graph (módulo 17). Markdown
estructurado es directamente parseable a nodos; recuperar contenido de un micro-sitio HTML
exigiría raspar presentación. El encargo, además, pedía explícitamente no copiar la estructura
de los handbooks.

**Consecuencia.** Esta base no tiene buscador propio. Se navega por sistema de ficheros y se
consulta por `grep` o por el futuro extractor.

---

## CKB-ADR-02 · Organización temática, no por capas de arquitectura

**Decisión.** Los módulos se organizan por tema fisiológico (agua, músculo, grasa), no por capa
del sistema.

**Motivo.** El conocimiento fisiológico es independiente de la arquitectura de BREY. Organizarlo
por capas ataría la base a un diseño de software que puede cambiar.

---

## CKB-ADR-03 · Ninguna referencia se escribe de memoria

**Contexto.** El principal modo de fallo al redactar una base científica con asistencia de un
modelo de lenguaje es la generación de citas plausibles pero inexistentes o mal atribuidas.

**Decisión.** Toda entrada de `referencias.yaml` se localizó y comprobó antes de registrarse. Los
campos no confirmados se omiten en lugar de completarse.

**Motivo.** Esta base alimentará textos que verán clientes reales sobre su propio cuerpo. Una
cita inventada aquí se propaga aguas abajo con apariencia de autoridad.

**Consecuencia.** Varias entradas carecen de autoría pese a ser publicaciones conocidas. Es
deliberado: una cita incompleta y correcta es preferible a una completa e inventada.

---

## CKB-ADR-04 · Los vacíos se documentan como contenido

**Decisión.** Una ficha sin fuente admisible se registra con `estado: pendiente` y se conserva,
en lugar de omitirse o completarse.

**Motivo.** Para los motores que consultarán la base, saber que algo no puede afirmarse es tan
operativo como saber qué puede afirmarse. Omitir la ficha haría el vacío invisible.

**Consecuencia.** La v1.0 tiene 2 fichas abiertas y un módulo entero (12) dedicado a los vacíos.

---

## CKB-ADR-05 · La población es parte inseparable de la evidencia

**Contexto.** La mayoría de la evidencia sobre bioimpedancia procede de poblaciones clínicas.
BREY sirve a personas mayoritariamente sanas que entrenan.

**Decisión.** Toda referencia declara su población, y el nivel de evidencia se gradúa respecto a
la población de BREY, no en abstracto. De ahí el valor `bajo_para_poblacion_brey`.

**Motivo.** Es el error de razonamiento más probable en este dominio y el de peor consecuencia:
trasladar un cociente de riesgo de pacientes críticos a un cliente de gimnasio.

---

## CKB-ADR-06 · La base no contiene umbrales operativos

**Decisión.** Que esta base cite un punto de corte publicado no lo convierte en umbral del
sistema. Los umbrales que BREY aplica viven en los handbooks y en los motores.

**Motivo.** Separar *qué dice la literatura* de *qué decide el producto*. Fundirlos haría que
cualquier cifra citada aquí entrara en producción sin decisión explícita de nadie.

**Consecuencia.** El módulo 08 cita los puntos de corte de la OMS y ningún motor de BREY está
autorizado a clasificar con ellos por el mero hecho de que aparezcan aquí.
