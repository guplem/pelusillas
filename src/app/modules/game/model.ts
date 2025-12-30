export interface Game {
	readonly players: GamePlayer[];
	readonly handCardsCount: number;
	readonly aiDelay: number; // Delay in milliseconds for AI players to make their move
	turn: number;
	/**
	 * The winner of the game, if determined.
	 *
	 * - `undefined`: The game is still in progress.
	 * - `string`: The ID of the winning player.
	 * - `null`: The game ended in a draw (e.g., all players were eliminated simultaneously).
	 */
	winnerId?: string | null | undefined;
	history: HistoryElement[];
}

export interface GamePlayer {
	readonly id: string;
	hand: number[];
	accumulators: Accumulator[];
}

export interface Accumulator {
	readonly originalValue: number;
	attacks: number[];
}

export interface GameConfig {
	initialAccumulatorsCount?: number;
	handCardsCount?: number;
	aiDelay?: number;
}

/// === ACTIONS === ///

/**
 * The required return type for an AI strategy function.
 * Specifies the action to perform and its parameters.
 *
 * @property action - The type of action to perform (see ActionTypes).
 * @property params - The parameters for the action, matching the required interface for the action type.
 */
export interface ActionConfig {
	action: ActionTypes;
	params: AttackActionParams | SwapActionParams | DiscardActionParams | BoomActionParams;
}

/* eslint-disable no-unused-vars */
/**
 * Enum of all possible action types a player (or AI) can perform.
 *
 * @property Attack - Attack another player's accumulator (life storage card).
 * @property Swap - Swap a card from hand with one on the board.
 * @property Discard - Discard a card from hand (safe fallback action).
 * @property Boom - Use a special "Boom" ability (destroys accumulators of a specific value).
 */
export enum ActionTypes {
	Attack = 'attack',
	Swap = 'swap',
	Discard = 'discard',
	Boom = 'boom',
}
/* eslint-enable no-unused-vars */

/**
 * Parameters for an Attack action.
 *
 * @property targetPlayerId - The ID of the player being attacked.
 * @property sourceHandIndex - The index of the card in hand to use for the attack.
 * @property targetAccumulatorIndex - The index of the accumulator to attack on the target's board.
 */
export interface AttackActionParams {
	targetPlayerId: string;
	sourceHandIndex: number;
	targetAccumulatorIndex: number;
}

/**
 * Parameters for a Swap action.
 *
 * @property sourceHandIndex - The index of the card in hand to swap.
 * @property targetAccumulatorIndex - The index of the accumulator on the board to swap with.
 */
export interface SwapActionParams {
	sourceHandIndex: number;
	targetAccumulatorIndex: number;
}

/**
 * Parameters for a Discard action.
 *
 * @property sourceHandIndex - The index of the card in hand to discard.
 */
export interface DiscardActionParams {
	sourceHandIndex: number;
}

/**
 * Parameters for a Boom action (special ability).
 *
 * @property targetValue - The value of accumulators to destroy on all boards.
 */
export interface BoomActionParams {
	targetValue: number;
}

/**
 * Represents a single action taken in the game, for use in the game history.
 *
 * @property turn - The turn number when the action was taken.
 * @property action - The type of action performed.
 * @property sourcePlayerId - The player who performed the action.
 * @property data - The details of the action (see specific action history interfaces).
 */
export interface HistoryElement {
	turn: number;
	action: ActionTypes;
	sourcePlayerId: string;
	data: AttackActionHistory | SwapActionHistory | DiscardActionHistory | BoomActionHistory;
}

/**
 * Details for an Attack action in the game history.
 *
 * @property targetPlayerId - The player who was attacked.
 * @property sourceHandValue - The value of the card used for the attack.
 * @property targetAccumulatorValue - The value of the accumulator that was attacked.
 * @property obtainedExtraAccumulator - If the attack resulted in an extra accumulator, its value; otherwise null.
 */
export interface AttackActionHistory {
	targetPlayerId: string;
	sourceHandValue: number;
	targetAccumulatorValue: number;
	obtainedExtraAccumulator: number | null;
}

/**
 * Details for a Swap action in the game history.
 *
 * @property sourceHandValue - The value of the card swapped from hand.
 * @property targetAccumulatorValue - The value of the accumulator swapped on the board.
 */
export interface SwapActionHistory {
	sourceHandValue: number;
	targetAccumulatorValue: number;
}

/**
 * Details for a Discard action in the game history (empty, as discards have no extra data).
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface DiscardActionHistory {}

/**
 * Details for a Boom action in the game history.
 *
 * @property targetValue - The value of accumulators targeted by the Boom.
 * @property accumulatorsDestroyedQuantity - The number of accumulators destroyed by the Boom.
 */
export interface BoomActionHistory {
	targetValue: number;
	accumulatorsDestroyedQuantity: number;
}
