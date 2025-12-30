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

/**
 * Predefined player colors based on the card color scheme.
 * Uses a subset of the card colors for player identification.
 * These are muted/adjusted versions to work well as background colors.
 */
export const predefinedPlayerColors: string[] = [
	'#2980B9', // Muted Cyan (based on card 1: #3498DB)
	'#7D3C98', // Muted Purple (based on card 2: #8E44AD)
	'#C0392B', // Muted Red (based on card 3: #E74C3C)
	'#117864', // Muted Teal (based on card 9: #16A085)
	'#D68910', // Muted Orange (based on card 6: #F39C12)
	'#2E4053', // Dark Blue-Grey (based on card 8: #3F51B5)
];

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
