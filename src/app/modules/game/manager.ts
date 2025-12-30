import {
	Accumulator,
	ActionConfig,
	ActionTypes,
	AttackActionHistory,
	AttackActionParams,
	BoomActionHistory,
	BoomActionParams,
	DiscardActionHistory,
	DiscardActionParams,
	Game,
	GamePlayer,
	SwapActionHistory,
	SwapActionParams,
} from '@/app/modules/game/model';
import { createAccumulator, createGame } from '@/app/modules/game/setup';
import {
	cloneGameState,
	getCurrentPlayer,
	getRandomCard,
	remainingHp,
} from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface GameContextType {
	game: Game | null; // The current game state, can be null if no game is set
	startGame: (_players: Player[]) => void;
	finishGame: () => void;
	getCurrentPlayer: (_game: Game) => GamePlayer;
	executeAction: (_playerId: string, _actionDefinition: ActionConfig) => boolean;
}

export const GameContext: React.Context<GameContextType | null> =
	createContext<GameContextType | null>(null);

export const startGame = async (
	setGame: Dispatch<SetStateAction<Game | null>>,
	players: Player[],
): Promise<void> => {
	setGame((): Game | null => {
		console.log(`Starting game with players: ${players.map((p) => p.name).join(', ')}`);
		return createGame(players, { initialAccumulatorsCount: 3, handCardsCount: 3 });
	});
};

export const finishGame = (setGame: Dispatch<SetStateAction<Game | null>>): void => {
	setGame((): Game | null => {
		console.log('Finishing game');
		return null; // Reset the game state
	});
};

/**
 * Advances the game to the next player with more than 0 HP.
 *
 * Responsibilities:
 * 1. Checks for win or draw conditions by counting living players (those with HP > 0).
 *    - If no players are alive, sets `winnerId` to `null` (draw).
 *    - If only one player is alive, sets `winnerId` to that player's ID.
 * 2. If the game continues, finds the next player in turn order who is still alive and advances the turn.
 *
 * @param game - The current game state
 * @returns {Game} Updated game state with either a new `turn` number or a `winnerId` if the game has ended.
 */
const advanceToNextTurn = (game: Game): Game => {
	const alivePlayers: GamePlayer[] = game.players.filter(
		(player: GamePlayer) => remainingHp(player.accumulators) > 0,
	);

	// Check win conditions
	if (alivePlayers.length === 0) {
		// No players alive - draw
		return { ...game, winnerId: null };
	} else if (alivePlayers.length === 1) {
		// Only one player alive - winner
		return { ...game, winnerId: alivePlayers[0].id };
	}

	// Game continues - find next alive player
	const maxAttempts: number = game.players.length;

	for (let attempt: number = 1; attempt <= maxAttempts; attempt++) {
		const nextTurn: number = game.turn + attempt;
		const nextPlayer: GamePlayer = game.players[nextTurn % game.players.length];
		if (remainingHp(nextPlayer.accumulators) > 0) {
			return { ...game, turn: nextTurn };
		}
	}

	console.error('No players with HP found after maximum attempts. This should not be possible.');
	return game;
};

 /**
 * Central function for processing any player action (human or AI).
 *
 * Validates the action, updates the game state if valid, and returns whether the action succeeded.
 * This is the main entry point for executing moves from AI strategies or user input.
 *
 * @param game - The current game state (can be null if not started).
 * @param setGame - React state setter for updating the game state.
 * @param playerId - The ID of the player performing the action.
 * @param actionConfig - The action to execute (type and parameters).
 * @returns {boolean} True if the action was successfully validated and applied, false otherwise.
 */
