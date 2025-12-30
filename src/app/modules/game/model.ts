/**
 * Main Game state for Pelusillas.
 * Contains all information about the current game session.
 */
export interface Game {
	readonly players: GamePlayer[];
	readonly aiDelay: number; // Delay in milliseconds for AI players to make their move
	/**
	 * The deck of cards remaining to be drawn (dust pile).
	 * Each number represents a card value (1-10).
	 */
	deck: number[];
	/**
	 * The discard pile where busted cards go (out of the game).
	 */
	discardPile: number[];
	turn: number;
	/**
	 * Tracks whether the current player has banked their cards at the start of this turn.
	 */
	hasBankedThisTurn: boolean;
	/**
	 * Tracks if the current player has a pending steal decision after drawing.
	 * Contains the value of the card drawn if other players have matching cards.
	 */
	pendingStealDecision?: {
		drawnCardValue: number;
		stealableFrom: string[]; // Player IDs that have matching cards
	};
	/**
	 * The winner of the game, if determined.
	 *
	 * - `undefined`: The game is still in progress.
	 * - `string`: The ID of the winning player.
	 * - `null`: The game ended in a draw.
	 */
	winnerId?: string | null | undefined;
	history: HistoryElement[];
}

/**
 * Represents a player's state during a Pelusillas game.
 */
export interface GamePlayer {
	readonly id: string;
	/**
	 * Cards currently face up in front of the player (at risk of being lost).
	 */
	faceUpCards: number[];
	/**
	 * Cards that have been banked as safe points.
	 * These are scored at the end of the game.
	 */
	scorePile: number[];
}

/**
 * Configuration options for creating a new game.
 */
export interface GameConfig {
	aiDelay?: number;
}

/// === ACTIONS === ///

/**
 * The required return type for an AI strategy function.
 * Specifies the action to perform and its parameters.
 */
export interface ActionConfig {
	action: ActionTypes;
	params: DrawActionParams | StopActionParams | StealActionParams | SkipStealActionParams;
}

/* eslint-disable no-unused-vars */
/**
 * Enum of all possible action types a player (or AI) can perform in Pelusillas.
 *
 * @property Draw - Draw a card from the dust pile.
 * @property Stop - End your turn and keep your face-up cards for banking next turn.
 * @property Steal - Steal matching cards from other players (after drawing).
 * @property SkipSteal - Decline to steal matching cards (after drawing).
 */
export enum ActionTypes {
	Draw = 'draw',
	Stop = 'stop',
	Steal = 'steal',
	SkipSteal = 'skipSteal',
}
/* eslint-enable no-unused-vars */

/**
 * Parameters for a Draw action.
 * Drawing no longer has steal options - stealing is a separate decision.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DrawActionParams {
	// No parameters needed for draw action - stealing is a separate step
}

/**
 * Parameters for a Stop action.
 * The player ends their turn, keeping face-up cards to bank next turn.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StopActionParams {
	// No parameters needed for stop action
}

/**
 * Parameters for a Steal action.
 * Used when player decides to steal matching cards after drawing.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface StealActionParams {
	// No parameters needed - steals all matching cards from all players
}

/**
 * Parameters for a SkipSteal action.
 * Used when player declines to steal matching cards after drawing.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface SkipStealActionParams {
	// No parameters needed
}

/**
 * Represents a single action taken in the game, for use in the game history.
 */
export interface HistoryElement {
	turn: number;
	action: ActionTypes | 'bank' | 'bust';
	sourcePlayerId: string;
	data:
		| DrawActionHistory
		| StopActionHistory
		| BankActionHistory
		| BustActionHistory
		| StealActionHistory;
}

/**
 * Details for a Draw action in the game history.
 * Now only tracks the drawn card, not stealing (which is a separate action).
 */
export interface DrawActionHistory {
	drawnCardValue: number;
	/** @deprecated - Stealing is now tracked separately. Kept for backward compatibility. */
	stolenFromPlayers: string[];
	/** @deprecated - Stealing is now tracked separately. Kept for backward compatibility. */
	stolenCardsCount: number;
}

/**
 * Details for a Steal action in the game history.
 */
export interface StealActionHistory {
	stolenCardValue: number;
	stolenFromPlayers: string[];
	stolenCardsCount: number;
}

/**
 * Details for a Stop action in the game history.
 */
export interface StopActionHistory {
	cardsKept: number;
}

/**
 * Details for banking cards at the start of a turn.
 */
export interface BankActionHistory {
	cardsBanked: number;
	totalValueBanked: number;
}

/**
 * Details for a bust event (drawing a duplicate when you have 3+ cards).
 */
export interface BustActionHistory {
	duplicateValue: number;
	cardsLost: number;
	totalValueLost: number;
}

/**
 * Calculates the total score for a player's score pile.
 */
export function calculateScore(scorePile: number[]): number {
	return scorePile.reduce((sum: number, value: number) => sum + value, 0);
}

/**
 * Counts cards of each value in a pile.
 * Returns a map from value to count.
 */
export function countCardsByValue(cards: number[]): Map<number, number> {
	const counts: Map<number, number> = new Map();
	for (const card of cards) {
		counts.set(card, (counts.get(card) ?? 0) + 1);
	}
	return counts;
}

/**
 * Gets unique values present in a set of cards.
 */
export function getUniqueValues(cards: number[]): number[] {
	return [...new Set(cards)].sort((a: number, b: number) => a - b);
}
