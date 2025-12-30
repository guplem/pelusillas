/**
 * Color mapping for each card value (1-10).
 * Each value has a distinct color for easy recognition.
 */
export const CARD_COLORS: Record<number, string> = {
	1: '#3498DB', // Cyan / Light Blue
	2: '#8E44AD', // Purple / Violet
	3: '#E74C3C', // Red / Salmon
	4: '#C2185B', // Magenta / Dark Pink
	5: '#7DCEA0', // Lime Green
	6: '#F39C12', // Orange
	7: '#F1C40F', // Yellow
	8: '#3F51B5', // Indigo / Dark Blue
	9: '#16A085', // Teal / Sea Green
	10: '#F06292', // Pink
};

/**
 * Gets the background color for a card based on its value.
 * @param value - The card value (1-10)
 * @returns The hex color for the card
 */
export function getCardColor(value: number): string {
	return CARD_COLORS[value] ?? '#666666';
}
