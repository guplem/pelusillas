import { Accumulator, Game, GameConfig, GamePlayer } from '@/app/modules/game/model';
import { getRandomCard } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';

export const defaultHandCardsCount: number = 3;
export const defaultInitialAccumulatorsCount: number = 3;

/**
 * Factory function to create a new Game data object.
 * @param players - Array of players to include in the game
 * @param gameConfig - Configuration options for the game
 * @returns A new Game data object
 */
export function createGame(players: Player[], gameConfig: GameConfig = {}): Game {
	if (players.length <= 1) throw new Error('Game must have at least two players');

	const shuffledPlayerIds: string[] = shufflePlayerOrder(
		players.map((player: Player) => player.id),
	);
	const gamePlayers: GamePlayer[] = shuffledPlayerIds.map((id: string) =>
		createGamePlayer(id, gameConfig),
	);

	return {
		players: gamePlayers,
		turn: 0,
		handCardsCount: gameConfig.handCardsCount ?? defaultHandCardsCount,
		winnerId: undefined,
		history: [],
		aiDelay: gameConfig.aiDelay ?? 1000,
	};
}

/**
 * Factory function to create a new GamePlayer data object.
 * @param id - Player ID
 * @param gameConfig - Configuration options for the player
 * @returns A new GamePlayer data object
 */
function createGamePlayer(id: string, gameConfig: GameConfig = {}): GamePlayer {
	const hand: number[] = [];
	for (let i: number = 0; i < (gameConfig.handCardsCount ?? defaultHandCardsCount); i++) {
		hand.push(getRandomCard());
	}

	const accumulators: Accumulator[] = [];
	for (
		let i: number = 0;
		i < (gameConfig.initialAccumulatorsCount ?? defaultInitialAccumulatorsCount);
		i++
	) {
		accumulators.push(
			createAccumulator(
				getRandomCard({
					0: 0, // Exclude card with value 0 from initial accumulators
				}),
			),
		);
	}

	return {
		id,
		hand,
		accumulators,
	};
}

/**
 * Factory function to create a new Accumulator data object.
 * @param value - The original value of the accumulator
 * @returns A new Accumulator data object
 */
export function createAccumulator(value: number): Accumulator {
	return {
		originalValue: value,
		attacks: [],
	};
}

/**
 * Utility function to shuffle player order using Fisher-Yates algorithm.
 * @param playerIds - Array of player IDs to shuffle
 * @returns Shuffled array of player IDs
 */
function shufflePlayerOrder(playerIds: string[]): string[] {
	const shuffled: string[] = [...playerIds];
	for (let i: number = shuffled.length - 1; i > 0; i--) {
		const j: number = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}
