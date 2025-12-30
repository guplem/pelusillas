import { PendingStealDecision, Scenario } from '@/app/modules/ai/model';
import { strategiesList } from '@/app/modules/ai/strategies';
import { executeAction } from '@/app/modules/game/manager';
import { ActionConfig, ActionTypes, Game, GamePlayer } from '@/app/modules/game/model';
import { getCurrentPlayer } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import { Dispatch, SetStateAction } from 'react';

const delay = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Main AI execution loop for a player's turn in Pelusillas.
 *
 * Selects and runs the configured AI strategy for the current player, attempting up to `maxAttempts` times
 * to produce a valid action. If all attempts fail, falls back to a safe action.
 */
export const executeAiStrategy = async (
	userId: string,
	game: Game,
	players: Player[],
	setGame: Dispatch<SetStateAction<Game | null>>,
): Promise<void> => {
	const currentPlayerId: string = getCurrentPlayer(game).id;
	const currentPlayer: Player | undefined = players.find((p) => p.id === currentPlayerId);

	// Exit if the current player is not an AI or does not belong to the user
	if (
		!currentPlayer ||
		!currentPlayer.aiStrategy ||
		currentPlayer.owner !== userId ||
		game.winnerId !== undefined
	) {
		return;
	}

	console.log(
		`Executing AI strategy for player ${currentPlayer.name} with strategy "${currentPlayer.aiStrategy}".`,
	);

	// Convert game pending steal decision to AI scenario format
	const pendingStealDecision: PendingStealDecision | undefined = game.pendingStealDecision
		? {
				drawnCardValue: game.pendingStealDecision.drawnCardValue,
				stealableFrom: game.pendingStealDecision.stealableFrom,
			}
		: undefined;

	const scenario: Scenario = {
		board: game.players.map((player) => ({
			playerId: player.id,
			faceUpCards: player.faceUpCards,
			scorePile: player.scorePile,
		})),
		deckSize: game.deck.length,
		turn: game.turn,
		playerId: currentPlayerId,
		history: game.history,
		pendingStealDecision,
	};

	await delay(game.aiDelay || 500);

	// eslint-disable-next-line @typescript-eslint/typedef
	const strategy = strategiesList.find((s) => s.name === currentPlayer.aiStrategy);
	if (!strategy) {
		console.error(`AI strategy "${currentPlayer.aiStrategy}" not found.`);
		return executeFallbackAction(game, setGame, currentPlayer);
	}

	const maxAttempts: number = strategy.maxAttempts || 10;
	for (let attempt: number = 0; attempt < maxAttempts; attempt++) {
		const action: ActionConfig = strategy.getActionFunction(scenario);
		const success: boolean = executeAction(game, setGame, currentPlayer.id, action);
		if (success) {
			return;
		}
		// If the action was not valid, wait a bit and try again
		await delay(100);
		console.log(`Attempt ${attempt + 1} failed for player ${currentPlayer.id}. Retrying...`);
	}

	console.warn(`AI strategy could not produce a valid action after ${maxAttempts} attempts.`);
	return executeFallbackAction(game, setGame, currentPlayer);
};

/**
 * Executes a fallback action for the AI player if their strategy fails.
 * In Pelusillas, the fallback handles steal decisions and draw/stop actions.
 */
const executeFallbackAction = (
	game: Game,
	setGame: Dispatch<SetStateAction<Game | null>>,
	currentPlayer: Player,
): void => {
	console.log(`Executing fallback action for player ${currentPlayer.id}.`);

	// If there's a pending steal decision, always steal as fallback
	if (game.pendingStealDecision) {
		const fallbackAction: ActionConfig = {
			action: ActionTypes.Steal,
			params: {},
		};
		const success: boolean = executeAction(game, setGame, currentPlayer.id, fallbackAction);
		if (!success) {
			console.error(`Fallback steal action failed for player ${currentPlayer.id}.`);
		}
		return;
	}

	const currentGamePlayer: GamePlayer | undefined = game.players.find(
		(p) => p.id === currentPlayer.id,
	);
	const faceUpCount: number = currentGamePlayer?.faceUpCards.length ?? 0;

	// If player has many cards, stop to be safe
	const fallbackAction: ActionConfig =
		faceUpCount >= 5
			? {
					action: ActionTypes.Stop,
					params: {},
				}
			: {
					action: ActionTypes.Draw,
					params: {},
				};

	const success: boolean = executeAction(game, setGame, currentPlayer.id, fallbackAction);
	if (!success) {
		console.error(`Fallback action also failed for player ${currentPlayer.id}.`);
	}
};
