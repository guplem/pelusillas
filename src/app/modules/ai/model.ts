import { Accumulator, HistoryElement } from '@/app/modules/game/model';

/**
 * Represents the full game state snapshot provided to an AI strategy function.
 * Contains all information the AI needs to decide its next move.
 */
export interface Scenario {
	/**
	 * The board of the game. Essentially an array of all players in the game linked to their accumulators (life storage cards).
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
	 * The cards currently in the AI player's hand (array of card values).
	 */
	readonly playerHand: number[];
	/**
	 * The full action history of the game so far (in chronological order).
	 */
	readonly history: HistoryElement[];
}

/**
 * Represents a single player's board state, including their accumulators (life storage cards).
 */
export interface Board {
	/**
	 * The unique player ID for this board.
	 */
	readonly playerId: string;
	/**
	 * The player's current accumulators (life storage cards on the board).
	 */
	readonly accumulators: Accumulator[];
}
