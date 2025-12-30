import { Player } from '@/app/modules/player/model';
import React, { createContext, Dispatch, SetStateAction } from 'react';

export interface PlayerContextType {
	players: Player[];
	addPlayer: (_player: Player) => void;
	removePlayer: (_id: string) => void;
}

export const PlayerContext: React.Context<PlayerContextType | null> =
	createContext<PlayerContextType | null>(null);

/**
 * Checks if a user already owns a non-bot player
 */
export const userOwnsNonBotPlayer = (players: Player[], userId: string): boolean => {
	return players.some((player: Player): boolean => player.owner === userId && !player.aiStrategy);
};

/**
 * Validates if a player can be added based on ownership rules.
 *
 * Business rule: A single user can only own one non-AI (human) player at a time, but can create any number of AI players.
 *
 * @param existingPlayers - The current list of players in the room.
 * @param newPlayer - The player to be added.
 * @returns {{ isValid: boolean; error?: string }}
 *   - `isValid`: True if the player can be added, false otherwise.
 *   - `error`: Optional error message if the addition is invalid.
 */
export const validatePlayerAddition = (
	existingPlayers: Player[],
	newPlayer: Player,
): { isValid: boolean; error?: string } => {
	// Allow adding bot players without restriction
	if (newPlayer.aiStrategy) {
		return { isValid: true };
	}

	// Check if user already owns a non-bot player
	if (userOwnsNonBotPlayer(existingPlayers, newPlayer.owner)) {
		return {
			isValid: false,
			error: 'User can only own one non-bot player at a time',
		};
	}

	return { isValid: true };
};

export const addPlayer = async (
	setPlayers: Dispatch<SetStateAction<Player[]>>,
	player: Player,
): Promise<{ success: boolean; error?: string }> => {
	return new Promise((resolve): void => {
		setPlayers((prevPlayers: Player[]): Player[] => {
			// Validate player addition
			const validation: {
				isValid: boolean;
				error?: string;
			} = validatePlayerAddition(prevPlayers, player);

			if (!validation.isValid) {
				console.warn(`Failed to add player ${player.name}: ${validation.error}`);
				resolve({ success: false, error: validation.error });
				return prevPlayers; // Return unchanged state
			}

			console.log(`Adding player: ${player.name}`);
			resolve({ success: true });
			return [...prevPlayers, player];
		});
	});
};

export const removePlayer = async (
	setPlayers: Dispatch<SetStateAction<Player[]>>,
	id: string,
): Promise<void> => {
	setPlayers((prevPlayers: Player[]): Player[] => {
		if (prevPlayers.length === 0) return prevPlayers;
		const newPlayers: Player[] = prevPlayers.filter((player) => player.id !== id);
		console.log(`Removing player: ${prevPlayers.find((player) => player.id === id)?.name}`);
		return newPlayers;
	});
};
