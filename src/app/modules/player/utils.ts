import { Player } from '@/app/modules/player/model';
import { predefinedNames, predefinedPlayerColors } from '@/app/modules/player/setup';
import { UserStore } from '@/app/modules/user/store';

/**
 * Checks if a player is owned by the current user.
 * @param player - The player to check ownership for
 * @returns True if the player is owned by the current user
 */
export function isPlayerOwned(player: Player): boolean {
	return player.owner === UserStore.getState().id;
}

/**
 * Utility function to get a random predefined name.
 * @returns A random name from the predefined names array
 */
export function getRandomName(): string {
	return predefinedNames[Math.floor(Math.random() * predefinedNames.length)];
}

/**
 * Utility function to get a random predefined color, prioritizing unused colors.
 * @param takenColors - Array of colors already taken by other players (optional)
 * @returns A random color from the predefined colors array, prioritizing unused
 */
export function getRandomColor(takenColors?: string[]): string {
	const available = predefinedPlayerColors.filter(
		(color) => !takenColors || !takenColors.includes(color),
	);
	if (available.length > 0) {
		return available[Math.floor(Math.random() * available.length)];
	}
	// fallback: all are taken, pick any
	return predefinedPlayerColors[Math.floor(Math.random() * predefinedPlayerColors.length)];
}
