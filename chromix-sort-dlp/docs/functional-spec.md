# Chromix Sort — Especificación funcional (SDD)

**Versión:** 1.0 (MVP)  
**Alcance:** un único tablero predefinido; sin backend, sin autenticación y sin persistencia de datos entre sesiones.

---

## 1. Alcance y exclusiones explícitas

| Incluido en el MVP | Fuera de alcance |
|--------------------|------------------|
| Un tablero fijo, jugable de principio a fin | Catálogo de niveles, desbloqueo o progresión entre escenarios |
| Lógica de juego y feedback en cliente | Servidor, API, base de datos |
| Reinicio del mismo tablero en memoria | Cuentas de usuario, inicio de sesión |
| Métricas locales de la partida actual (p. ej. movimientos, tiempo de sesión) | Guardado de puntuaciones o estado entre visitas al sitio |

---

## 2. Requisitos funcionales

### 2.1 Tablero y representación

- **RF-01:** El sistema debe mostrar un único estado inicial de tablero, con un conjunto fijo de tubos (columnas) y fichas apiladas en cada uno según el diseño del MVP.
- **RF-02:** Cada tubo debe tener una capacidad máxima visible y coherente con las reglas de apilado (el jugador debe poder inferir cuánto espacio queda).
- **RF-03:** Las fichas deben identificarse por color de forma inequívoca (misma semántica de color en todo el tablero).

### 2.2 Interacción y movimientos

- **RF-04:** El jugador debe poder seleccionar un tubo de origen y un tubo de destino (o un gesto equivalente definido en UI, p. ej. toque/clic secuencial) para intentar un movimiento.
- **RF-05:** El sistema debe validar cada intento de movimiento contra las reglas del juego (sección 4) y aplicar solo los movimientos válidos.
- **RF-06:** Tras un movimiento válido, el sistema debe actualizar el estado del tablero de forma inmediata y coherente (origen y destino reflejados correctamente).
- **RF-07:** Tras un movimiento inválido, el sistema debe mantener el estado del tablero sin cambios y comunicar el motivo de rechazo de forma breve y comprensible (texto, icono o mensaje contextual).

### 2.3 Condición de victoria y fin de partida

- **RF-08:** El sistema debe detectar automáticamente la victoria cuando se cumple la condición definida en las reglas (cada tubo con un solo color o vacío, según criterio cerrado en 4.4).
- **RF-09:** Al producirse la victoria, el sistema debe mostrar un estado de “partida completada” con resumen mínimo de la sesión (p. ej. número de movimientos y/o tiempo transcurrido en la partida actual).
- **RF-10:** Debe existir una acción explícita para **reiniciar** el tablero al estado inicial del MVP, disponible al menos desde la pantalla de juego y, si aplica, desde el estado de victoria.

### 2.4 Partida y sesión (solo cliente)

- **RF-11:** Al cargar la aplicación, debe iniciarse una nueva partida con el tablero MVP por defecto, sin requerir configuración previa del usuario.
- **RF-12:** No se exige recuperación del estado tras cerrar o recargar la página; un nuevo acceso equivale a una nueva partida con el mismo tablero inicial.
- **RF-13:** (Opcional recomendado) Pausa solo como bloqueo de interacción o overlay informativo, sin implicar guardado persistente.

### 2.5 Accesibilidad mínima de uso

- **RF-14:** Todas las acciones necesarias para completar el puzzle deben ser realizables con puntero **o** teclado (o equivalente accesible acordado en implementación), sin depender exclusivamente de un solo dispositivo.
- **RF-15:** Los mensajes de error y de victoria deben ser legibles y contrastados respecto al fondo, acordes con la guía visual del producto.

---

## 3. Requisitos no funcionales

### 3.1 Rendimiento y fluidez

- **RNF-01:** La respuesta a una acción del jugador (validación y actualización visual) debe percibirse como inmediata en condiciones normales de navegador (objetivo orientativo: por debajo de 100 ms entre interacción y feedback visible, salvo limitaciones del dispositivo).
- **RNF-02:** Las animaciones de movimiento de fichas (si existen) no deben bloquear la entrada del siguiente comando de forma que genere confusión; la cola de interacción debe estar definida (p. ej. ignorar input duplicado durante animación corta o encolar un único siguiente paso).

### 3.2 Compatibilidad y despliegue

- **RNF-03:** El juego debe ejecutarse en navegadores modernos de escritorio y móvil definidos por el equipo (versiones mínimas documentadas en el plan técnico).
- **RNF-04:** El layout debe adaptarse a distintos tamaños de viewport sin romper la legibilidad del tablero ni ocultar controles esenciales (reinicio, mensajes).

### 3.3 Usabilidad y claridad

- **RNF-05:** Un usuario del público objetivo debe poder entender la meta del puzzle y realizar el primer movimiento válido sin tutorial largo (copy mínimo en pantalla o indicación visual equivalente).
- **RNF-06:** Los mensajes ante movimientos inválidos deben **enseñar la regla** (qué condición no se cumple), no limitarse a un rechazo genérico.

