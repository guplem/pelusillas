import { Board, Scenario } from '@/app/modules/ai/model';
import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

/**
 * Competitive AI strategy for Pelusillas.
 * Attempts to maximize score while minimizing bust risk, using all available scenario data.
 */
export const competitiveStrategy = (gameScenario: Scenario): ActionConfig => {
	// Find this AI's board
	const myBoard: Board | undefined = gameScenario.board.find(
		(b: Board): boolean => b.playerId === gameScenario.playerId,
	);
	if (!myBoard) {
		// Fallback: just draw if something is wrong
		return { action: ActionTypes.Draw, params: {} };
	}

	const myFaceUp: number[] = myBoard.faceUpCards;
	// Ensure we draw at least once when we have no face-up cards and there's no pending steal
	if (myFaceUp.length === 0 && !gameScenario.pendingStealDecision) {
		return { action: ActionTypes.Draw, params: {} };
	}
	// const myScore: number = myBoard.scorePile.reduce((a: number, b: number) => a + b, 0);
	const deckSize: number = gameScenario.deckSize;

	// Calculate risk: how many of each card value do I have face up?
	const valueCounts: Record<number, number> = {};
	for (const card of myFaceUp) valueCounts[card] = (valueCounts[card] || 0) + 1;

	// If I have 3+ cards, check for duplicates (bust risk)
	const hasThreeOrMore: boolean = myFaceUp.length >= 3;
	const hasDuplicate: boolean = Object.values(valueCounts).some((count: number) => count > 1);

	// If I have a duplicate, I should stop immediately
	if (hasThreeOrMore && hasDuplicate) {
		return { action: ActionTypes.Stop, params: {} };
	}

	// If deck is nearly empty, be more aggressive
	const deckLow: boolean = deckSize <= 5;

	// If I have 5+ face up, stop (greed cap)
	if (myFaceUp.length >= 5 && !deckLow) {
		return { action: ActionTypes.Stop, params: {} };
	}

	// If I have 3+ face up, and deck is not low, check for risk
	if (hasThreeOrMore && !deckLow) {
		// If any value is already present, risk is high
		if (Object.values(valueCounts).some((count: number) => count > 0)) {
			// If I have 3 or 4 face up, stop with 50% chance (simulate human caution)
			if (myFaceUp.length === 3 && Math.random() < 0.5) {
				return { action: ActionTypes.Stop, params: {} };
			}
			if (myFaceUp.length === 4 && Math.random() < 0.8) {
				return { action: ActionTypes.Stop, params: {} };
			}
		}
	}

	// If I can steal, always steal
	if (gameScenario.pendingStealDecision) {
		return { action: ActionTypes.Steal, params: {} };
	}

	// Otherwise, draw
	return { action: ActionTypes.Draw, params: {} };
};
