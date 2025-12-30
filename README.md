# 🎴 Boom - Web Card Game

A real-time multiplayer web implementation of the **Boom** card game, built with [RoboJS](https://robojs.dev/) and React.

**Boom** is a strategic card game where players eliminate opponents by destroying their life storage cards. The last player standing wins!

> **Contribute your AI!** Anyone is more than welcome to develop new AI strategies and make a PR to add them. See the [Developing AI Strategies](#-developing-ai-strategies) section below for details.

## 🚀 TL;DR - Quick Start for Non-Programmers

Want to just run the game? Here's the fastest way:

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/) (choose the LTS version).
2. **Download this project**: Click the green "Code" button above → "Download ZIP" → Extract it.
3. **Open a terminal/command prompt** in the extracted folder.
4. **Run these commands**:
  ```bash
  npm install
  npm run dev
  ```
5. **Open your browser** and go to `http://localhost:3000`.
6. **Share the tunnel URL** (shown in your terminal) with friends to play together!

That's it! 🎉

---

## 🎮 Game Overview

**Boom** is a tactical card game for 2 or more players where the last one standing wins.

- **Goal**: Be the last player with life storage cards ("accumulators") remaining.
- **Setup**: Each player starts with 3 cards in hand and 3 accumulator cards on the board.
- **Gameplay**: On your turn, you can swap cards, attack opponents, use a powerful "Boom" ability, or discard.
- **Cards**: Numbered cards store life and deal damage, while special cards (value 0) enable the "Boom" action.

**📖 Full Rules**:
- [Digital Game Help Page](/help) _(in-game rules for the web version)_
- [Physical Version: English Rules](./rules/Physical%20Version/EN.md)
- [Physical Version: Spanish Rules](./rules/Physical%20Version/ES.md)

## 🛠️ Prerequisites for Development

- [Node.js](https://nodejs.org/) v22 or newer
- [npm](https://www.npmjs.com/) (comes with Node.js)
- A modern web browser
- *(Optional)* [Google Cloud Platform account](https://console.cloud.google.com/) for deployment

## 🏗️ Development Setup

1. **Clone the repository**:
  ```bash
  git clone https://github.com/guplem/boom.git
  cd boom
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

## 🏛️ Technology Stack

This project uses a modern web stack to create a real-time, interactive experience.

- **Frontend**: React, TypeScript, Vite
- **Backend**: RoboJS Server, Node.js
- **Real-time State Sync**: `@robojs/sync` for multiplayer state.
- **Client-side State**: Zustand for persistent local state.
- **Backend Key-Value Store**: Flashcore for ephemeral server-side data.
- **Styling**: Plain CSS with modern features.
- **Code Quality**: ESLint, Prettier.

## 🧠 Application & Game Flow

The application is structured around a clear separation of concerns: room management, lobby setup, and the core game loop. State management is key to its real-time functionality.

### 1. Initial Load & Room Selection

1. **Entry Point (`index.tsx` -> `App.tsx`)**: The app initializes, setting up React Router and the `SyncContextProvider`.
2. **User Identification**: On first load, `UserStore` (a Zustand store) generates and persists a unique ID for the browser session in `localStorage`. This ID is used to determine ownership of players.
3. **Room Handling (`App.tsx`)**:
  - The app checks the URL for a `?room=` parameter. If present, it validates the room's existence via a `HEAD` request to `/api/room` and automatically joins it.
  - If no room is joined, the `RoomPage` is displayed, offering to create or join a room.
  - `RoomCreator` and `RoomPicker` components handle API calls to the backend (`src/api/room.ts`), which uses `Flashcore` to manage the list of available rooms.
  - Once a room is joined, `RoomStore` (another Zustand store) saves the room name, and the app transitions to the `GamePage`.

### 2. The Lobby (`PlayerPage.tsx`)

1. **Synchronized State**: In the lobby, the `players` array is the first piece of state synchronized by `@robojs/sync`'s `useSyncState` hook. Any player added or removed by one client is instantly reflected on all other clients in the same room.
2. **Player Creation**: The `PlayerCreationForm` allows users to add players.
  - A user can create multiple AI players but only **one** human player (enforced by `validatePlayerAddition` in `player/manager.ts`).
  - Each player is assigned an owner ID matching the user's session ID.
3. **Starting the Game**: The "Start Game" button calls `gameContext.startGame`. This function initializes the main `game` object, which is also a synchronized state via `useSyncState`. The app then transitions from the lobby view to the game board.

### 3. The Core Game Loop (Event-Driven)

The game does not run on a traditional timer-based loop. Instead, it's **entirely event-driven**, reacting to changes in the shared `game` state. The `GamePage.tsx` component orchestrates this flow.

#### Human Player's Turn

1. **UI Enablement**: The `GameBoardPage.tsx` component renders the main interface. It checks if the current player's ID matches the human player's ID and enables/disables controls accordingly.
2. **Action Selection**:
  - The user clicks a card in their hand (`GameHandCard.tsx`), which is stored in a local `useState` hook (`handSelected`).
  - The user then clicks a valid target (an opponent's accumulator for an attack, or their own for a swap).
3. **Executing the Action**: This UI interaction calls `gameContext.executeAction`, passing an `ActionConfig` object that defines the move (e.g., `{ action: 'attack', params: { ... } }`).

#### AI Player's Turn

1. **The Trigger**: The `useEffect` hook in `GamePage.tsx` listens for any changes to the synchronized `game` object.
2. **Turn Check**: After each state update, this `useEffect` checks if the game is running and if the current player (`getCurrentPlayer(game)`) is an AI owned by the current user.
3. **Strategy Execution**: If it's the AI's turn, `executeAiStrategy` (`ai/manager.ts`) is called.
  - It builds a `Scenario` object (a complete, read-only snapshot of the game).
  - It passes this `Scenario` to the AI's selected strategy function (e.g., `randomAttackStrategy`).
  - The strategy function analyzes the `Scenario` and returns its desired `ActionConfig`.
  - `executeAiStrategy` then calls the same `gameContext.executeAction` function that a human player uses.

### 4. Action Resolution & Turn Advancement

This is the heart of the game's rules engine, located in `src/app/modules/game/manager.ts`.

1. **Central Hub (`executeAction`)**: All actions, whether from a human or AI, are processed here.
2. **Validation (`getNextGameState`)**:
  - This pure function is the core of the game logic. It takes the current game state and an action.
  - It performs all necessary validation (Is it the player's turn? Is the move legal? e.g., "Can't attack with a card value higher than the accumulator's HP?").
  - If the action is valid, it returns a **new, updated game state**. If invalid, it returns `null`.
3. **State Update**:
  - If `getNextGameState` returns a new state, `executeAction` commits it using `setGame()`.
  - `@robojs/sync` detects this change and instantly broadcasts the new `game` state to all connected clients.
4. **Turn Advancement (`advanceToNextTurn`)**:
  - After a valid action, this function is called.
  - It checks for win/draw conditions by seeing how many players have > 0 HP. If the game ends, it sets the `winnerId`.
  - Otherwise, it increments the `turn` counter, skipping any eliminated players until it finds the next living player.
5. **The Loop Continues**: This change to the `turn` number (or `winnerId`) is part of the new game state. The `useEffect` in `GamePage.tsx` detects this change, and the cycle begins again.

This event-driven architecture ensures that the game state is always the single source of truth, and the UI and AI players simply *react* to its changes.

## 🚀 Deployment (Optional)

This project is pre-configured for deployment to **Google Cloud Run**.

1. **Update service name** in `cloudbuild.yaml`:
    ```yaml
    substitutions:
      _SERVICE_NAME: boom-card-game # Or your preferred service name
    ```
2. Follow the official [RoboJS Cloud Run deployment guide](https://robojs.dev/hosting/cloud-run).
3. Pushes to the `main` branch will trigger automatic deployments.

## 🤝 Contributing

Contributions are welcome! This is an evolving project with many opportunities for improvement.

### 🤖 Developing AI Strategies

The game includes a simple, extensible AI system. You can easily create and add your own strategies.

1. **Create a Strategy File**: Add a new file in `src/app/modules/ai/strategies/`.
2. **Define the Strategy Function**: Export a function that accepts a `Scenario` object and returns an `ActionConfig`. The `Scenario` gives you a complete snapshot of the game state.

    ```typescript
    // src/app/modules/ai/strategies/myCleverStrategy.ts
    import { Scenario } from '@/app/modules/ai/model';
    import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

    export const myCleverStrategy = (gameScenario: Scenario): ActionConfig => {
      // TODO: Implement your brilliant AI logic here!
      // Analyze the board, hand, and history to make a decision.

      // Return the chosen action
      return {
        action: ActionTypes.Attack,
        params: { /* ... */ }
      };
    };
    ```

3. **Register Your Strategy**: Import and add your strategy to the `strategiesList` in `src/app/modules/ai/strategies.ts`.

    ```typescript
    // src/app/modules/ai/strategies.ts
    import { myCleverStrategy } from './strategies/myCleverStrategy';

    export const strategiesList = [
      // ... existing strategies
      {
        name: 'My Clever Strategy',
        description: 'A brief description of what your AI does.',
        getActionFunction: myCleverStrategy,
        maxAttempts: 20 // Optional: Retries if the AI returns an invalid move.
      },
    ];
    ```
4. **Test It**: Run `npm run dev` and select your new strategy from the dropdown in the game lobby.

**Note on Robustness**: The game manager will try to execute the action returned by your AI. If it's invalid, it will retry. The system also has a fallback mechanism (`executeFallbackAction` in `ai/manager.ts`) that will perform a safe "discard" action if the AI fails to produce a valid move after all attempts, ensuring the game never gets stuck.