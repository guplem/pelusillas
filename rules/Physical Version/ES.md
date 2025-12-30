# 🎴 **Boom** — Juego de Cartas

## 🃏 Material Necesario

Se juega con una baraja de póker o equivalente, que debe incluir:
- Cartas numeradas: **A (1), 2, 3, 4, 5, 6, 7, 8, 9, 10**
- Figuras: **J, Q, K**

Cada carta debe existir en varias copias (idealmente al menos 4, una por cada palo).

---

## 🎯 Objetivo del Juego

El objetivo es ser el **último jugador en pie**, eliminando a los demás al destruir todos sus **acumuladores**.

---

## 🧩 Preparación

1. Baraja todas las cartas y colócalas formando el **mazo boca abajo** en el centro de la mesa.
2. Dispón un espacio para la **pila de descartes**.
3. A cada jugador se le asignan:
   - **3 cartas en la mano** (elegidas al azar).
   - **3 cartas en el tablero**, frente al jugador, que actuarán como **acumuladores**.
     
     > El valor inicial de cada acumulador es el valor de la carta correspondiente.
     
     > En el caso de que las 3 cartas sean figuras, se vuelven a repartir las cartas.

---

## 🔢 Valores de las Cartas

| Carta   | Valor             |
| ------- | ----------------- |
| A (1)   | 1                 |
| 2 – 10  | Su valor numérico |
| J, Q, K | 0                 |

- El valor de una carta representa tanto **la vida máxima** que puede almacenar el acumulador como la **fuerza de ataque** de la carta.
- Las **figuras** (J, Q, K) **no almacenan vida** y **no pueden ser atacadas**.

---

## 🔄 Turno de Juego

Cada turno se compone de tres fases, donde el jugador puede realizar **una acción de cada tipo**, en el orden especificado: Cambiar, Accionar (descartar, atacar o invocar Boom) y Finalizar el turno.

### 1. **Cambiar**

- Puedes intercambiar **una carta de tu mano** con **una de tus cartas en el tablero** (acumulador).
- **Importante**:
  > No es obligatorio cambiar.  
  
  > No se puede cambiar un acumulador que haya sido atacado (es decir, que tenga otra carta encima).
  
  > El valor (inicial) del acumulador pasa a ser el de la nueva carta, y la carta anterior pasa a la mano del jugador, pudiéndose usar para atacar, boom, descartar o cambiarla otra vez en turnos posteriores.

---

### 2. **Acción: Elegir Entre Descartar, Atacar o Boom**

Debes escoger *exactamente* **una de las siguientes acciones**.

#### a) **Atacar**

- **Selección**:
  
  - Elige **una carta de tu mano**.
  - Escoge **un acumulador de un enemigo** que **no sea una figura**, ya que las figuras no pueden recibir ataque.
- **Restricción numérica**:
  
  > La carta atacante **no puede tener un valor superior** al valor actual (o vida restante) del acumulador. Es decir, no se permite que la resta resulte en un valor negativo.
- **Ejecución del Ataque**:
  
  1. Coloca la carta atacante sobre el acumulador enemigo.
  2. Resta el valor de la carta al valor actual del acumulador para obtener el nuevo valor.
  3. Si, tras el ataque, el acumulador llega a **0**, éste se retira del tablero juntamente con la carta atacante y todas las cartas que haya encima.
- **Ganar Acumuladores Extra**:
  - Si el **valor original** del acumulador (el valor de la carta en sí) es **exactamente igual** al valor de la carta atacante y, con ello, se destruye el acumulador de un enemigo en un solo ataque, ganas un **acumulador extra**.
  - **Procedimiento Acumulador Extra**:
    > Se toma una carta del mazo y se coloca en el tablero como un nuevo acumulador. Una vez hecho esto, al finalizar la acción, robas una carta del mazo para reponer tu mano.

#### c) **Boom**

- Requisitos:
  - Debes tener en tu mano **3 figuras** (J, Q, K).
  
- Ejecución:
  1. Declara un número del **1 al 10** (por ejemplo, “Boom al 2”).
  2. Se eliminan del tablero **todos los acumuladores** que tengan exactamente ese valor en ese instante (incluyendo las cartas que tuvieran encima). Esta eliminación afecta tanto a los acumuladores de los oponentes como a los tuyos si alguno coincide.
  3. Las 3 figuras que usaste para el Boom se descartan a la pila de descartes.
  
  > No se puede hacer Boom sobre acumuladores de figuras.

#### b) **Descartar**

- Si decides **no realizar** un **ataque** ni un **Boom**, **debes descartar** entre **1 y 3 cartas** de tu mano a la pila de descartes.

---

### 3. **Finalizar el Turno**

Al concluir la acción de Descartar, Atacar o Boom, finalizas tu turno siguiendo estos pasos:

- **Robo de Cartas**:
  - Si **descartaste** 1 a 3 cartas, robas la misma cantidad de cartas del mazo para volver a tener 3 en tu mano.
  - Si **atacaste**, robas **1 carta**.
  - Si realizaste un **Boom**, robas **3 cartas**.
  - *Excepción (acumulador extra)*: Cuando ganas un acumulador extra tras destruir un acumulador con un ataque exacto, la carta que sirve para el acumulador extra se coloca directamente en el tablero y, posteriormente, robas 1 carta del mazo para completar tu mano.
- Una vez completado el robo, tu turno finaliza y el juego continúa con el siguiente jugador.

---

## 🚨 Fin del Juego

- **Eliminación**:
  - Un jugador es eliminado cuando **todas sus cartas en el tablero han sido destruidas** o cuando, al sumar los valores de sus acumuladores, el total es **0** (por ejemplo, si únicamente quedan figuras en el tablero).
- **Victoria**:
  - El **ganador** es el último jugador que tenga al menos un acumulador con vida.
- En caso de que **todos los jugadores sean eliminados simultáneamente**, el juego termina en **empate**.

---

## 🔁 Reglas Adicionales

- Las cartas se barajan constantemente, de manera que **contar cartas** no es posible, salvo aquellas que están visibles en el tablero.
- Cuando el **mazo se agota**, baraja la pila de descartes para formar un nuevo mazo.