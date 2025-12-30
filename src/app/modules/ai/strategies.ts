import { Scenario } from '@/app/modules/ai/model';
import { randomDrawStrategy } from '@/app/modules/ai/strategies/random';
import { ActionConfig } from '@/app/modules/game/model';

/**
 * List of all available AI strategies for Pelusillas.
 *
 * Each entry defines a selectable AI strategy, its description, the function implementing its logic,
 * and optional configuration such as the maximum number of attempts to produce a valid action.
 */
export const strategiesList: {
	/** The display name of the strategy (shown in the UI dropdown). */
	name: string;
	/** A short summary of what the strategy does. */
	description: string;
	/**
	 * The function implementing the AI logic.
	 * Receives the current Scenario and returns an ActionConfig (the AI's chosen move).
	 */
	getActionFunction: (_gameScenario: Scenario) => ActionConfig;
	/**
	 * (Optional) Maximum number of times to retry the strategy if it produces invalid actions.
	 * If not set, a default value is used.
	 */
	maxAttempts?: number;
}[] = [
	{
		name: 'Random Bunny',
		description:
			'Randomly decides when to draw or stop. Gets riskier with fewer cards but tends to stop when it has collected a decent pile.',
		getActionFunction: randomDrawStrategy,
		maxAttempts: 10,
	},
];
