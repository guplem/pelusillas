import { Scenario } from '@/app/modules/ai/model';
import { randomAttackStrategy } from '@/app/modules/ai/strategies/random';
import { ActionConfig } from '@/app/modules/game/model';

/**
 * List of all available AI strategies for the game.
 *
 * Each entry defines a selectable AI strategy, its description, the function implementing its logic,
 * and optional configuration such as the maximum number of attempts to produce a valid action.
 *
 * @property name - The display name of the strategy (shown in the UI dropdown).
 * @property description - A short summary of what the strategy does.
 * @property getActionFunction - The function that receives a Scenario and returns an ActionConfig (the AI's move).
 * @property maxAttempts - (Optional) Maximum number of times to retry the strategy if it produces invalid actions.
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
	// Add your strategies here. Example:
	// {
	// 	name: 'Strategy name',
	// 	description: 'Short description of the strategy.',
	// 	function: functionWithLogic,
	// },
	{
		name: 'Random attack',
		description:
			'Attacks with the tactical genius of an Iggy: completely random, occasionally brilliant, mostly chaos.',
		getActionFunction: randomAttackStrategy,
		maxAttempts: 50, // Optional: limit the number of attempts for this strategy. By default, it will try 10 times, but since this is a random strategy, we can increase it to allow more attempts to find a valid action.
	},
];
