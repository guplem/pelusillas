import { Accumulator, Game, GamePlayer } from '@/app/modules/game/model';

/**
 * Generates a random card number (0-9) based on weighted probabilities.
 * Uses a weighted random selection algorithm where each card can have different chances of being selected.
 *
 * @param chances - Record where keys are card numbers (0-9) and values are their weights.
 *                  Higher weights increase the probability of selection.
 *                  Cards not specified in the record default to weight 1.
 *                  Setting weight to 0 excludes a card from selection.
 * @returns A random card number between 0 and 9 (inclusive)
 *
 * @example
 * // Equal probability for all cards (default behavior)
 * getRandomCard()
 *
 * // Card 5 is twice as likely, card 0 is excluded
 * getRandomCard({ 0: 0, 5: 2 })
 */
export const getRandomCard = (chances: Record<number, number> = {}): number => {
	const cardsPool: number[] = [];

	// Build weighted pool by adding each card multiple times based on its weight
	for (let cardNumber: number = 0; cardNumber < 10; cardNumber++) {
		const cardWeight: number = chances[cardNumber] ?? 1; // Default weight is 1 if not specified

		// Add the card to the pool 'cardWeight' number of times
		for (let weightIndex: number = 0; weightIndex < cardWeight; weightIndex++) {
			cardsPool.push(cardNumber);
		}
	}

	// Select random card from the weighted pool
	return cardsPool[Math.floor(Math.random() * cardsPool.length)];
};

/**
 * Calculates the total remaining HP (life points) for a set of accumulators (life storage cards).
 * Used to determine if a player is still alive.
 *
 * @param accumulators - The list of accumulators to sum HP for.
 * @returns The total remaining HP (never negative).
 */
export const remainingHp = (accumulators: Accumulator[]): number => {
	let totalHp: number = 0;
	for (const accumulator of accumulators) {
		let remaining: number = accumulator.originalValue;
		for (const attack of accumulator.attacks) {
			remaining -= attack;
		}
		totalHp += Math.max(remaining, 0); // Ensure we don't count negative HP
	}
	return totalHp;
};

/**
 * Filters the remaining accumulators that are defending (i.e., have a positive original value).
 * This is useful for identifying which accumulators can still defend against attacks.
 *
 * @param accumulators - The list of accumulators to filter.
 * @returns A list of defending accumulators.
 */
export const remainingAccumulatorsDefending = (accumulators: Accumulator[]): Accumulator[] => {
	const defendingAccumulators: Accumulator[] = [];
	for (const accumulator of accumulators) {
		if (accumulator.originalValue > 0) {
			defendingAccumulators.push(accumulator);
		}
	}
	return defendingAccumulators;
};

/**
 * Given the index of a remaining accumulator (an accumulator that has not been fully depleted), returns the overall index of that accumulator in the original accumulators array (including those that have been fully depleted).
 *
 * @param allAccumulators - The complete list of accumulators, including those that have been fully depleted.
 * @param remainingAccumulatorIndex - The index of the accumulator in the filtered list of remaining accumulators.
 * @returns The index of the specified remaining accumulator in the original list of accumulators.
 */
// export const getIndexOfAccumulator = (
// 	allAccumulators: Accumulator[],
// 	remainingAccumulatorIndex: number,
// ): number => {
// 	const remainingAccumulatorsList: Accumulator[] = remainingAccumulators(allAccumulators);
// 	return allAccumulators.indexOf(remainingAccumulatorsList[remainingAccumulatorIndex]);
// };

/**
 * Clones the current game state.
 *
 * @param gameState - The current game state to clone.
 * @returns A deep clone of the game state.
 */
export const cloneGameState = (gameState: Game): Game => {
	return JSON.parse(JSON.stringify(gameState));
};

/**
 * Returns the current player whose turn it is, based on the game state.
 *
 * @param game - The current game state.
 * @returns The GamePlayer object for the current player.
 */
export const getCurrentPlayer = (game: Game): GamePlayer => {
	return game.players[game.turn % game.players.length];
};
