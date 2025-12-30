import {
	ActionTypes,
	BankActionHistory,
	BustActionHistory,
	DrawActionHistory,
	HistoryElement,
	StopActionHistory,
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
	icon?: string;
	isBust?: boolean;
}

/**
 * Props for the GameLog component
 */
interface GameLogProps {
	history: HistoryElement[];
	currentPlayerId?: string;
	_userPlayerId?: string;
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
						case ActionTypes.Draw: {
							const data: DrawActionHistory = element.data as DrawActionHistory;
							const hasStolen: boolean = data.stolenFromPlayers.length > 0;
							if (hasStolen) {
								const victimInfo: { name: string; color?: string } = getPlayerInfo(
									data.stolenFromPlayers[0],
								);
								return {
									id: baseId,
									turn: element.turn,
									action: ActionTypes.Draw,
									player: playerInfo.name,
									playerColor: playerInfo.color,
									details: `Stole a ${data.drawnCardValue} from ${victimInfo.name}`,
									icon: '🎯',
								};
							}
							return {
								id: baseId,
								turn: element.turn,
								action: ActionTypes.Draw,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `Drew a ${data.drawnCardValue} from the deck`,
								icon: '🃏',
							};
						}

						case ActionTypes.Stop: {
							const data: StopActionHistory = element.data as StopActionHistory;
							return {
								id: baseId,
								turn: element.turn,
								action: ActionTypes.Stop,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `Stopped and kept ${data.cardsKept} cards`,
								icon: '✋',
							};
						}

						case 'bank': {
							const data: BankActionHistory = element.data as BankActionHistory;
							return {
								id: baseId,
								turn: element.turn,
								action: undefined,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `Banked ${data.cardsBanked} cards worth ${data.totalValueBanked} points`,
								icon: '💰',
							};
						}

						case 'bust': {
							const data: BustActionHistory = element.data as BustActionHistory;
							return {
								id: baseId,
								turn: element.turn,
								action: undefined,
								player: playerInfo.name,
								playerColor: playerInfo.color,
								details: `BUST! Drew a duplicate ${data.duplicateValue} and lost ${data.cardsLost} cards`,
								icon: '💥',
								isBust: true,
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
								icon: '❓',
							};
					}
				};

				// Process and sort entries (newest first)
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
				 * Generate background style for log entry based on player color and action type
				 */
				const getEntryStyle = (entry: ProcessedLogEntry): React.CSSProperties => {
					const baseStyle: React.CSSProperties = {
						borderRadius: '6px',
						margin: '4px 0',
						padding: '8px',
					};

					// Special styling for bust action
					if (entry.isBust) {
						return {
							...baseStyle,
							backgroundColor: 'rgba(220, 53, 69, 0.3)',
							border: '2px solid #dc3545',
							boxShadow: '0 1px 3px rgba(220, 53, 69, 0.3)',
						};
					}

					if (!entry.playerColor) {
						return baseStyle;
					}

					return {
						...baseStyle,
						backgroundColor: `${entry.playerColor}40`,
						border: `2px solid ${entry.playerColor}`,
						boxShadow: `0 1px 3px ${entry.playerColor}20`,
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
									<h3 style={{ margin: 0 }}>🐰 {currentPlayerInfo.name}'s Turn</h3>
								</div>
							)}

							{groupedEntries.length === 0 ? (
								<div className='game-log__empty'>
									<p>Start playing to see the game history.</p>
								</div>
							) : (
								<div className='game-log__list' role='log' aria-label='Game history'>
									{groupedEntries.map((group: GroupedLogEntries) => {
										const turnPlayerName: string =
											group.entries.length > 0 ? group.entries[0].player : 'Unknown Player';

										return (
											<div key={`turn-${group.turn + 1}`} className='game-log__turn-group'>
												<h4 className='game-log__turn-header'>
													Turn {group.turn + 1}: {turnPlayerName}
												</h4>
												<div className='game-log__turn-entries'>
													{group.entries.map((entry: ProcessedLogEntry) => (
														<div key={entry.id} role='listitem' style={getEntryStyle(entry)}>
															<div className='log-entry__content'>
																<div className='log-entry__details'>
																	<span style={{ marginRight: '8px' }}>{entry.icon}</span>
																	<span className='log-entry__description'>{entry.details}</span>
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
