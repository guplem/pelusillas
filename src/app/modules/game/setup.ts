import { Game, GameConfig, GamePlayer } from '@/app/modules/game/model';
import { Player } from '@/app/modules/player/model';

/**
 * Creates the initial deck for Pelusillas.
 * - Values 1 to 5: 13 cards each (65 cards)
 * - Values 6 to 10: 9 cards each (45 cards)
 * - Total: 110 cards
 */
export function createDeck(): number[] {
	const deck: number[] = [];

	// Add 13 cards of each value from 1 to 5
	for (let value: number = 1; value <= 5; value++) {
		for (let i: number = 0; i < 13; i++) {
			deck.push(value);
		}
	}

	// Add 9 cards of each value from 6 to 10
	for (let value: number = 6; value <= 10; value++) {
		for (let i: number = 0; i < 9; i++) {
			deck.push(value);
		}
	}

	return deck;
}

/**
 * Shuffles an array in place using the Fisher-Yates algorithm.
 */
export function shuffleArray<T>(array: T[]): T[] {
	const shuffled: T[] = [...array];
	for (let i: number = shuffled.length - 1; i > 0; i--) {
		const j: number = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled;
}

/**
 * Factory function to create a new Game data object for Pelusillas.
 * @param players - Array of players to include in the game
 * @param gameConfig - Configuration options for the game
 * @returns A new Game data object
 */
export function createGame(players: Player[], gameConfig: GameConfig = {}): Game {
	if (players.length < 2) throw new Error('Game must have at least two players');
	if (players.length > 6) throw new Error('Game can have at most six players');

	const shuffledPlayerIds: string[] = shuffleArray(players.map((player: Player) => player.id));
	const gamePlayers: GamePlayer[] = shuffledPlayerIds.map((id: string) => createGamePlayer(id));

	const deck: number[] = shuffleArray(createDeck());

	return {
		players: gamePlayers,
		turn: 0,
		deck: deck,
		discardPile: [],
		hasBankedThisTurn: false,
		winnerId: undefined,
		history: [],
		aiDelay: gameConfig.aiDelay ?? 1000,
	};
}

/**
 * Factory function to create a new GamePlayer data object for Pelusillas.
 * Players start with no cards - they will draw on their turn.
 * @param id - Player ID
 * @returns A new GamePlayer data object
 */
function createGamePlayer(id: string): GamePlayer {
	return {
		id,
		faceUpCards: [],
		scorePile: [],
	};
}
