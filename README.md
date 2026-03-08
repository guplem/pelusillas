#  Pelusillas - Web Card Game

A real-time multiplayer web implementation of **Pelusillas**, a push-your-luck card game inspired by *Zirkus Flohcati*, built with [RoboJS](https://robojs.dev/) and React.

**Pelusillas** is a strategic push-your-luck game where players collect dust bunny cards to score points. Draw carefullyget too greedy and you might bust!

> **Contribute your AI!** Anyone is more than welcome to develop new AI strategies and make a PR to add them. See the [Developing AI Strategies](#-developing-ai-strategies) section below for details.

##  TL;DR - Quick Start for Non-Programmers

Want to just run the game? Here''s the fastest way:

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/) (choose the LTS version).
2. **Download this project**: Click the green "Code" button above  "Download ZIP"  Extract it.
3. **Open a terminal/command prompt** in the extracted folder.
4. **Run these commands**:
   ```bash
   npm install
   npm run dev
   ```
5. **Open your browser** and go to `http://localhost:3000`.
6. **Share the tunnel URL** (shown in your terminal) with friends to play together!

That''s it! 

---

##  Game Overview

**Pelusillas** is a push-your-luck card game for 2-6 players where the highest scorer wins.

- **Goal**: Collect the most points by banking cards to your score pile.
- **Setup**: 110 cards (values 1-10: 13 each of 1-5, 9 each of 6-10).
- **Gameplay**: On your turn, draw cards face-up. You must draw at least 3 cards before you can stop.
- **Bust**: Draw a duplicate when you have 3 or more cards and lose everything!
- **Stealing**: When you draw a card, you can choose to steal matching cards from opponents (doesn't cause bust).

**Full Rules**:
- [Digital Game Help Page](/help) _(in-game rules for the web version)_

##  Prerequisites for Development

- [Node.js](https://nodejs.org/) v22 or newer
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A modern web browser
- *(Optional)* [Google Cloud Platform account](https://console.cloud.google.com/) for deployment

##  Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/pelusillas.git
   cd pelusillas
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   This will start the server at `http://localhost:3000/` and provide a public tunnel URL for multiplayer testing.

##  Technology Stack

This project uses a modern web stack to create a real-time, interactive experience.

- **Frontend**: React, TypeScript, Vite
- **Backend**: RoboJS Server, Node.js
- **Real-time State Sync**: `@robojs/sync` for multiplayer state.
- **Client-side State**: Zustand for persistent local state.
- **Backend Key-Value Store**: Flashcore for ephemeral server-side data.
- **Styling**: Plain CSS with modern features.
- **Code Quality**: ESLint, Prettier.

##  Application & Game Flow

The application is structured around a clear separation of concerns: room management, lobby setup, and the core game loop.

### 1. Initial Load & Room Selection

1. **Entry Point (`index.tsx` -> `App.tsx`)**: The app initializes, setting up React Router and the `SyncContextProvider`.
2. **User Identification**: `UserStore` generates and persists a unique ID for the browser session.
3. **Room Handling**: Create or join a room, then transition to the game lobby.

### 2. The Lobby (`PlayerPage.tsx`)

1. **Synchronized State**: Players are synchronized via `@robojs/sync`.
2. **Player Creation**: Add human or AI players.
3. **Starting the Game**: Initialize the game with deck and player setup.

### 3. The Core Game Loop

The game is **event-driven**, reacting to changes in the shared `game` state.

#### Human Player''s Turn

1. **Banking Phase**: Cards from the previous turn are automatically banked.
2. **Action Phase**: Draw from deck, optionally steal matching cards from opponents, or stop (after 3 or more cards).
3. **Bust Check**: Drawing a duplicate when you have 3 or more cards causes a bust.

#### AI Player''s Turn

1. The game detects when it''s an AI''s turn.
2. The AI strategy analyzes the scenario and decides to draw or stop.
3. The action is executed through the same game manager.

### 4. Game End

The game ends when the deck is empty. Remaining face-up cards are banked, and the player with the highest score wins. Tiebreaker: most unique card values.

##  Deployment (Optional)

This project is pre-configured for deployment to **Google Cloud Run**.

1. **Update service name** in `cloudbuild.yaml`.
2. Follow the official [RoboJS Cloud Run deployment guide](https://robojs.dev/hosting/cloud-run).
3. Pushes to the `main` branch will trigger automatic deployments.

##  Contributing

Contributions are welcome! This is an evolving project with many opportunities for improvement.

###  Developing AI Strategies

The game includes a simple, extensible AI system.

1. **Create a Strategy File**: Add a new file in `src/app/modules/ai/strategies/`.
2. **Define the Strategy Function**: Export a function that accepts a `Scenario` and returns an `ActionConfig`.

    ```typescript
    // src/app/modules/ai/strategies/myCleverStrategy.ts
    import { Scenario } from ''@/app/modules/ai/model'';
    import { ActionConfig, ActionTypes } from ''@/app/modules/game/model'';

    export const myCleverStrategy = (gameScenario: Scenario): ActionConfig => {
      // Analyze faceUpCards, scorePile, and deck size
      // Decide whether to draw or stop
      
      return {
        action: ActionTypes.Draw,
        params: { fromDeck: true }
      };
    };
    ```

3. **Register Your Strategy**: Add to `strategiesList` in `src/app/modules/ai/strategies.ts`.
4. **Test It**: Run `npm run dev` and select your strategy in the game lobby.
