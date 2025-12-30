/**
 * Player interface representing a game player with unique ID, name, and color
 */
export interface Player {
	readonly id: string;
	readonly name: string;
	readonly color: string;
	readonly aiStrategy: string | null;
	readonly owner: string;
}

export interface PlayerConfig {
	id?: string;
	name?: string;
	color?: string;
	aiStrategy?: string | null;
	owner?: string;
}
