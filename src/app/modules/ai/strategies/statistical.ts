import { Board, Scenario } from '@/app/modules/ai/model';
import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

/**
 * Statistical AI strategy.
 * Uses visible board state and history to estimate remaining card counts and bust risk,
 * then makes decisions based on risk vs reward heuristics.
 */
export const statisticalStrategy = (gameScenario: Scenario): ActionConfig => {
	// If there's a pending steal decision, prefer stealing (it's safe and gains cards)
	if (gameScenario.pendingStealDecision) {
		return { action: ActionTypes.Steal, params: {} };
	}

	// Find this AI's board
	const myBoard: Board | undefined = gameScenario.board.find(
		(b: Board): boolean => b.playerId === gameScenario.playerId,
	);
	if (!myBoard) {
		return { action: ActionTypes.Draw, params: {} };
	}

	const myFaceUp: number[] = myBoard.faceUpCards;
	const sumFaceUp: number = myFaceUp.reduce((s: number, v: number) => s + v, 0);
	const myFaceUpCounts: Record<number, number> = {};
	for (const c of myFaceUp) myFaceUpCounts[c] = (myFaceUpCounts[c] || 0) + 1;

	// Initial full deck counts
	const initialCounts: Record<number, number> = {};
	for (let v: number = 1; v <= 10; v++) {
		initialCounts[v] = v <= 5 ? 13 : 9;
	}

	// Subtract visible cards from boards (faceUp + scorePile) to estimate remaining counts
	const visibleCounts: Record<number, number> = {};
	for (const b of gameScenario.board) {
		for (const c of b.faceUpCards) visibleCounts[c] = (visibleCounts[c] || 0) + 1;
		for (const c of b.scorePile) visibleCounts[c] = (visibleCounts[c] || 0) + 1;
	}

	const remainingCounts: Record<number, number> = {};
	let totalRemaining: number = 0;
	for (let v: number = 1; v <= 10; v++) {
		const remaining: number = Math.max(0, initialCounts[v] - (visibleCounts[v] || 0));
		remainingCounts[v] = remaining;
		totalRemaining += remaining;
	}

	// If no info about remaining, fall back to simple strategy
	if (totalRemaining === 0) {
		// If near end (no remaining), be aggressive unless bust risk is immediate
		if (myFaceUp.length >= 5) return { action: ActionTypes.Stop, params: {} };
		return { action: ActionTypes.Draw, params: {} };
	}

	// Probability next draw causes bust (given current face-up cards)
	let bustProbability: number = 0;
	for (let v: number = 1; v <= 10; v++) {
		const existing: number = myFaceUpCounts[v] || 0;
		// Bust occurs only if drawing a duplicate when player will have 4+ cards (i.e., currently >=3)
		if (myFaceUp.length >= 3 && existing >= 1) {
			bustProbability += remainingCounts[v] / totalRemaining;
		}
	}

	// Expected value of a single draw (naive): average card value remaining
	let averageRemainingValue: number = 0;
	for (let v: number = 1; v <= 10; v++) {
		averageRemainingValue += v * (remainingCounts[v] / totalRemaining);
	}

	// Heuristics combining risk and reward
	const deckSize: number = gameScenario.deckSize;
	const deckLow: boolean = deckSize <= 5;

	// If immediate bust risk is high and we already have a decent pile, stop
	if (bustProbability >= 0.25 && sumFaceUp >= Math.max(8, Math.ceil(averageRemainingValue * 2))) {
		return { action: ActionTypes.Stop, params: {} };
	}

	// If we already have many cards (greedy cap), stop unless deck is very low (go for it)
	if (myFaceUp.length >= 5 && !deckLow) {
		return { action: ActionTypes.Stop, params: {} };
	}

	// If deck is low, be more aggressive (draw), unless bustProb is very high
	if (deckLow) {
		if (bustProbability >= 0.5) return { action: ActionTypes.Stop, params: {} };
		return { action: ActionTypes.Draw, params: {} };
	}

	// If bust probability is low, draw
	if (bustProbability < 0.2) {
		return { action: ActionTypes.Draw, params: {} };
	}

	// Otherwise, be cautious and stop
	return { action: ActionTypes.Stop, params: {} };
};
