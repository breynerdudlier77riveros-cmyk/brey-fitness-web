---
modulo: 02
titulo: Modelos de composición corporal
tipo: fundacional
estado: verificado
nivel_evidencia_modulo: alto
---

# 02 · Modelos de composición corporal

Qué compartimentos existen y cómo se relacionan. Es el marco que da sentido a las comprobaciones
de consistencia del módulo 11.

---

### Modelos por niveles

```yaml
id: modelos-composicion
tipo: metodo
variables_bcs: [peso_kg, masa_grasa_kg, masa_libre_grasa_kg, agua_total_l, proteina_kg, minerales_kg]
nivel_evidencia: alto
referencias: [espen_bia_1]
estado: verificado
```

**Definición.**
La composición corporal se describe dividiendo el peso en compartimentos. Los modelos se
distinguen por cuántos emplean.

| Modelo | Compartimentos | Identidad |
|---|---|---|
| 2 compartimentos | Masa grasa + masa libre de grasa | MG + MLG = Peso |
| 3 compartimentos | Masa grasa + agua + resto magro | — |
| 4 compartimentos | Masa grasa + agua + proteína + mineral | — |

**Fundamento.**
Cada nivel adicional exige una medida independiente adicional. Un modelo de más compartimentos
no es automáticamente más exacto: lo es solo si cada medida que incorpora lo es.

**Relaciones conocidas.**
Las identidades aditivas de la tabla son la base de las comprobaciones de consistencia interna
del módulo 11. No son hallazgos empíricos sino definiciones, y por eso su incumplimiento
identifica un error con certeza.

**Factores de confusión.**
Los modelos asumen constantes de hidratación de la masa libre de grasa que no se cumplen en
todas las poblaciones ni en todos los estados fisiológicos.

**Nivel de evidencia.** Alto.

**Limitaciones.**
Ese supuesto de hidratación constante es una de las razones por las que ESPEN acota la validez
de la bioimpedancia a sujetos con balance hidroelectrolítico estable (módulo 06).

**Interpretaciones NO admisibles.**
- Asumir que un dispositivo que reporta más variables emplea un modelo de más compartimentos.
- Tratar la masa libre de grasa como un tejido homogéneo (módulo 03).

**Referencias.** `espen_bia_1`
