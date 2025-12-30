import { Player, PlayerConfig } from '@/app/modules/player/model';
import { getRandomColor, getRandomName } from '@/app/modules/player/utils';
import { UserStore } from '@/app/modules/user/store';

/**
 * Factory function to create a new Player data object.
 * @param config - Configuration options for the player
 * @returns A new Player data object
 */
export function createPlayer(config: PlayerConfig): Player {
	return {
		id: config.id ?? crypto.randomUUID(),
		name: config.name ?? getRandomName(),
		color: config.color ?? getRandomColor(),
		aiStrategy: config.aiStrategy ?? null,
		owner: config.owner ?? UserStore.getState().id!,
	};
}

export const predefinedPlayerColors: string[] = ['#A38B67', '#f2a55f', '#85C6E0', '#7db593'];

// ORIGINAL LIST
// Warm earth tones (browns, oranges)
// '#714E2D',
// '#A38D4E',
// '#A38B67',
// '#D8944C',
// '#DC9E54',
// '#F6DAB7',
// '#E5D2A4',
// '#C3C5A9',
// '#F6E5C5',
// '#FFF1D3',
// '#616D66',
// '#4A6C68',
// '#719488',
// '#7BA5A5',
// '#A8B6A9',
// '#92B8BE',
// '#85C6E0',
// '#B7CCC4',
// '#D4DFD3',

export const predefinedNames: string[] = [
	'Igordo',
	'Polete',
	'Romesro',
	'La Juana',
	'Hinoko',
	'Saumelio',
	'Arandanos',
	'Bielo',
	'Paco',
	'Poya',
	'Sispa',
	'Sadge',
	'Emplolete',
	'Wolopol',
];
