import {
	ActionTypes,
	AttackActionHistory,
	BoomActionHistory,
	HistoryElement,
	SwapActionHistory,
} from '@/app/modules/game/model';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import React from 'react';

/**
 * Processed log entry for display purposes
 */
interface ProcessedLogEntry {
	id: string;
	turn: number;
	action: ActionTypes | undefined;
	player: string;
	playerColor?: string;
	details: string;
	isUserAttacked?: boolean;
}

/**
 * Props for the GameLog component
 */
interface GameLogProps {
	history: HistoryElement[];
	currentPlayerId?: string;
	userPlayerId?: string;
}

/**
 * Grouped log entries by turn
 */
interface GroupedLogEntries {
	turn: number;
	entries: ProcessedLogEntry[];
}

export const GameLogPanel: React.FC<GameLogProps> = ({
	history,
	currentPlayerId,
	userPlayerId,
}: GameLogProps) => {
	return (
		<PlayerContext.Consumer>
			{(playerProvider: PlayerContextType | null) => {
				if (!playerProvider) {
					return <div>Player context not available</div>;
				}

				/**
				 * Get display name and color for a player
				 */
				const getPlayerInfo = (playerId: string): { name: string; color?: string } => {
					const player: Player | undefined = playerProvider.players.find((p) => p.id === playerId);
					return {
						name: player?.name || `Player ${playerId.slice(-4)}`,
						color: player?.color,
					};
				};

				// Get current player info for display
				const currentPlayerInfo: { name: string; color?: string } | null = currentPlayerId
					? getPlayerInfo(currentPlayerId)
					: null;

				/**
				 * Convert HistoryElement to ProcessedLogEntry for display
				 */
				const processHistoryElement = (
					element: HistoryElement,
					index: number,
				): ProcessedLogEntry => {
					const playerInfo: {
						name: string;
						color?: string;
					} = getPlayerInfo(element.sourcePlayerId);
					const baseId: string = `${element.turn}-${element.action}-${index}`;

					switch (element.action) {
						case ActionTypes.Attack: {
							const data: AttackActionHistory = element.data as AttackActionHistory;
							const targetInfo: {
								name: string;
								color?: string;
							} = getPlayerInfo(data.targetPlayerId);
							const gainedExtraAccumulator: string =
								data.obtainedExtraAccumulator != null
									? ` and gained an extra accumulator with value ${data.obtainedExtraAccumulator}`
									: '';
							const remainingHp: number = data.targetAccumulatorValue - data.sourceHandValue;
							const actionText: string = remainingHp <= 0 ? 'Destroyed' : 'Attacked';
							const remainingHpMessage: string =
								remainingHp > 0 ? ` (remaining HP: ${remainingHp})` : '';
							return {
								id: baseId,
								turn: element.turn,
								action: ActionTypes.Attack,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `${actionText} ${targetInfo.name}'s accumulator with a ${data.sourceHandValue} on an accumulator with value ${data.targetAccumulatorValue}${gainedExtraAccumulator}${remainingHpMessage}`,
								isUserAttacked: data.targetPlayerId === userPlayerId, // Check if user was targeted
							};
						}

						case ActionTypes.Swap: {
							const data: SwapActionHistory = element.data as SwapActionHistory;
							return {
								id: baseId,
								turn: element.turn,
								action: ActionTypes.Swap,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `Replaced an accumulator with value ${data.targetAccumulatorValue} with a card of value ${data.sourceHandValue}`,
							};
						}

						case ActionTypes.Discard: {
							return {
								id: baseId,
								turn: element.turn,
								action: ActionTypes.Discard,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `Discarded a card`,
							};
						}

						case ActionTypes.Boom: {
							const data: BoomActionHistory = element.data as BoomActionHistory;

							const accumulatorText: string =
								data.accumulatorsDestroyedQuantity === 1 ? 'accumulator' : 'accumulators';
							return {
								id: baseId,
								turn: element.turn,
								action: ActionTypes.Boom,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `Boomed the ${data.targetValue} and destroyed ${data.accumulatorsDestroyedQuantity} ${accumulatorText}`,
							};
						}

						default:
							return {
								id: baseId,
								turn: element.turn,
								action: undefined,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `Performed an unknown action`,
							};
					}
				};

				// Process and sort entries (newest first) and limit to maxEntries
				const processedEntries: ProcessedLogEntry[] = history
					.map((element: HistoryElement, index: number) => processHistoryElement(element, index))
					.reverse();

				/**
				 * Group entries by turn number
				 */
				const groupEntriesByTurn = (entries: ProcessedLogEntry[]): GroupedLogEntries[] => {
					const grouped: Map<number, ProcessedLogEntry[]> = new Map();

					entries.forEach((entry: ProcessedLogEntry) => {
						if (!grouped.has(entry.turn)) {
							grouped.set(entry.turn, []);
						}
						grouped.get(entry.turn)!.push(entry);
					});

					return Array.from(grouped.entries())
						.map(([turn, entries]: [number, ProcessedLogEntry[]]) => ({ turn, entries }))
						.sort((a: GroupedLogEntries, b: GroupedLogEntries) => b.turn - a.turn);
				};

				const groupedEntries: GroupedLogEntries[] = groupEntriesByTurn(processedEntries);

				/**
				 * Generate background style for log entry based on player color
				 */
				const getPlayerBackgroundStyle = (playerColor?: string): React.CSSProperties => {
					if (!playerColor) {
						return {};
					}

					// Apply player color with opacity for better readability
					return {
						backgroundColor: `${playerColor}40`, // 25% opacity
						border: `2px solid ${playerColor}`,
						borderRadius: '6px',
						margin: '4px 0',
						padding: '8px',
						boxShadow: `0 1px 3px ${playerColor}20`, // Subtle shadow with player color
					};
				};

				return (
					<div className='game-log'>
						<div className='game-log__content'>
							{/* Current player turn display */}
							{currentPlayerInfo && (
								<div
									className='game-log__current-turn'
									style={{
										padding: '12px',
										marginBottom: '16px',
										backgroundColor: currentPlayerInfo.color
											? `${currentPlayerInfo.color}20`
											: 'var(--container)',
										border: currentPlayerInfo.color
											? `2px solid ${currentPlayerInfo.color}`
											: '2px solid #ccc',
										borderRadius: '8px',
										textAlign: 'center',
										fontWeight: 'bold',
									}}
								>
									<h3
										style={{
											margin: 0,
											// color: currentPlayerInfo.color || 'inherit',
										}}
									>
										{currentPlayerInfo.name}'s Turn
									</h3>
								</div>
							)}

							{groupedEntries.length === 0 ? (
								<div className='game-log__empty'>
									<p>Start playing to see the game history.</p>
								</div>
							) : (
								<div className='game-log__list' role='log' aria-label='Game history'>
									{groupedEntries.map((group: GroupedLogEntries) => {
										// Get player name from the first entry in the turn (since all entries in a turn belong to the same player)
										const turnPlayerName: string =
											group.entries.length > 0 ? group.entries[0].player : 'Unknown Player';

										return (
											<div key={`turn-${group.turn + 1}`} className='game-log__turn-group'>
												<h4 className='game-log__turn-header'>
													Turn {group.turn + 1}: {turnPlayerName}
												</h4>
												<div className='game-log__turn-entries'>
													{group.entries.map((entry: ProcessedLogEntry) => (
														<div
															key={entry.id}
															role='listitem'
															style={getPlayerBackgroundStyle(entry.playerColor)}
														>
															<div className='log-entry__content'>
																<div className='log-entry__details'>
																	{entry.action == ActionTypes.Boom && (
																		<div
																			style={{
																				flexDirection: 'column',
																				display: 'flex',
																				alignItems: 'center',
																				marginBottom: '6px',
																			}}
																		>
																			<img
																				src='/boom-text.png'
																				alt='Boom Action'
																				style={{
																					maxHeight: '50px',
																				}}
																			/>
																		</div>
																	)}
																	{entry.isUserAttacked && (
																		<span>
																			<img
																				src='/favicon.png'
																				alt='Boom Action'
																				style={{
																					maxHeight: '17px',
																				}}
																			/>
																		</span>
																	)}
																	<span className='log-entry__description'> {entry.details}</span>
																</div>
															</div>
														</div>
													))}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</div>
				);
			}}
		</PlayerContext.Consumer>
	);
};
