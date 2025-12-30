This repository contains a digitized board game called "Boom". Your goal is to completely transform it into another game called "Pelusillas", based on "Zirkus Flohcati".

Before making any changes, analyze the codebase: inspect the project structure and core modules to understand component interactions; study coding style, naming, error-handling, testing patterns, and dependencies; locate and review similar implementations and shared utilities; list reusable components and decide whether to use, extend, or create new ones while keeping consistency with conventions; then plan an implementation that follows existing patterns and reuses components.

The game should take advantage of the technology already present in the "Boom" codebase, reusing as much code as possible while adapting it to the new game's mechanics and rules.

The main features of "Pelusillas" include:

### **Game Overview**

* **Players:** 2-6

### **Components**

The game consists of **110 dust bunny cards**:

* **Values 1 to 5:** 13 cards of each number.
* **Values 6 to 10:** 9 cards of each number.

### **Objective**

Accumulate dust bunnies to gain points. However, you must manage your risk: if you collect too many, a draft might blow them away. The goal is to keep your cards until the start of your next turn to "bank" them as points.

### **Preparation**

Remove all cards from the box and mix them face down, spreading them out on the table to form a "dust pile".

> In the digital game the cards can be in a single pile and they are picked randomly, like in the "boom" game.

### **How to Play**

Play continues clockwise.

A turn consists of the following steps:

#### **1. Collect Dust Bunnies (Banking Points)**

At the very beginning of your turn, look at the cards face up in front of you (if any):

* If you have cards remaining from your previous turn, you collect them all.
* Place them in your personal score pile. These are now safe points for the end of the game.
* *Note:* In the first round, players will not have any cards to collect yet.

#### **2. Search for Dust Bunnies (Drawing Cards)**

You must draw cards one by one from the "dust pile" and place them face up publicly in front of you. Group identical numbers together so everyone can see how many you have of each type.

#### **3. Stealing Dust Bunnies**

When you draw a card, check if other players have that same number face up in front of them:

* You may, if you wish, steal **all** matching cards from other players.
* Add the stolen cards to your face-up area immediately.

**Decision:** After each card you draw (and potentially steal), you must decide:

* **Stop:** Your turn ends. Leave your face-up cards on the table. You hope they survive until your next turn so you can bank them in step 1.
* **Continue:** Draw another card.

> You can continue drawing cards as long as you like.

> If you are drawing the third card onwards, it does not make any sense to have the choice either to steal or not steal other users' cards, so you must steal them automatically.

### **Losing Your Turn (The Risk)**

If you draw a card from the dust pile that matches a number you **already have** in front of you, check how many total cards you currently have face up (including the cards you stole, if any):

1. **If you have 3 or more cards face up:**
* You lose your turn immediately.
* You must discard **all** your face-up cards and return them to the box (they are out of the game).
* Play passes to the next player.

2. **If you have 1 or 2 cards face up:**
* Nothing happens. You are safe.
* You simply keep the duplicate card and continue your turn.

### **End of the Game**

The game ends when the last card is taken from the dust pile.

* At that moment, all players currently holding face-up cards automatically move them to their safe score piles.

**Scoring:**

* Each player sums the numbers on the cards in their score pile.
* The player with the highest total score wins.

**Tie-Breaker:**
In case of a tie, the winner is the player with the most cards of value **1**. If the tie persists, check cards of value **2**, and so on.