export const executeAction = (
	game: Game | null,
	setGame: Dispatch<SetStateAction<Game | null>>,
	playerId: string,
	actionConfig: ActionConfig,
): boolean => {
	let actionSuccess: boolean = false;
	console.log(
		`Executing action: ${actionConfig.action} for player ${playerId} with params: ${JSON.stringify(actionConfig.params)}`,
	);

	// First try to get the next game state evolving from the provided game state
	// This way no "update" will be shared accross all clients if the action is not valid
	if (getNextGameState(game, playerId, actionConfig)) {
		// If a next game state can be obtained, then do the actual state update
		setGame((prevGame: Game | null): Game | null => {
			// Use the "prevGame" to ensure we are working with the latest state and regenerate the next game state
			const nextGame: Game | null = getNextGameState(prevGame, playerId, actionConfig);
			if (nextGame) {
				actionSuccess = true;
				console.log(`Action ${actionConfig.action} executed successfully.`);
			} else {
				console.error(
					`Action ${actionConfig.action} failed for player ${playerId} even after successful pre-validation.`,
				);
			}
			return nextGame || prevGame;
		});
	}

	return actionSuccess;
};

/**
 * Core validation and state transition logic for all actions.
 *
 * Checks if the action is valid in the current game state and, if so, returns the updated game state.
 * If the action is invalid, returns null. This is the main reference for AI developers to understand valid moves.
 *
 * @param game - The current game state (can be null).
 * @param playerId - The ID of the player performing the action.
 * @param actionConfig - The action to validate and apply.
 * @returns {Game | null} The new game state if the action is valid, or null if invalid.
 */
const getNextGameState = (
	game: Game | null,
	playerId: string,
	actionConfig: ActionConfig,
): Game | null => {
	// Ensure game exists
	if (!game) {
		console.error('No game to execute action');
		return null;
	}

	// Ensure game is running
	if (game.winnerId !== undefined) {
		console.error('Game has already ended, cannot execute actions');
		return null;
	}
	// Ensure is player's turn
	if (getCurrentPlayer(game).id !== playerId) {
		console.error(`It's not player ${playerId}'s turn to act`);
		return null;
	}

	if (!actionConfig.params) {
		console.error(`Action parameters cannot be null for action: ${actionConfig.action}`);
		return null;
	}

	let result: {
		newGame: Game | null;
		newHistoryData:
			| AttackActionHistory
			| SwapActionHistory
			| DiscardActionHistory
			| BoomActionHistory
			| null;
	} | null = null;

	game = cloneGameState(game);

	// Global checks are OK, execute action:
	switch (actionConfig.action) {
		case ActionTypes.Attack: {
			result = attack(game, playerId, actionConfig.params as AttackActionParams);
			break;
		}
		case ActionTypes.Swap: {
			result = swap(game, playerId, actionConfig.params as SwapActionParams);
			break;
		}
		case ActionTypes.Discard: {
			result = discard(game, playerId, actionConfig.params as DiscardActionParams);
			break;
		}
		case ActionTypes.Boom: {
			result = boom(game, playerId, actionConfig.params as BoomActionParams);
			break;
		}
		default: {
			console.error(`Unknown action type: ${actionConfig.action}`);
			break;
		}
	}

	// Post action success checks
	if (result?.newGame) {
		// console.log(`Action ${actionConfig.action} executed successfully for player ${playerId}.`);

		for (const player of result.newGame.players) {
			// Ensure all players have full hands after action
			while (player.hand.length < result.newGame.handCardsCount) {
				console.warn(
					`Player ${player.id} has ${player.hand.length} cards, which is less than ${result.newGame.handCardsCount}. This happened after action ${actionConfig.action}. Adding a random card.`,
				);
				player.hand.push(getRandomCard());
			}

			// Ensure no depleted accumulators remain
			const indexToRemove: number[] = [];
			for (let i: number = 0; i < player.accumulators.length; i++) {
				const accumulator: Accumulator = player.accumulators[i];
				const hp: number = remainingHp([accumulator]);
				if (hp <= 0 && accumulator.originalValue > 0) {
					console.log(`Removing depleted accumulator from player's ${player.id} accumulators.`);
					indexToRemove.push(i);
				}
			}
			for (let i: number = indexToRemove.length - 1; i >= 0; i--) {
				player.accumulators.splice(indexToRemove[i], 1);
			}
		}

		// Register action in history
		if (result.newHistoryData)
			result.newGame.history.push({
				turn: game.turn,
				action: actionConfig.action,
				sourcePlayerId: playerId,
				data: result.newHistoryData,
			});
		else
			console.error(
				`No history data available for action ${actionConfig.action} executed by player ${playerId}.`,
			);
	}

	return result?.newGame ?? null;
};

