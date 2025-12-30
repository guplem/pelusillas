- # 🎴 **Boom** — Card Game

	## 🃏 Required Materials

	Play with a poker deck or equivalent, which must include:

	- Numbered cards: **A (1), 2, 3, 4, 5, 6, 7, 8, 9, 10**
	- Face cards: **J, Q, K**

	Each card should exist in multiple copies (ideally at least 4, one per suit).

	------

	## 🎯 Objective of the Game

	The goal is to be the **last player standing**, eliminating others by destroying all their **accumulator cards**.

	------

	## 🧩 Setup

	1. Shuffle all cards and place them as a **face-down deck** in the center of the table.

	2. Set aside space for a **discard pile**.

	3. Each player is given:

		- **3 cards in hand** (randomly drawn).

		- **3 cards on the board**, in front of the player, which act as **accumulators**.

			> The initial value of each accumulator is the value of the corresponding card.

			> If all 3 cards are face cards, they must be redrawn.

	------

	## 🔢 Card Values

	| Card    | Value               |
	| ------- | ------------------- |
	| A (1)   | 1                   |
	| 2 – 10  | Their numeric value |
	| J, Q, K | 0                   |

	- A card’s value represents both the **maximum life** that can be stored and its **attack strength**.
	- **Face cards** (J, Q, K) **do not store life** and **cannot be attacked**.

	------

	## 🔄 Game Turn

	Each turn consists of three phases, where the player can perform **one action of each type**, in the specified order: Swap, Action (discard, attack, or Boom), and End turn.

	### 1. **Swap**

	- You may exchange **one card from your hand** with **one of your board cards** (accumulator).

	- **Important**:

		> Swapping is optional.

		> You cannot swap an accumulator that has been attacked (i.e., one with another card on top).

		> The (initial) value of the accumulator becomes that of the new card, and the old card moves to your hand and can be used for attacking, Boom, discarding, or swapping again in future turns.

	------

	### 2. **Action: Choose Between Discard, Attack or Boom**

	You must choose *exactly* **one of the following actions**.

	#### a) **Attack**

	- **Selection**:

		- Choose **one card from your hand**.
		- Select **an accumulator of an opponent** that is **not a face card**, since face cards cannot be attacked.

	- **Numerical Restriction**:

		> The attacking card **must not exceed** the current value (or remaining life) of the accumulator. That is, the subtraction cannot result in a negative number.

	- **Executing the Attack**:

		1. Place the attacking card on top of the opponent's accumulator.
		2. Subtract the value of the attacking card from the current value of the accumulator to get the new value.
		3. If, after the attack, the accumulator reaches **0**, it is removed from the board along with the attacking card and any others stacked on top.

	- **Gaining Extra Accumulators**:

		- If the **original value** of the accumulator (the card’s own value) is **exactly equal** to the attacking card’s value, and the accumulator is destroyed in a single blow, you gain an **extra accumulator**.

		- **Extra Accumulator Procedure**:

			> Take a card from the deck and place it on the board as a new accumulator. After this, at the end of the action, draw one card from the deck to refill your hand.

	#### c) **Boom**

	- Requirements:

		- You must have **3 face cards** (J, Q, K) in your hand.

	- Execution:

		1. Declare a number from **1 to 10** (e.g., “Boom on 2”).
		2. All **accumulators** on the board with exactly that value are eliminated immediately (including any stacked cards). This applies to both opponents' and your own accumulators if applicable.
		3. The 3 face cards used for Boom are discarded to the pile.

		> Boom cannot be used on face cards.

	#### b) **Discard**

	- If you choose **not to attack** or use **Boom**, you **must discard** between **1 and 3 cards** from your hand to the discard pile.

	------

	### 3. **End Turn**

	After completing your Discard, Attack, or Boom action, end your turn with the following steps:

	- **Draw Cards**:
		- If you **discarded** 1 to 3 cards, draw the same number from the deck to return to 3 cards in hand.
		- If you **attacked**, draw **1 card**.
		- If you performed a **Boom**, draw **3 cards**.
		- *Exception (extra accumulator)*: When you gain an extra accumulator after an exact attack, the card used for the extra accumulator is placed directly on the board, and you then draw 1 card from the deck to refill your hand.
	- Once you've drawn cards, your turn ends and play passes to the next player.

	------

	## 🚨 End of Game

	- **Elimination**:
		- A player is eliminated when **all their board cards have been destroyed** or when the **sum of their accumulator values is 0** (e.g., only face cards remain).
	- **Victory**:
		- The **winner** is the last player with at least one accumulator holding life.
	- If **all players are eliminated simultaneously**, the game ends in a **draw**.

	------

	## 🔁 Additional Rules

	- Cards are continuously shuffled, so **card counting** is not possible, except for those visible on the board.
	- When the **deck runs out**, shuffle the discard pile to form a new deck.