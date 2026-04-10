# Chromix Sort — Diseño técnico (MVP)

**Versión:** 1.0  
**Alcance:** un único tablero predefinido; sin backend; sin frameworks; solo HTML, CSS y JavaScript en el navegador.

---

## 1. Objetivo del documento

Describir la arquitectura del cliente, los componentes lógicos, el modelo de estado, la organización recomendada de archivos y el flujo de datos para implementar el MVP de **Chromix Sort** de forma simple, mantenible y alineada con la especificación funcional.

---

## 2. Arquitectura general (C4 simplificado)

### 2.1 Contexto (nivel sistema)

- **Actor:** el jugador (navegador en escritorio o móvil).
- **Sistema:** la aplicación web estática del juego (documento HTML + estilos + script).
- **Dependencias externas:** ninguna obligatoria para jugar (sin API propia, sin base de datos, sin autenticación). Opcionalmente el hosting sirve archivos estáticos.

En una sola frase: el navegador carga la página, ejecuta la lógica en cliente y pinta el tablero; toda la partida vive en memoria hasta recargar o cerrar.

### 2.2 Contenedor (nivel aplicación)

Un único contenedor: **aplicación SPA ligera** (una pantalla de juego) compuesta por:

| Capa | Rol |
|------|-----|
| **Presentación** | Estructura HTML, estilos CSS y manejadores de eventos (clic, teclado, foco) que reflejan el estado del tablero y los mensajes al usuario. |
| **Lógica de dominio** | Reglas del puzzle: validación de movimientos, aplicación de cambios al estado, detección de victoria, reinicio al layout inicial. |
| **Datos de configuración** | Definición del tablero MVP (tubos, capacidades, colores iniciales) como datos constantes o módulo de solo lectura. |

No hay contenedor servidor en el MVP.

### 2.3 Componentes internos (nivel código, agrupación lógica)

Dentro del script del cliente se distinguen responsabilidades (pueden ser archivos separados o secciones claras en un solo archivo, según el tamaño final):

1. **Estado y transiciones:** mantiene la representación actual del tablero y métricas de sesión; expone operaciones atómicas (intentar movimiento, reiniciar).
2. **Motor de reglas:** funciones puras o casi puras que, dado un estado y una acción, devuelven si el movimiento es válido, el motivo de rechazo y el nuevo estado si aplica.
3. **Renderizado / vista:** traduce el estado a DOM (o actualiza clases y atributos) y aplica feedback visual (selección de tubo, mensajes, overlay de victoria).
4. **Entrada:** capta eventos de usuario, las traduce a intenciones de juego (seleccionar origen, seleccionar destino, reiniciar, pausa si existe) y las envía a la capa de estado sin mezclar reglas con manipulación directa del DOM en exceso.
5. **Arranque:** inicialización al cargar (crear estado inicial desde configuración, primer render, registro de listeners).

Principio rector: **la verdad del juego está en el modelo de estado**; la UI solo refleja ese modelo y envía intenciones.

---

## 3. Componentes principales

### 3.1 Configuración del tablero MVP

- Describe el número de tubos, capacidad por tubo (si aplica) y la pila inicial de colores por tubo.
- No contiene lógica de juego; solo datos o una función que devuelve el estado inicial clonable.

### 3.2 Modelo de estado (ver sección 4)

- Fuente única de verdad para fichas, tubos, fase de la partida y métricas.

### 3.3 Motor de reglas

- Entrada típica: estado actual, índice de tubo origen, índice de tubo destino.
- Salida: resultado tipificado (válido con nuevo estado / inválido con código o mensaje de regla).
- Incluye: condición de victoria y reinicio determinista al layout inicial.

### 3.4 Controlador de interacción (flujo origen → destino)

- Gestiona el modo de selección (ningún tubo seleccionado → origen → destino o cancelación).
- Evita estados de UI incoherentes (por ejemplo, doble origen sin destino) alineados con el modelo mental del jugador.

### 3.5 Vista / render

- Construye o actualiza la representación visual de tubos y fichas.
- Muestra mensajes de error breves y educativos (alineado con RNF-06).
- Muestra pantalla o bloque de victoria con métricas de sesión.
- Expone controles: reinicio (y pausa opcional como bloqueo de entrada).

### 3.6 Accesibilidad y entrada alternativa

- Mapeo teclado (foco, activación, navegación entre tubos) equivalente al puntero donde la especificación lo exija.
- Mantiene la misma canalización hacia “intentar movimiento” que el clic.

### 3.7 Temporización de sesión (opcional pero previsto en spec)

- Contador de movimientos incrementado solo en movimientos válidos.
- Cronómetro o duración de partida en memoria, reseteado en reinicio.

---

## 4. Modelo de estado del juego

### 4.1 Estructura conceptual

El estado debe poder serializarse mentalmente como un objeto raíz con:

- **Tubos:** lista ordenada de tubos; cada tubo tiene una capacidad máxima y una pila de fichas (de abajo arriba en el modelo; la última posición de la lista representa la cima).
- **Ficha:** en el MVP basta con un identificador de color (enumeración o cadena estable), coherente en todo el tablero.
- **Fase de partida:** por ejemplo `jugando` | `victoria` | `pausada` (si se implementa pausa como bloqueo).
- **Selección de UI:** qué tubo está resaltado como origen pendiente (si el flujo es en dos pasos); puede vivir en el estado global o en un subestado de “UI” si se prefiere separación estricta.
- **Métricas de sesión:** número de movimientos válidos acumulados; marca de tiempo de inicio o tiempo transcurrido según diseño.
- **Mensaje transitorio:** texto o código del último error de regla para mostrar y opcionalmente limpiar tras un timeout (sin persistir en disco).

### 4.2 Invariantes que el código debe preservar

