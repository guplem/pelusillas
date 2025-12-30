import { HistoryElement } from '@/app/modules/game/model';

/**
 * Represents a pending steal decision that the AI must respond to.
 */
export interface PendingStealDecision {
	/**
	 * The value of the drawn card that triggered the steal opportunity.
	 */
	readonly drawnCardValue: number;
	/**
	 * The IDs of players who can be stolen from.
	 */
	readonly stealableFrom: string[];
}

/**
 * Represents the full game state snapshot provided to an AI strategy function.
 * Contains all information the AI needs to decide its next move in Pelusillas.
 */
export interface Scenario {
	/**
	 * The board of the game - all players and their current state.
	 */
	readonly board: Board[];
	/**
	 * The current turn number (starts at 0).
	 */
	readonly turn: number;
	/**
	 * The player ID of the AI-controlled player (the one making the decision).
	 */
	readonly playerId: string;
	/**
	 * The number of cards remaining in the deck.
	 */
	readonly deckSize: number;
	/**
	 * The full action history of the game so far (in chronological order).
	 */
	readonly history: HistoryElement[];
	/**
	 * If present, the AI must decide whether to steal cards or skip.
	 * This takes priority over draw/stop decisions.
	 */
	readonly pendingStealDecision?: PendingStealDecision;
}

/**
 * Represents a single player's board state in Pelusillas.
 */
export interface Board {
	/**
	 * The unique player ID for this board.
	 */
	readonly playerId: string;
	/**
	 * The player's current face-up cards (at risk of being lost).
	 */
	readonly faceUpCards: number[];
	/**
	 * The player's banked score pile (safe points).
	 */
	readonly scorePile: number[];
}
