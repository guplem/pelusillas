import { Board, Scenario } from '@/app/modules/ai/model';
import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

/**
 * A random strategy for Pelusillas.
 * Randomly decides whether to draw or stop based on risk level.
 * When a steal decision is pending, always chooses to steal.
 */
export const randomDrawStrategy = (gameScenario: Scenario): ActionConfig => {
	// Handle pending steal decision - AI always steals when possible
	if (gameScenario.pendingStealDecision) {
		return {
			action: ActionTypes.Steal,
			params: {},
		};
	}

	const currentPlayerBoard: Board | undefined = gameScenario.board.find(
		(b: Board) => b.playerId === gameScenario.playerId,
	);

	const faceUpCount: number = currentPlayerBoard?.faceUpCards.length ?? 0;

	// Always draw at least 3 cards before considering stopping
	const MINIMUM_CARDS: number = 3;

	if (faceUpCount < MINIMUM_CARDS) {
		return {
			action: ActionTypes.Draw,
			params: {},
		};
	}

	// Random chance to stop increases with more cards face up
	// Start at 30% chance to stop at 3 cards, +15% per additional card
	const cardsOverMinimum: number = faceUpCount - MINIMUM_CARDS;
	const stopChance: number = Math.min(0.3 + cardsOverMinimum * 0.15, 0.8);

	if (Math.random() < stopChance) {
		return {
			action: ActionTypes.Stop,
			params: {},
		};
	}

	return {
		action: ActionTypes.Draw,
		params: {},
	};
};