### 3.4 Fiabilidad lógica

- **RNF-07:** El motor de reglas debe ser determinista: mismas acciones sobre el mismo estado producen el mismo resultado.
- **RNF-08:** No debe ser posible, mediante la UI, dejar el tablero en un estado interno inconsistente (p. ej. más fichas en un tubo que su capacidad, o colores “perdidos”).

### 3.5 Seguridad y privacidad (MVP local)

- **RNF-09:** No se recopilan credenciales ni datos personales como parte del alcance funcional descrito.
- **RNF-10:** No hay comunicación obligatoria con servidores propios del juego para jugar una partida.

---

## 4. Reglas del juego

### 4.1 Estructura del tablero

- Hay **N tubos** (N fijo para el MVP), cada uno con una **capacidad máxima** de fichas (puede ser uniforme u homologada por diseño del tablero único).
- Las fichas se apilan **de abajo arriba** en cada tubo. Solo la porción superior del tubo interviene en los movimientos según 4.2.

### 4.2 Movimiento permitido

- En un movimiento, el jugador traslada únicamente la ficha superior del tubo origen hacia el tubo destino.
- El destino debe tener al menos un espacio disponible para recibir la ficha.
- El tubo destino debe estar vacío o la ficha en su cima debe ser del mismo color que la ficha que se mueve (criterio estándar de puzzles tipo ordenación en tubos).

### 4.3 Movimientos no permitidos (ejemplos orientativos)

- Origen vacío.
- Destino sin capacidad suficiente para el bloque seleccionado.
- Intento de mover un bloque cuyo color no coincide con la cima del destino cuando el destino no está vacío.
- Cualquier otra variante explícita que el equipo decida añadir al tablero único (p. ej. tubo no interactivo) debe documentarse en un anexo de “reglas del tablero MVP” y reflejarse en la UI.

### 4.4 Condición de victoria

- **Victoria:** todos los tubos cumplen simultáneamente que están **vacíos** o contienen fichas de **un solo color** (sin mezcla de colores en el mismo tubo), y no queda ningún estado intermedio requerido por el diseño (p. ej. si el MVP exige exactamente K tubos ocupados, debe especificarse en el anexo del tablero; por defecto, basta con la definición de “sin mezclas” y distribución coherente con el puzzle planteado).

### 4.5 Reinicio

- Reiniciar restaura el **mismo** estado inicial del único tablero MVP y pone a cero los contadores de sesión asociados a esa partida (movimientos, tiempo si se muestra).

---

## 5. Casos de uso principales

| ID | Actor | Caso de uso | Resumen |
|----|--------|-------------|---------|
| UC-01 | Jugador | Jugar partida en el tablero MVP | Accede al juego, realiza movimientos válidos hasta ganar o hasta decidir reiniciar. |
| UC-02 | Jugador | Realizar movimiento válido | Selecciona origen y destino; el sistema aplica la regla, actualiza el tablero y, si aplica, incrementa el contador de movimientos. |
| UC-03 | Jugador | Intentar movimiento inválido | Selecciona origen y destino que incumplen reglas; el sistema rechaza, explica brevemente y no altera el estado. |
| UC-04 | Jugador | Completar el puzzle | El sistema detecta victoria, muestra confirmación y métricas de la sesión actual. |
| UC-05 | Jugador | Reiniciar tablero | Vuelve al estado inicial predefinido y reinicia métricas de sesión. |
| UC-06 | Jugador | Abandonar o recargar | Cierra o recarga la página; al volver a entrar, una nueva sesión comienza con el tablero inicial (sin recuperar la partida anterior). |

---

## 6. Flujo del usuario

1. **Entrada:** el usuario abre la aplicación del juego en el navegador. Ve el tablero único ya cargado, tubos y fichas visibles, y controles mínimos (p. ej. reinicio, título o breve indicación de objetivo).
2. **Orientación:** en un vistazo entiende que debe agrupar colores por tubo (sin flujo de login ni selección de nivel).
3. **Juego activo:** selecciona tubo origen y tubo destino (o interacción equivalente). Recibe feedback inmediato: animación o cambio visual si el movimiento es válido; mensaje claro si no lo es.
4. **Iteración:** repite hasta alcanzar la condición de victoria o hasta pulsar reinicio en cualquier momento.
5. **Victoria:** el sistema muestra estado de completado y métricas de la sesión (p. ej. movimientos, tiempo). El usuario puede reiniciar para volver a jugar el mismo tablero desde cero.
6. **Salida:** al cerrar o recargar, la experiencia termina sin persistencia; la próxima visita repite el flujo desde el paso 1.

---

## 7. Trazabilidad

Esta especificación implementa el alcance descrito en la definición de producto **Chromix Sort** para un MVP de **un solo tablero** y debe mantenerse alineada con el prototipo jugable y con cualquier anexo que detalle el layout exacto del tablero MVP (número de tubos, capacidades y colores).