const attack = (
	game: Game,
	playerId: string,
	{ targetPlayerId, sourceHandIndex, targetAccumulatorIndex }: AttackActionParams,
): { newGame: Game | null; newHistoryData: AttackActionHistory | null } | null => {
	if (
		!targetPlayerId ||
		sourceHandIndex === null ||
		sourceHandIndex === undefined ||
		targetAccumulatorIndex === null ||
		targetAccumulatorIndex === undefined
	) {
		console.error('Invalid parameters for attack action');
		return null;
	}

	game = game;
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);
	const targetPlayer: GamePlayer | undefined = game.players.find((p) => p.id === targetPlayerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for attack action');
		return null;
	}

	if (!targetPlayer) {
		console.error('Invalid target player for attack action');
		return null;
	}

	if (sourcePlayer.id === targetPlayerId) {
		console.error('Cannot attack yourself');
		return null;
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for attack action');
		return null;
	}

	if (targetAccumulatorIndex < 0 || targetAccumulatorIndex >= targetPlayer.accumulators.length) {
		console.error('Invalid accumulator index for attack action');
		return null;
	}

	const sourceCard: number = sourcePlayer.hand[sourceHandIndex];
	const targetAccumulator: Accumulator | undefined =
		targetPlayer.accumulators[targetAccumulatorIndex];

	if (!targetAccumulator) {
		console.error('Target accumulator does not exist');
		return null;
	}

	if (targetAccumulator.attacks.length > 0 && sourceCard == 0) {
		console.error(
			'Cannot attack an accumulator that has already been attacked with a card of value 0, it would not change anything',
		);
		return null;
	}

	if (targetAccumulator.originalValue == 0) {
		console.error('Cannot attack an accumulator with original value 0');
		return null;
	}

	const targetAccumulatorRemainingHealth: number = remainingHp([targetAccumulator]);

	if (targetAccumulatorRemainingHealth < sourceCard) {
		console.error("Cannot decrease an accumulator's value below zero");
		return null;
	}

	const obtainedExtraAccumulator: boolean =
		targetAccumulator.originalValue === sourceCard && targetAccumulator.attacks.length === 0;

	// STORE STATE IN HISTORY before performing the action
	const historyEntry: AttackActionHistory = {
		targetPlayerId: targetPlayerId,
		sourceHandValue: sourceCard,
		targetAccumulatorValue: targetAccumulatorRemainingHealth,
		obtainedExtraAccumulator: null,
	};

	// PERFORM THE ACTION
	if (obtainedExtraAccumulator) {
		const randomCard: number = getRandomCard();
		sourcePlayer.accumulators.push(createAccumulator(randomCard)); // Add a new accumulator
		historyEntry.obtainedExtraAccumulator = randomCard;
	}
	targetAccumulator.attacks.push(sourceCard);
	sourcePlayer.hand[sourceHandIndex] = getRandomCard(); // Replace the used card with a new random card
	game = advanceToNextTurn(game);

	return { newGame: game, newHistoryData: historyEntry };
};

