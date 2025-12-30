import { Scenario } from '@/app/modules/ai/model';
import { strategiesList } from '@/app/modules/ai/strategies';
import { executeAction } from '@/app/modules/game/manager';
import { ActionConfig, ActionTypes, Game } from '@/app/modules/game/model';
import { getCurrentPlayer } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import { Dispatch, SetStateAction } from 'react';

const delay = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

/**
 * Main AI execution loop for a player's turn.
 *
 * Selects and runs the configured AI strategy for the current player, attempting up to `maxAttempts` times
 * to produce a valid action. If all attempts fail, falls back to a safe discard action.
 *
 * @param userId - The ID of the browser session user. Used to ensure that only the user who "owns" the AI player can trigger its move, preventing multiple clients from controlling the same AI.
 * @param game - The current game state.
 * @param players - Array of all players in the game.
 * @param setGame - React state setter for updating the game state.
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

	const scenario: Scenario = {
		board: game.players.map((player) => ({
			playerId: player.id,
			accumulators: player.accumulators,
		})),
		playerHand: game.players.find((p) => p.id === currentPlayerId)?.hand || [],
		turn: game.turn,
		playerId: currentPlayerId,
		history: game.history,
	};

	await delay(game.aiDelay || 500);

	// eslint-disable-next-line @typescript-eslint/typedef
	const strategy = strategiesList.find((s) => s.name === currentPlayer.aiStrategy);
	if (!strategy) {
		console.error(`AI strategy "${currentPlayer.aiStrategy}" not found.`);
		return executeFallbackAction(game, scenario, setGame, currentPlayer);
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
	return executeFallbackAction(game, scenario, setGame, currentPlayer);
};

/**
 * Executes a fallback action (discard) for the AI player if their strategy fails to produce a valid move.
 * This is a fail-safe to ensure the game can always proceed.
 *
 * @param game - The current game state.
 * @param scenario - The scenario snapshot for the AI player.
 * @param setGame - React state setter for updating the game state.
 * @param currentPlayer - The player object for the AI-controlled player.
 */
const executeFallbackAction = (
	game: Game,
	scenario: Scenario,
	setGame: Dispatch<SetStateAction<Game | null>>,
	currentPlayer: Player,
): void => {
	console.log(`Executing fallback action (discarding a card) for player ${currentPlayer.id}.`);

	const fallbackAction: ActionConfig = {
		action: ActionTypes.Discard,
		params: {
			sourceHandIndex: Math.floor(Math.random() * scenario.playerHand.length),
		},
	};

	executeAction(game, setGame, currentPlayer.id, fallbackAction);
};
