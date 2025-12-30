import { Scenario } from '@/app/modules/ai/model';
import { ActionConfig, ActionTypes } from '@/app/modules/game/model';

export const randomAttackStrategy = (gameScenario: Scenario): ActionConfig => {
	const targetPlayerId: string =
		gameScenario.board[Math.floor(Math.random() * gameScenario.board.length)].playerId;

	// Find the board of the target player
	const targetBoardEntry: (typeof gameScenario.board)[number] | undefined = gameScenario.board.find(
		(b) => b.playerId === targetPlayerId,
	);

	const accumulatorsLength: number = targetBoardEntry ? targetBoardEntry.accumulators.length : 0;
	console.log(`${accumulatorsLength} accumulators.`);
	const accumulatorIndex: number = Math.floor(Math.random() * accumulatorsLength);
	console.log(`${accumulatorIndex} accumulator index.`);

	return {
		action: ActionTypes.Attack,
		params: {
			targetPlayerId: targetPlayerId,
			sourceHandIndex: Math.floor(Math.random() * gameScenario.playerHand.length),
			targetAccumulatorIndex: accumulatorIndex,
		},
	};
};
