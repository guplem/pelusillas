import { Board, Scenario } from '@/app/modules/ai/model';
import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

/**
 * A random strategy for Pelusillas.
 * Randomly decides whether to draw or stop based on risk level.
 */
export const randomDrawStrategy = (gameScenario: Scenario): ActionConfig => {
	const currentPlayerBoard: Board | undefined = gameScenario.board.find(
		(b: Board) => b.playerId === gameScenario.playerId,
	);

	const faceUpCount: number = currentPlayerBoard?.faceUpCards.length ?? 0;

	// If no cards face up, must draw
	if (faceUpCount === 0) {
		return {
			action: ActionTypes.Draw,
			params: {
				stealMatching: true, // Always steal when possible
			},
		};
	}

	// Random chance to stop increases with more cards face up
	// Base 20% chance to stop, +15% per card face up
	const stopChance: number = Math.min(0.2 + faceUpCount * 0.15, 0.8);

	if (Math.random() < stopChance) {
		return {
			action: ActionTypes.Stop,
			params: {},
		};
	}

	return {
		action: ActionTypes.Draw,
		params: {
			stealMatching: true,
		},
	};
};
