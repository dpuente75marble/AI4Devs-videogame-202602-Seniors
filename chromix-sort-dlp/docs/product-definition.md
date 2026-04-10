# Chromix Sort — Definición de producto

**Versión:** 1.0 (entregable máster)  
**Formato:** puzzle web de ordenación por colores en tubos/columnas

---

## Definición del producto

**Chromix Sort** es un videojuego puzzle para navegador en el que el jugador reorganiza fichas de color dentro de varios tubos (columnas) hasta que cada tubo contenga un solo color o quede vacío, según las reglas del nivel. Las acciones se limitan a mover bloques coherentes de fichas entre tubos (típicamente solo la parte superior de un tubo hacia otro que tenga espacio y cumpla las restricciones del puzzle).

El producto se concibe como un **MVP jugable y presentable** dentro de un máster: una experiencia autocontenida, sin cuenta obligatoria, con un único tablero diseñado para demostrar las mecánicas principales del juego, pensada para demostrar diseño de producto, reglas claras, UX de puzzle y una implementación web sólida.

---

## Objetivo del juego

- **Meta principal:** resolver el tablero actual agrupando correctamente todas las fichas por color, de forma que cada tubo contenga un único color o esté vacío.

- **Meta de sesión:** completar el puzzle con el menor número de movimientos posible, entendiendo rápidamente las reglas y sin necesidad de tutorial complejo.

- **Meta de aprendizaje (proyecto académico):** demostrar que el juego es intuitivo desde el primer uso, que las reglas son claras sin explicación extensa y que la experiencia es fluida y coherente en un único escenario bien diseñado.

---

## Público objetivo

| Segmento | Descripción |
|----------|-------------|
| **Principal** | Jugadores casuales de puzzle en web y móvil (sesiones de 3–10 minutos), familiarizados con juegos tipo “ball sort” / ordenación en tubos. |
| **Secundario** | Perfiles técnicos y docentes del máster que evalúan **claridad de producto**, usabilidad y calidad de entrega. |
| **No objetivo (MVP)** | Competición online masiva, monetización agresiva o narrativa compleja; pueden quedar fuera del alcance inicial salvo decisión explícita del equipo. |

**Supuestos de contexto de uso:** navegador moderno, partidas en pausa/reinicio de nivel, feedback visual inmediato en cada movimiento válido o inválido.

---

## Propuesta de valor

1. **Claridad inmediata:** en una pantalla se entiende el tablero, los tubos y la acción principal (mover color de A a B).
2. **Ritmo calmado y cognitivo:** estimula planificación corta y prueba de hipótesis sin depender de reflejos.
3. **Progresión medible:** niveles cerrados permiten enseñar reglas y luego complicar el espacio de solución.
4. **Entregable profesional del máster:** demuestra capacidad de **definir producto**, especificar reglas, diseñar flujo de juego y construir una pieza web coherente de principio a fin.

---

## Diferenciación frente a juegos similares

Los puzzles de “ordenar bolas/colores en tubos” son un género muy saturado. **Chromix Sort** puede diferenciarse en el marco del proyecto si el equipo apuesta por una o más de estas líneas (elegir y documentarlas en la siguiente fase de diseño):

| Ámbito | Oportunidad de diferenciación |
|--------|-------------------------------|
| **Identidad** | Nombre, paleta y estética propias (“Chromix”) que no imiten un clon genérico; coherencia visual tubo–ficha–feedback. |
| **Reglas** | Variantes explícitas (límite de movimientos, tubos “bloqueados”, fichas especiales, capacidades distintas por tubo) **bien explicadas en UI**, no solo más tubos. |
| **UX** | Tutorial mínimo, animaciones que enseñan, mensajes de error que **enseñan la regla** en lugar de solo bloquear. |
| **Alcance MVP** | Enfoque en **pocos niveles muy pulidos** y métricas simples (tiempo, movimientos) frente a catálogos enormes sin pulir. |
| **Transparencia académica** | Documentación de producto + especificación funcional + decisiones de diseño; valor añadido frente a un clon sin criterio. |

---

## Nota de alcance (proyecto máster)

Este documento fija el **qué** y el **para quién**. Las reglas exactas de movimiento, límites y condición de victoria por nivel deben cerrarse en la **definición funcional (SDD)** y mantenerse alineadas con el prototipo jugable.
