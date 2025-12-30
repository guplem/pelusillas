import { Game, GamePlayer } from '@/app/modules/game/model';

/**
 * Calculates the total score for a player's score pile.
 * @param scorePile - The array of card values in the player's score pile
 * @returns The total score
 */
export const calculateScore = (scorePile: number[]): number => {
	return scorePile.reduce((sum: number, value: number) => sum + value, 0);
};

/**
 * Counts cards of each value in a pile.
 * @param cards - The array of card values to count
 * @returns A Map from card value to count
 */
export const countCardsByValue = (cards: number[]): Map<number, number> => {
	const counts: Map<number, number> = new Map();
	for (const card of cards) {
		counts.set(card, (counts.get(card) ?? 0) + 1);
	}
	return counts;
};

/**
 * Gets unique values present in a set of cards.
 * @param cards - The array of card values
 * @returns Sorted array of unique values
 */
export const getUniqueValues = (cards: number[]): number[] => {
	return [...new Set(cards)].sort((a: number, b: number) => a - b);
};

/**
 * Checks if a player already has a card of the given value face up.
 * @param player - The game player to check
 * @param value - The card value to look for
 * @returns True if the player has a face-up card of that value
 */
export const hasCardOfValue = (player: GamePlayer, value: number): boolean => {
	return player.faceUpCards.includes(value);
};

/**
 * Gets all cards of a specific value from a player's face-up cards.
 * @param player - The game player
 * @param value - The card value to find
 * @returns Array of cards with that value
 */
export const getCardsOfValue = (player: GamePlayer, value: number): number[] => {
	return player.faceUpCards.filter((card: number) => card === value);
};

/**
 * Clones the current game state.
 * @param gameState - The current game state to clone.
 * @returns A deep clone of the game state.
 */
export const cloneGameState = (gameState: Game): Game => {
	return JSON.parse(JSON.stringify(gameState));
};

/**
 * Returns the current player whose turn it is, based on the game state.
 * @param game - The current game state
 * @returns The GamePlayer whose turn it is
 */
export const getCurrentPlayer = (game: Game): GamePlayer => {
	return game.players[game.turn % game.players.length];
};

/**
 * Compares two players' scores for tiebreaking.
 * First compares total score, then uses the tiebreaker rule:
 * Most cards of value 1, then 2, etc.
 * @param playerA - First player to compare
 * @param playerB - Second player to compare
 * @returns Negative if A wins, positive if B wins, 0 if still tied
 */
export const compareScores = (playerA: GamePlayer, playerB: GamePlayer): number => {
	const scoreA: number = calculateScore(playerA.scorePile);
	const scoreB: number = calculateScore(playerB.scorePile);

	if (scoreA !== scoreB) {
		return scoreB - scoreA; // Higher score wins (negative means A wins)
	}

	// Tiebreaker: compare card counts starting from value 1
	const countsA: Map<number, number> = countCardsByValue(playerA.scorePile);
	const countsB: Map<number, number> = countCardsByValue(playerB.scorePile);

	for (let value: number = 1; value <= 10; value++) {
		const countA: number = countsA.get(value) ?? 0;
		const countB: number = countsB.get(value) ?? 0;
		if (countA !== countB) {
			return countB - countA; // More cards of this value wins
		}
	}

	return 0; // Complete tie
};

/**
 * Draws a card from the deck.
 * @param deck - The deck to draw from
 * @returns The drawn card value, or undefined if deck is empty
 */
export const drawFromDeck = (deck: number[]): number | undefined => {
	return deck.pop();
};

/**
 * Checks if the deck is empty (game should end).
 * @param deck - The deck to check
 * @returns True if the deck is empty
 */
export const isDeckEmpty = (deck: number[]): boolean => {
	return deck.length === 0;
};
