---
modulo: 20
titulo: Modelo de procedencia
estado: congelado
sprint: NKB-2.0
---

# 20 · Modelo de procedencia

Qué papel puede tener cada clase de documento, y cómo se registra la cadena
desde donde se encontró la norma hasta donde se produjo.

## Los dos papeles

Todo documento cumple uno de estos papeles respecto de una norma concreta. **Un
mismo documento puede ser primario para una norma y secundario para otra.**

| Papel | Definición | Puede ser la referencia |
|---|---|---|
| **Primario** | Publicó los datos normativos por primera vez | Sí |
| **Secundario** | Reproduce, resume o remite a datos publicados en otro | **No** |

### Regla congelada

> **La referencia de una norma es siempre su fuente primaria.**

Una fuente secundaria **localiza**; no sustituye. Si la primaria no puede
recuperarse, la norma no entra (CA-03).

Es el mecanismo por el que se cuelan las tablas de origen desconocido: cada
documento cita al anterior hasta que el primero ya no existe, y para entonces la
tabla parece respaldada por toda la cadena.

---

## Clases de documento

Qué papel puede tener cada una. **La clase no determina la calidad**: determina
qué papel puede jugar.

| Clase | Papel posible | Notas |
|---|---|---|
| **Estudio original** | Primario | Puede ser primario aunque su objetivo no fuera normativo |
| **Revisión sistemática** | Secundario; primario si genera datos nuevos | Localiza excelentemente; rara vez es la referencia |
| **Metaanálisis** | Primario para su estimación agregada; secundario para los datos de origen | Su agregado es un dato nuevo con su propia población |
| **Documento de consenso** | Secundario habitualmente | Puede ser primario si publica datos propios |
| **Guía profesional** | Secundario | Suele remitir a estudios; su autoridad no la convierte en primaria |
| **Documento normativo institucional** | Primario si el organismo produjo los datos | Encuestas poblacionales oficiales, por ejemplo |
| **Documento técnico** | Depende de si publica datos propios y método | Se evalúa como cualquier otro |
| **Tesis** | Primario si publica datos y método, y es recuperable | La recuperabilidad es el punto débil habitual |
| **Documentación de fabricante** | **Ninguno**, sin publicación que la respalde | NKB-ADR-06 |
| **Sitio web** | Ninguno como referencia | Puede localizar; nunca es la fuente |
| **Material comercial o de formación** | Ninguno | El emisor tiene interés en el resultado |

### Sobre el prestigio

Se congela porque será la presión más frecuente:

> **El prestigio del emisor no sustituye a la verificación de la norma
> concreta.**

Una guía de una sociedad científica puede ser excelente y aun así no contener
una norma admisible: si remite a un estudio, la norma es de ese estudio, y hay
que ir a buscarlo. La autoridad de la institución respalda su recomendación, no
la trazabilidad de una tabla que reproduce.

### Sobre el metaanálisis

Merece precisión porque su papel es doble:

- Su **estimación agregada** es un dato nuevo: el metaanálisis es primario para
  ella, y su población es la mezcla de las poblaciones incluidas — lo que suele
  hacerla poco aplicable (`17`).
- Los **datos de cada estudio incluido** siguen siendo de esos estudios: para
  ellos es secundario.

Confundir ambos usos produce una norma con la autoridad del metaanálisis y la
población de nadie.

---

## La cadena de procedencia

Cuando se llega a una norma a través de una fuente secundaria, se registra la
cadena completa.

```
Fuente donde se encontró  (secundaria)
        ↓ remite a
Fuente intermedia          (secundaria, si existe)
        ↓ remite a
Fuente primaria            ← ESTA es la referencia
        ↓
Datos normativos verificados en ella
```

**Se registra la cadena entera**, no solo el extremo. Sin ella no puede saberse
por qué se buscó esa fuente ni reconstruirse el camino si alguien discrepa.

### Reglas de la cadena

**PR-01 · La cadena se recorre hasta el origen.** No se detiene en el primer
documento que parezca suficientemente serio.

**PR-02 · Cada eslabón se verifica.** Que un documento cite a otro no prueba que
el otro diga lo que el primero afirma.

**PR-03 · Una cadena rota detiene la admisión.** Si un eslabón no es
recuperable, la norma se queda en E-3 (`13`).

**PR-04 · Nunca se convierte una secundaria en primaria.** Ni «provisionalmente»,
ni «hasta que aparezca la original».

**PR-05 · Las discrepancias en la cadena se registran.** Si la secundaria
reproduce un valor distinto del que aparece en la primaria, se registra la
discrepancia y **prevalece la primaria**.

PR-05 no es un conflicto entre normas (`22`): es un error de transcripción de un
documento, y conviene dejarlo anotado porque suele propagarse.

---

## Prohibiciones sobre referencias

Se congelan aquí porque son las que destruyen la confianza en una biblioteca:

1. **Nunca se fabrica una referencia.**
2. **Nunca se completan autores por inferencia.** Un campo no verificado se
   omite (I-10).
3. **Nunca se inventa un identificador persistente.** Si no consta, no consta.
4. **Nunca se cita lo que no se ha leído.** Citar la cadena entera sin haberla
   recorrido es afirmar una verificación que no ocurrió.
5. **Nunca se atribuye a una fuente lo que no dice.** Incluido lo que
   «claramente da a entender».

## Lo que este módulo NO decide

- **Ninguna fuente concreta**, ni su clase.
- **Ninguna jerarquía de calidad** entre clases: la clase fija el papel, no el
  nivel (`16`).