- Ningún tubo supera su capacidad.
- Solo la cima del origen se considera en un movimiento (según reglas del SDD).
- Tras un movimiento inválido, el estado del tablero es idéntico al anterior.
- Reiniciar copia el layout inicial desde la configuración y pone a cero métricas y selección.

### 4.3 Transiciones principales

| Evento | Efecto en el estado |
|--------|---------------------|
| Carga de la aplicación | Estado inicial desde configuración MVP; fase `jugando`. |
| Movimiento válido | Actualizar pilas origen/destino; incrementar movimientos; comprobar victoria. |
| Movimiento inválido | Sin cambio en tubos; registrar motivo para la vista. |
| Victoria detectada | Fase `victoria`; congelar o limitar interacción según UX acordada. |
| Reinicio | Restaurar tablero inicial; resetear métricas y fase a `jugando`; limpiar selección y mensajes. |

---

## 5. Estructura de archivos recomendada y responsabilidades

Ajustar nombres al criterio del equipo; la intención es **una carpeta por tipo de responsabilidad**.

```
proyecto/
├── index.html          # Punto de entrada: estructura mínima, contenedor del juego, enlaces a CSS/JS
├── css/
│   └── styles.css      # Layout del tablero, tubos, fichas, tipografía, contrastes, responsive, estados visuales
├── js/
│   ├── main.js         # Arranque: importar/inicializar estado, vista y entrada; orquestación del ciclo de vida
│   ├── config.js       # Datos del tablero MVP (solo definición inicial)
│   ├── state.js        # Creación de estado inicial, clonado, reinicio; quizá contenedor del estado mutable
│   ├── rules.js        # Validación y aplicación de movimientos; detección de victoria (sin tocar DOM)
│   ├── view.js         # Render y actualización incremental del DOM según estado; mensajes y overlay
│   └── input.js        # Listeners de puntero/teclado; traducción a acciones sobre state/rules
└── assets/             # (Opcional) iconos, fuentes; solo si el diseño lo requiere
```

### Responsabilidades por archivo (resumen)

| Archivo | Responsabilidad |
|---------|-----------------|
| **index.html** | Marco semántico del juego (título, región principal del tablero, botones accesibles); no lógica de negocio. |
| **styles.css** | Presentación y estados visuales; breakpoints; no decisiones de reglas del puzzle. |
| **config.js** | Tablero único MVP: constantes que describen el problema inicial. |
| **rules.js** | Toda la lógica determinista de validez, efectos y victoria; fácil de razonar y probar mentalmente. |
| **state.js** | Donde vive el estado mutable y las operaciones que delegan en rules y devuelven el nuevo estado o errores. |
| **view.js** | Sincronización estado → pantalla; sin reimplementar reglas. |
| **input.js** | Eventos → intenciones; no actualizar tubos “a mano” sin pasar por state/rules. |
| **main.js** | Cableado: orden de init, posible gestión de animaciones cortas vs. cola de input (RNF-02). |

Si el MVP se mantiene muy pequeño, es aceptable fusionar **state** y **rules** en un solo módulo, siempre que las fronteras conceptualmente sigan claras en comentarios mínimos o en nombres de funciones.

---

## 6. Flujo de datos

### 6.1 Vista unidireccional (recomendada)

1. El **usuario** actúa sobre el DOM (clic, tecla).
2. **input.js** interpreta la acción y llama a una API del núcleo (p. ej. “seleccionar tubo i”, “confirmar destino j”, “reiniciar”).
3. **state.js** (y **rules.js**) calculan el siguiente estado o el error.
4. **view.js** recibe el estado actualizado (o el mismo, si hubo error) y el mensaje a mostrar, y actualiza la interfaz.

Así se evita que la UI y el modelo diverjan.

### 6.2 Flujo de un movimiento válido

Usuario elige origen y destino → entrada valida índices → motor comprueba reglas → si es válido, se genera nuevo estado de tubos → se incrementa contador de movimientos → se evalúa victoria → la vista repinta tubos y, si aplica, muestra el panel de victoria.

### 6.3 Flujo de un movimiento inválido

Misma entrada → motor devuelve rechazo con motivo alineado a la regla rota → el estado de tubos no cambia → la vista muestra feedback breve (y opcionalmente mantiene o limpia la selección según UX).

### 6.4 Reinicio

Acción explícita del usuario → estado se reemplaza por una copia profunda del inicial desde **config.js** → métricas a cero → vista restaura apariencia de partida nueva.

### 6.5 Relación con animaciones

Si hay animaciones de traslado de fichas: el modelo puede actualizarse de inmediato y la vista puede reproducir la transición; durante una animación corta, la capa de entrada debe definir si ignora clics adicionales o encola un solo siguiente paso (RNF-02), sin permitir estados imposibles en el modelo.

---

## 7. Decisiones técnicas explícitas del MVP

- **Sin persistencia:** recargar la página implica nueva partida; no se usa `localStorage` ni cookies para el alcance descrito.
- **Sin build obligatorio:** se puede servir tal cual; si más adelante se añade empaquetado, la separación por módulos ya facilita la migración.
- **Determinismo:** no hay aleatoriedad en el tablero MVP salvo que se decida lo contrario en documentación de producto; el reinicio debe ser reproducible.
- **Pruebas:** la lógica en **rules.js** (y el modelo de tubos) es el candidato natural a pruebas manuales tabuladas o automatizadas si el proyecto las introduce más adelante.

---

## 8. Trazabilidad

Este diseño implementa el alcance del MVP descrito en la especificación funcional (tablero único, reglas de movimiento y victoria, reinicio, métricas de sesión, accesibilidad mínima) y la definición de producto **Chromix Sort**, manteniendo el stack restringido a HTML, CSS y JavaScript sin dependencias de framework.
