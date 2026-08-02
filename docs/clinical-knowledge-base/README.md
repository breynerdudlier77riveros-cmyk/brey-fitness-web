# BREY Clinical Knowledge Base (CKB) v1.0

Base de conocimiento científico estructurado sobre composición corporal.

**No es un handbook.** Los handbooks del ecosistema especifican *qué hace BREY*. Esta base
documenta *qué se sabe sobre el cuerpo humano*, con independencia de lo que BREY implemente.

**No contiene datos de personas.** Ni una sola fila de paciente, cliente o medición.

**No contiene reglas ejecutables.** Ningún umbral de este documento es un umbral del sistema.
Que aquí se cite un punto de corte publicado no significa que BREY lo aplique: esa decisión
pertenece a los handbooks y a los motores, nunca a esta base.

---

## Para qué existe

Los motores del BCS (Analysis Engine, Recommendation Engine) solo pueden afirmar aquello que
tenga respaldo documental. Hasta ahora ese respaldo venía de los handbooks internos, que
describen decisiones de producto, no fisiología. Esta base cubre la otra mitad: el conocimiento
científico que permitirá, en el futuro, responder preguntas como *por qué* aumenta la masa
muscular o *qué significa* que el agua extracelular suba.

Consumidores previstos:

| Consumidor | Uso |
|---|---|
| Professional Recommendation Engine | Fundamentar reglas hoy sin respaldo (ver sus 5 limitaciones de alcance declaradas) |
| AI Observation Generator | Redactar observaciones sobre una base citable, no sobre memoria del modelo |
| Intelligent Body Composition Analysis | Documentar el mecanismo detrás de cada hallazgo |
| Dashboard Statistics | Contextualizar agregados |

---

## Política de citación — léase antes de añadir contenido

Esta base se redactó bajo una restricción explícita: **ninguna referencia se escribe de
memoria.** Toda entrada de `_evidencia/referencias.yaml` fue localizada y comprobada antes de
citarse, y cada ficha apunta a una de esas entradas por su clave.

Consecuencias prácticas, deliberadas:

1. **Los campos no verificados se omiten, no se completan.** Cuando no se pudo confirmar la
   autoría de una publicación, se cita por autor corporativo, título, revista, año y
   localizador. Es preferible una cita incompleta y correcta a una completa e inventada.
2. **Una afirmación sin referencia verificada se marca como tal.** El estado
   `evidencia: pendiente` es un estado válido y frecuente en v1.0. No es un defecto: es la
   diferencia entre una base científica y un texto plausible.
3. **La ausencia de evidencia se documenta igual que la evidencia.** El módulo 12 recoge los
   vacíos encontrados; son tan útiles para los motores como las afirmaciones positivas, porque
   delimitan lo que el sistema no puede decir.

Fuentes admitidas: revisiones sistemáticas, metaanálisis, position stands, consensus
statements y guías de sociedades científicas (ISAK, ESPEN, ACSM, NSCA, EASO, The Obesity
Society, WHO). Nunca blogs, páginas comerciales ni enciclopedias colaborativas.

---

## Estructura

```
docs/clinical-knowledge-base/
├── README.md                     · este archivo
├── _plantilla-ficha.md           · estructura obligatoria de toda ficha
├── _evidencia/
│   └── referencias.yaml          · SSoT de referencias verificadas
├── 00-introduccion.md
├── 01-principios-fisiologicos.md
├── 02-composicion-corporal.md
├── 03-masa-muscular.md
├── 04-masa-grasa.md
├── 05-agua-corporal.md
├── 06-bioimpedancia.md
├── 07-metabolismo-basal.md
├── 08-indicadores-antropometricos.md
├── 09-patrones-de-cambio.md
├── 10-relaciones-entre-variables.md
├── 11-calidad-de-medicion.md
├── 12-limitaciones-cientificas.md
├── 13-evidencia.md
├── 14-glosario.md
├── 15-referencias.md
├── 16-adr.md
└── 17-roadmap.md
```

**Por qué Markdown y no un micro-sitio HTML como los handbooks:** el destino declarado de esta
base es alimentar un Knowledge Graph consultable por IA. Markdown con frontmatter YAML es
directamente parseable a nodos y aristas; un micro-sitio HTML con navegación y buscador propio
exigiría raspar presentación para recuperar contenido. La organización es temática, no por
capas de arquitectura — ver módulo 16, CKB-ADR-01.

---

## Cómo se lee una ficha

Toda ficha responde siete preguntas, siempre en el mismo orden, definidas en
`_plantilla-ficha.md`: qué significa · por qué ocurre · mecanismo fisiológico · qué evidencia
lo respalda · qué limitaciones tiene · qué variables cambian junto con ella · qué
interpretaciones **no** pueden hacerse.

La última es la más importante para BREY: delimita lo que ningún motor puede afirmar aunque el
dato lo sugiera.

---

## Estado de la v1.0

Base **parcial y honesta**, no completa. El módulo 13 detalla el estado de cobertura por
módulo, y el 12 los vacíos científicos encontrados. Ampliarla es trabajo de verificación
bibliográfica, no de redacción.