const swap = (
	game: Game,
	playerId: string,
	{ sourceHandIndex, targetAccumulatorIndex }: SwapActionParams,
): { newGame: Game | null; newHistoryData: SwapActionHistory | null } | null => {
	if (
		sourceHandIndex === null ||
		sourceHandIndex === undefined ||
		targetAccumulatorIndex === null ||
		targetAccumulatorIndex === undefined
	) {
		console.error('Invalid parameters for swap action');
		return null;
	}

	game = game;
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for swap action');
		return null;
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for swap action');
		return null;
	}

	if (targetAccumulatorIndex < 0 || targetAccumulatorIndex >= sourcePlayer.accumulators.length) {
		console.error('Invalid accumulator index for swap action');
		return null;
	}

	const sourceCard: number = sourcePlayer.hand[sourceHandIndex];
	const targetAccumulator: Accumulator | undefined =
		sourcePlayer.accumulators[targetAccumulatorIndex];

	if (!targetAccumulator) {
		console.error('Target accumulator does not exist');
		return null;
	}

	if (targetAccumulator.attacks.length > 0) {
		console.error('Cannot swap with an accumulator that has attacks');
		return null;
	}

	// STORE STATE IN HISTORY before performing the action
	const historyEntry: SwapActionHistory = {
		sourceHandValue: sourceCard,
		targetAccumulatorValue: targetAccumulator.originalValue,
	};

	// PERFORM THE ACTION
	sourcePlayer.accumulators[targetAccumulatorIndex] = createAccumulator(sourceCard);
	sourcePlayer.hand[sourceHandIndex] = targetAccumulator.originalValue;

	return { newGame: game, newHistoryData: historyEntry };
};

const discard = (
	game: Game,
	playerId: string,
	{ sourceHandIndex }: DiscardActionParams,
): { newGame: Game | null; newHistoryData: DiscardActionHistory | null } | null => {
	if (sourceHandIndex === null || sourceHandIndex === undefined) {
		console.error('Invalid parameters for discard action');
		return null;
	}

	game = game;
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for discard action');
		return null;
	}

	if (sourceHandIndex < 0 || sourceHandIndex >= sourcePlayer.hand.length) {
		console.error('Invalid hand index for discard action');
		return null;
	}

	const sourceCard: number = sourcePlayer.hand[sourceHandIndex];

	// STORE STATE IN HISTORY before performing the action
	const historyEntry: DiscardActionHistory = {
		sourceHandValue: sourceCard,
	};

	// PERFORM THE ACTION
	sourcePlayer.hand[sourceHandIndex] = getRandomCard();
	game = advanceToNextTurn(game);

	return { newGame: game, newHistoryData: historyEntry };
};

const boom = (
	game: Game,
	playerId: string,
	{ targetValue }: BoomActionParams,
): { newGame: Game | null; newHistoryData: BoomActionHistory | null } | null => {
	if (targetValue === null || targetValue === undefined) {
		console.error('Invalid parameters for boom action');
		return null;
	}

	game = game;
	const sourcePlayer: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!sourcePlayer) {
		console.error('Invalid source player for boom action');
		return null;
	}

	if (targetValue <= 0) {
		console.error('Invalid target value for boom action');
		return null;
	}

	if (!sourcePlayer.hand.every((card: number) => card === 0)) {
		console.error('Player must have all hand cards with value 0 to execute boom action');
		return null;
	}

	let accumulatorsDestroyed: number = 0;

	// PERFORM THE ACTION and count destroyed accumulators
	for (const player of game.players) {
		for (let accIndex: number = 0; accIndex < player.accumulators.length; accIndex++) {
			const accumulator: Accumulator = player.accumulators[accIndex];
			const currentValue: number = remainingHp([accumulator]);

			// If the accumulator's current value matches the target value, destroy it
			if (currentValue === targetValue) {
				player.accumulators[accIndex].attacks.push(targetValue);
				accumulatorsDestroyed++;
			}
		}
	}

	// STORE STATE IN HISTORY after performing the action to capture results
	const historyEntry: BoomActionHistory = {
		targetValue: targetValue,
		accumulatorsDestroyedQuantity: accumulatorsDestroyed,
	};

	// Replace all hand cards with new random cards
	sourcePlayer.hand = sourcePlayer.hand.map(() => getRandomCard());
	game = advanceToNextTurn(game);

	return { newGame: game, newHistoryData: historyEntry };
};
