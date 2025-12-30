import { Scenario } from '@/app/modules/ai/model';
import { competitiveStrategy } from '@/app/modules/ai/strategies/competitive';
import { randomDrawStrategy } from '@/app/modules/ai/strategies/random';
import { statisticalStrategy } from '@/app/modules/ai/strategies/statistical';
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
		name: 'Random',
		description:
			'Randomly decides when to draw or stop. Gets riskier with fewer cards but tends to stop when it has collected a decent pile.',
		getActionFunction: randomDrawStrategy,
		maxAttempts: 10,
	},
	{
		name: 'Competitive',
		description:
			'Plays to maximize score and minimize risk. Stops if bust is likely, draws more when safe, and always steals when possible. Mimics a strong human player.',
		getActionFunction: competitiveStrategy,
		maxAttempts: 10,
	},
	{
		name: 'Statistical',
		description:
			'Uses visible board statistics and deck estimates to compute bust probability and expected value, then decides whether to draw or stop.',
		getActionFunction: statisticalStrategy,
		maxAttempts: 10,
	},
];
