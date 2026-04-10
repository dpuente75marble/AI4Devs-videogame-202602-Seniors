# Documentación de prompts — Chromix Sort MVP

## Introducción

### Propósito del documento

Este archivo recoge los **prompts en lenguaje natural** utilizados para guiar al asistente de IA durante el desarrollo del MVP de **Chromix Sort**. Sirve como anexo académico y de trazabilidad: muestra *qué* se pidió al modelo en cada etapa conceptual, alineado con la documentación de producto, especificación y diseño del repositorio.

### Uso de la IA (Cursor) en el desarrollo

El proyecto se desarrolló con **Cursor** como entorno principal. Los prompts se emplearon para:

- **Elicitar y redactar** definiciones de producto, requisitos y diseño técnico de forma iterativa.
- **Traducir** decisiones de alto nivel en borradores estructurados que luego se consolidaron en documentos del proyecto.
- **Apoyar la implementación** (HTML, CSS, JavaScript) y las **revisiones** de calidad, coherencia y UX a partir del contexto ya definido en specs y tareas.

El modelo actuó como **copiloto**: las respuestas se revisaron, encajaron en **Spec Driven Development (SDD)** y en los artefactos generados con **Spec Kit** (constitución, spec, plan, lista de tareas por fases), sin sustituir el criterio del equipo ni el control de versiones.

### Spec Kit y enfoque SDD

El flujo de trabajo siguió fases reconocibles de SDD con apoyo de Spec Kit:

1. Definición de producto  
2. Especificación funcional  
3. Diseño técnico  
4. Constitución y principios del proyecto  
5. Especificación / plan / tareas  
6. Implementación por fases (p. ej. setup, cimientos, historias de usuario)  
7. Validación y revisión  

Los prompts siguientes se redactaron **antes o durante** esas fases para orientar al asistente; la **fuente de verdad** del alcance y del comportamiento del juego sigue siendo la documentación formal en `docs/`, `specs/` y el código en `chromix-sort-dlp/`.

---

## 1. Definición de producto

### Para qué se usó

Fijar la **visión de producto** del puzzle Chromix Sort: qué es el juego, para quién, qué problema resuelve y cómo se diferencia, en lenguaje de producto (no técnico).

### Prompt original

Actúa como un experto en diseño de producto y desarrollo de videojuegos web.

Quiero crear un juego tipo puzzle llamado "Chromix Sort".

El juego consiste en ordenar colores dentro de tubos o columnas. El jugador puede mover fichas de un tubo a otro siguiendo reglas específicas.

Necesito que me generes:

- Definición clara del producto
- Objetivo del juego
- Público objetivo
- Propuesta de valor
- Diferenciación frente a otros juegos similares

Sé claro, estructurado y orientado a producto real.

---

## 2. Especificación funcional

### Para qué se usó

Obtener una **base de requisitos y comportamiento** del sistema (funcionales y no funcionales, reglas, casos de uso y flujo de usuario) alineada con **Spec Driven Development**, sin entrar aún en código.

### Prompt original

Actúa como un experto en ingeniería de software aplicando Spec Driven Development.

A partir del juego "Chromix Sort", genera:

- Requisitos funcionales
- Requisitos no funcionales
- Reglas del juego
- Casos de uso principales
- Flujo del usuario

No escribas código. Solo definición.

---

## 3. Diseño técnico

### Para qué se usó

Definir la **arquitectura frontend** del MVP (HTML, CSS, JavaScript): módulos, responsabilidades, modelo de estado y estructura de archivos, manteniendo la solución simple y mantenible.

### Prompt original

Actúa como un arquitecto frontend senior.

Define:

- Arquitectura del juego en HTML, CSS y JavaScript
- Separación de responsabilidades
- Componentes principales
- Modelo de estado del juego
- Estructura de archivos recomendada

Mantén la solución simple pero bien estructurada.

---

## 4. Planificación

### Para qué se usó

Descomponer el trabajo en **fases y tareas ordenadas**, con criterios de qué construir primero y qué validar en cada etapa, en rol de liderazgo técnico.

### Prompt original

Actúa como un tech lead.

Divide el desarrollo en pasos:

- Fases de implementación
- Tareas ordenadas
- Qué construir primero
- Qué validar en cada fase

---

## 5. Implementación

### Para qué se usó

Solicitar la **generación del código base** del juego (marcado, estilos y lógica) a partir de la definición acumulada, con énfasis en claridad y funcionamiento.

### Relación con las fases de implementación

El prompt siguiente pide una entrega **integral** (HTML, CSS y JavaScript). En la práctica, el desarrollo del MVP se alineó además con la **lista de tareas por fases** del Spec Kit (p. ej. setup, capa de dominio, historias de usuario, pulido), documentada en `specs/001-chromix-sort-mvp/tasks.md`. Este archivo no duplica esos prompts intermédios: solo documenta el prompt holístico que figura en el historial de trabajo.

### Prompt original

Actúa como un desarrollador experto.

A partir de toda la definición anterior:

- Genera el HTML base
- Genera el CSS visual moderno
- Genera la lógica en JavaScript

El código debe ser limpio, entendible y funcional.

---

## 6. Validación y revisión

### Para qué se usó

Realizar una **pasada de revisión** sobre el código ya generado: mejoras, posibles refactors, UX/UI y comprobación de que la experiencia resulte intuitiva.

### Prompt original

Actúa como un reviewer senior.

Analiza el código generado y:

- Detecta mejoras
- Sugiere refactors
- Mejora UX/UI
- Asegura que el juego es intuitivo
