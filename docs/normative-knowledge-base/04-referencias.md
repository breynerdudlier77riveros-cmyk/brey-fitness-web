---
modulo: 04
titulo: Referencias
estado: congelado
---

# 04 · Referencias

Cómo se documenta la fuente de una norma. Es el módulo que decide si la NKB es
una biblioteca o un montón de números.

## Regla de admisión

> Ninguna norma entra sin referencia localizable y verificada.

**Verificada** significa: localizada y comprobada por una persona antes de
registrarse. Los campos que no se puedan confirmar **se omiten**, jamás se
completan por plausibilidad.

Es la política que la Clinical Knowledge Base y la PKB ya aplican, y por el
mismo motivo: una cita con un dato inventado es peor que una cita incompleta,
porque parece verificada.

---

## Información mínima

Sin estos ocho bloques, la referencia no entra.

| Bloque | Qué documenta |
|---|---|
| **Identificación** | Título, publicación, año, localizador (DOI, identificador de repositorio o URL estable) |
| **Naturaleza** | Qué tipo de documento es (`05`) |
| **Población de origen** | Criterios de inclusión, no solo la etiqueta (`03`) |
| **Tamaño y procedencia** | Cuántas personas y cómo se seleccionaron |
| **Método de medición** | Instrumento y procedimiento con que se obtuvieron los valores |
| **Estadístico publicado** | Cuál de las siete formas usa, con lo que la fuente reporte de la distribución |
| **Estratificación** | Por qué variables se presenta |
| **Limitaciones declaradas** | Las que la propia fuente reconoce |

Dos exigencias que suelen olvidarse y son las que más invalidan una norma:

**El método.** Una norma cuya fuente no describa cómo se midió es inaplicable,
por sólida que parezca. No se registra «pendiente de comprobar»: no se registra.

**Los criterios de inclusión.** Sin ellos la etiqueta de población es una
promesa sin contenido.

---

## Referencias aceptadas

| Tipo | Ejemplos de naturaleza |
|---|---|
| Estudios normativos primarios | Diseñados para producir valores de referencia |
| Revisiones sistemáticas y metaanálisis | Que agreguen datos normativos |
| Documentos normativos de sociedad científica | Position stands, consensus statements, guías |
| Encuestas poblacionales oficiales | De organismos públicos de salud o estadística |
| Estudios de desenlace | **Solo** para puntos de corte, y con su desenlace declarado |

Todas exigen revisión por pares o carácter oficial del organismo emisor.

## Referencias prohibidas

Sin excepción, y con el motivo por el que se excluyen:

| Prohibida | Motivo |
|---|---|
| **Blogs y divulgación** | Sin revisión ni método verificable |
| **Vídeo y redes sociales** | Igual, y además no citable de forma estable |
| **Páginas comerciales** | El emisor tiene interés en el resultado |
| **Documentación de fabricante** sin publicación revisada | Las normas que acompañan a un instrumento suelen ser propiedad del fabricante, sin muestra ni método publicados. Que vengan impresas en el informe del aparato no las convierte en normas |
| **Material de formación o certificación** | Emitido por quien vende el curso |
| **Normas de origen desconocido** | Tablas que circulan sin fuente atribuible. Muy frecuentes y completamente inutilizables |
| **Contenido generado por modelos de lenguaje** | No es una fuente: es una reformulación sin trazabilidad |
| **Comunicación personal** | No verificable por terceros |

**La prohibición del fabricante es la que más se discutirá**, porque su norma
suele ser la única disponible para una variable y viene ya calculada. Es
precisamente por eso: si se admitiera, la NKB acabaría llena de normas cómodas y
sin respaldo, y perdería su única razón de ser.

Si para una variable solo existe norma de fabricante, la respuesta correcta es
**declarar que no hay norma admisible**, no rebajar el criterio.

---

## Cita indirecta

Una fuente que reproduce la norma de otra **no es la referencia**: lo es la
original. Si la original no puede localizarse, la norma no entra.

Es el mecanismo por el que se cuelan las tablas de origen desconocido: cada
documento cita al anterior hasta que el primero ya no existe.

## Qué se hace con una fuente parcialmente verificable

| Situación | Decisión |
|---|---|
| Falta un campo no esencial | Se omite el campo y se declara la omisión |
| Falta el método | **No entra** |
| Falta la población o sus criterios | **No entra** |
| El localizador no resuelve | **No entra** |
| La fuente cita a otra y esta no aparece | **No entra** |

## Lo que este módulo NO decide

- **Ninguna referencia concreta.** Ni una sola, de ningún dominio.
- **Ningún criterio de antigüedad.** Cuándo una norma queda obsoleta es materia
  de `06`, y su valor no se congela aquí.
- **Ninguna jerarquía entre fuentes admitidas.** Eso es calidad, y vive en `05`.
