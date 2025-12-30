import {
	ActionConfig,
	ActionTypes,
	BankActionHistory,
	BustActionHistory,
	DrawActionHistory,
	DrawActionParams,
	Game,
	GamePlayer,
	StopActionHistory,
} from '@/app/modules/game/model';
import { createGame } from '@/app/modules/game/setup';
import {
	calculateScore,
	cloneGameState,
	compareScores,
	getCurrentPlayer,
} from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface GameContextType {
	game: Game | null;
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
		console.log(`Starting Pelusillas game with players: ${players.map((p) => p.name).join(', ')}`);
		return createGame(players, {});
	});
};

export const finishGame = (setGame: Dispatch<SetStateAction<Game | null>>): void => {
	setGame((): Game | null => {
		console.log('Finishing game');
		return null;
	});
};

/**
 * Advances the game to the next player's turn.
 * Resets the hasBankedThisTurn flag for the new turn.
 */
const advanceToNextTurn = (game: Game): Game => {
	return {
		...game,
		turn: game.turn + 1,
		hasBankedThisTurn: false,
	};
};

/**
 * Checks if the game should end and determines the winner.
 * The game ends when the deck is empty.
 */
const checkGameEnd = (game: Game): Game => {
	if (game.deck.length > 0) {
		return game; // Game continues
	}

	// Deck is empty - game ends
	// All players with face-up cards automatically bank them
	for (const player of game.players) {
		if (player.faceUpCards.length > 0) {
			player.scorePile.push(...player.faceUpCards);
			player.faceUpCards = [];
		}
	}

	// Determine winner
	const sortedPlayers: GamePlayer[] = [...game.players].sort(compareScores);

	// Check for tie at the top
	if (sortedPlayers.length >= 2) {
		const topScore: number = calculateScore(sortedPlayers[0].scorePile);
		const secondScore: number = calculateScore(sortedPlayers[1].scorePile);

		if (topScore === secondScore && compareScores(sortedPlayers[0], sortedPlayers[1]) === 0) {
			return { ...game, winnerId: null }; // Complete tie
		}
	}

	return { ...game, winnerId: sortedPlayers[0].id };
};

/**
 * Central function for processing any player action (human or AI).
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

	if (getNextGameState(game, playerId, actionConfig)) {
		setGame((prevGame: Game | null): Game | null => {
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
 */
const getNextGameState = (
	game: Game | null,
	playerId: string,
	actionConfig: ActionConfig,
): Game | null => {
	if (!game) {
		console.error('No game to execute action');
		return null;
	}

	if (game.winnerId !== undefined) {
		console.error('Game has already ended, cannot execute actions');
		return null;
	}

	if (getCurrentPlayer(game).id !== playerId) {
		console.error(`It's not player ${playerId}'s turn to act`);
		return null;
	}

	let result: Game | null = null;
	game = cloneGameState(game);

	// First, check if player needs to bank their cards from previous turn
	if (!game.hasBankedThisTurn) {
		game = bankCards(game, playerId);
	}

	switch (actionConfig.action) {
		case ActionTypes.Draw: {
			result = draw(game, playerId, actionConfig.params as DrawActionParams);
			break;
		}
		case ActionTypes.Stop: {
			result = stop(game, playerId);
			break;
		}
		default: {
			console.error(`Unknown action type: ${actionConfig.action}`);
			break;
		}
	}

	if (result) {
		result = checkGameEnd(result);
	}

	return result;
};

/**
 * Banks the player's face-up cards at the start of their turn.
 */
const bankCards = (game: Game, playerId: string): Game => {
	const player: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!player) {
		return game;
	}

	if (player.faceUpCards.length > 0) {
		const cardsBanked: number = player.faceUpCards.length;
		const totalValue: number = calculateScore(player.faceUpCards);

		player.scorePile.push(...player.faceUpCards);
		player.faceUpCards = [];

		const historyEntry: BankActionHistory = {
			cardsBanked,
			totalValueBanked: totalValue,
		};

		game.history.push({
			turn: game.turn,
			action: 'bank',
			sourcePlayerId: playerId,
			data: historyEntry,
		});

		console.log(`Player ${playerId} banked ${cardsBanked} cards worth ${totalValue} points.`);
	}

	return { ...game, hasBankedThisTurn: true };
};

/**
 * Handles the Draw action.
 * Draws a card from the deck, optionally steals matching cards, and checks for bust.
 */
const draw = (game: Game, playerId: string, params: DrawActionParams): Game | null => {
	const player: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!player) {
		console.error('Invalid player for draw action');
		return null;
	}

	if (game.deck.length === 0) {
		console.error('Cannot draw - deck is empty');
		return null;
	}

	// Draw a card from the deck
	const drawnCard: number = game.deck.pop()!;

	// Check if this is a duplicate (player already has this value)
	const hasDuplicate: boolean = player.faceUpCards.includes(drawnCard);

	// Add the drawn card to face-up cards
	player.faceUpCards.push(drawnCard);

	// Track stolen cards for history
	const stolenFromPlayers: string[] = [];
	let stolenCardsCount: number = 0;

	// Handle stealing: mandatory after 2 cards, optional for first 2
	const shouldSteal: boolean = player.faceUpCards.length > 2 || params.stealMatching === true;

	if (shouldSteal) {
		// Steal all matching cards from other players
		for (const otherPlayer of game.players) {
			if (otherPlayer.id === playerId) continue;

			const matchingCards: number[] = otherPlayer.faceUpCards.filter(
				(card: number) => card === drawnCard,
			);

			if (matchingCards.length > 0) {
				stolenFromPlayers.push(otherPlayer.id);
				stolenCardsCount += matchingCards.length;

				// Remove matching cards from other player
				otherPlayer.faceUpCards = otherPlayer.faceUpCards.filter(
					(card: number) => card !== drawnCard,
				);

				// Add stolen cards to current player
				player.faceUpCards.push(...matchingCards);
			}
		}
	}

	// Record draw action in history
	const drawHistoryEntry: DrawActionHistory = {
		drawnCardValue: drawnCard,
		stolenFromPlayers,
		stolenCardsCount,
	};

	game.history.push({
		turn: game.turn,
		action: ActionTypes.Draw,
		sourcePlayerId: playerId,
		data: drawHistoryEntry,
	});

	// Check for bust condition: duplicate AND 3+ cards face up
	if (hasDuplicate && player.faceUpCards.length >= 3) {
		// Player busts - loses all face-up cards
		const cardsLost: number = player.faceUpCards.length;
		const totalValueLost: number = calculateScore(player.faceUpCards);

		const bustHistoryEntry: BustActionHistory = {
			duplicateValue: drawnCard,
			cardsLost,
			totalValueLost,
		};

		game.history.push({
			turn: game.turn,
			action: 'bust',
			sourcePlayerId: playerId,
			data: bustHistoryEntry,
		});

		// Move all face-up cards to discard pile
		game.discardPile.push(...player.faceUpCards);
		player.faceUpCards = [];

		console.log(
			`Player ${playerId} busted with duplicate ${drawnCard}! Lost ${cardsLost} cards worth ${totalValueLost} points.`,
		);

		// End turn after bust
		game = advanceToNextTurn(game);
	}

	return game;
};

/**
 * Handles the Stop action.
 * Player ends their turn, keeping their face-up cards to bank next turn.
 */
const stop = (game: Game, playerId: string): Game | null => {
	const player: GamePlayer | undefined = game.players.find((p) => p.id === playerId);

	if (!player) {
		console.error('Invalid player for stop action');
		return null;
	}

	const historyEntry: StopActionHistory = {
		cardsKept: player.faceUpCards.length,
	};

	game.history.push({
		turn: game.turn,
		action: ActionTypes.Stop,
		sourcePlayerId: playerId,
		data: historyEntry,
	});

	console.log(`Player ${playerId} stopped with ${player.faceUpCards.length} cards.`);

	return advanceToNextTurn(game);
};
