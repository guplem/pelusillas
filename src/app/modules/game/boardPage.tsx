import DustBunnyCard from '@/app/modules/game/handCard';
import { GameLogPanel } from '@/app/modules/game/logPanel';
import { GameContext, GameContextType } from '@/app/modules/game/manager';
import { ActionTypes, GamePlayer } from '@/app/modules/game/model';
import GamePlayerZone from '@/app/modules/game/playerZone';
import { calculateScore, countCardsByValue } from '@/app/modules/game/utils';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { JSX, MouseEvent } from 'react';

interface BoardPageParams {
	/** The id for the player that the user is controlling */
	userPlayerId: string;
}

export default function GameBoardPage({ userPlayerId }: BoardPageParams): JSX.Element {
	const { leave }: RoomStoreType = RoomStore();

	return (
		<>
			<GameContext.Consumer>
				{(gameProvider: GameContextType | null): JSX.Element => {
					if (!gameProvider) {
						return <div>Game context not available</div>;
					}
					const userGamePlayer: GamePlayer | null =
						gameProvider.game?.players.find((player) => player.id === userPlayerId) || null;

					const currentPlayerId: string | null = gameProvider.getCurrentPlayer(
						gameProvider.game!,
					).id;
					const isThisPlayerTurn: boolean = !!(
						userGamePlayer && currentPlayerId === userGamePlayer.id
					);

					const deckSize: number = gameProvider.game?.deck.length ?? 0;
					const userFaceUpCards: number[] = userGamePlayer?.faceUpCards ?? [];
					const userScore: number = calculateScore(userGamePlayer?.scorePile ?? []);
					const userFaceUpTotal: number = calculateScore(userFaceUpCards);

					// Group face-up cards by value for display
					const groupedCards: Map<number, number> = countCardsByValue(userFaceUpCards);

					return (
						<PlayerContext.Consumer>
							{(playerProvider: PlayerContextType | null): JSX.Element => {
								if (!playerProvider) {
									return <div>Player context not available</div>;
								}
								const playerData: Player | null =
									playerProvider.players.find((p) => p.id === userPlayerId) || null;

								return (
									<div
										style={{
											display: 'flex',
											height: '100vh',
											width: '100vw',
											flexDirection: 'row',
										}}
									>
										{/* ======= PLAYER CONTROLS ======= */}
										<div
											style={{
												flex: 1,
												minWidth: '220px',
												backgroundColor: playerData?.color ?? 'var(--container)',
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'space-between',
												padding: '10px',
											}}
										>
											<small
												style={{
													textAlign: 'center',
													display: 'block',
												}}
											>
												<a
													href='#'
													onClick={(e: MouseEvent<HTMLAnchorElement>): void => {
														e.preventDefault();
														leave();
													}}
												>
													Leave
												</a>
												{' - '}
												<a
													href='#'
													onClick={(e: MouseEvent<HTMLAnchorElement>): void => {
														e.preventDefault();
														gameProvider.finishGame();
													}}
												>
													Finish Game
												</a>{' '}
												{' - '}
												<a href='/help' target='_blank' rel='noopener noreferrer'>
													Help
												</a>
											</small>

											{userGamePlayer && (
												<>
													{/* Player Stats */}
													<div
														style={{
															display: 'flex',
															flexDirection: 'column',
															alignItems: 'center',
															gap: '15px',
															padding: '10px',
														}}
													>
														<div style={{ textAlign: 'center' }}>
															<h3 style={{ margin: '0 0 5px 0' }}>Your Stats</h3>
															<div>
																Banked Score: <strong>{userScore}</strong>
															</div>
															<div>
																At Risk: <strong>{userFaceUpTotal}</strong> (
																{userFaceUpCards.length} cards)
															</div>
														</div>

														{/* Face-up cards display */}
														{userFaceUpCards.length > 0 && (
															<div style={{ textAlign: 'center' }}>
																<div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
																	Your Face-Up Cards:
																</div>
																<div
																	style={{
																		display: 'flex',
																		flexWrap: 'wrap',
																		gap: '8px',
																		justifyContent: 'center',
																	}}
																>
																	{Array.from(groupedCards.entries())
																		.sort(([a], [b]) => a - b)
																		.map(([value, count]) => (
																			<DustBunnyCard
																				key={value}
																				value={value}
																				count={count}
																				style={{ width: '50px', height: '50px' }}
																			/>
																		))}
																</div>
															</div>
														)}
													</div>

													{/* Deck Info */}
													<div
														style={{
															textAlign: 'center',
															padding: '10px',
															backgroundColor: 'rgba(0,0,0,0.1)',
															borderRadius: '8px',
														}}
													>
														<div style={{ fontSize: '0.9rem' }}>Dust Pile</div>
														<h2 style={{ margin: '5px 0' }}>{deckSize}</h2>
														<div style={{ fontSize: '0.8rem' }}>cards remaining</div>
													</div>

													{/* Action Buttons */}
													<div
														style={{
															display: 'flex',
															flexDirection: 'column',
															gap: '10px',
															padding: '10px',
														}}
													>
														{/* Pending Steal Decision - show steal options */}
														{gameProvider.game?.pendingStealDecision && isThisPlayerTurn ? (
															<>
																<div
																	style={{
																		textAlign: 'center',
																		padding: '8px',
																		backgroundColor: 'rgba(224, 123, 83, 0.2)',
																		borderRadius: '8px',
																		marginBottom: '5px',
																	}}
																>
																	<strong>
																		Steal {gameProvider.game.pendingStealDecision.drawnCardValue}
																		s?
																	</strong>
																</div>
																<button
																	style={{
																		padding: '15px',
																		fontSize: '1.1rem',
																		backgroundColor: '#e07b53',
																	}}
																	onClick={() => {
																		gameProvider.executeAction(userGamePlayer.id, {
																			action: ActionTypes.Steal,
																			params: {},
																		});
																	}}
																>
																	🎯 Steal Cards
																</button>
																<button
																	style={{
																		padding: '15px',
																		fontSize: '1.1rem',
																		backgroundColor: '#888',
																	}}
																	onClick={() => {
																		gameProvider.executeAction(userGamePlayer.id, {
																			action: ActionTypes.SkipSteal,
																			params: {},
																		});
																	}}
																>
																	🚫 Don't Steal
																</button>
															</>
														) : (
															<>
																{/* Normal action buttons - Draw and Stop */}
																<button
																	disabled={!isThisPlayerTurn || deckSize === 0}
																	style={{
																		padding: '15px',
																		fontSize: '1.1rem',
																		backgroundColor:
																			isThisPlayerTurn && deckSize > 0 ? '#4a9c6d' : undefined,
																	}}
																	onClick={() => {
																		gameProvider.executeAction(userGamePlayer.id, {
																			action: ActionTypes.Draw,
																			params: {},
																		});
																	}}
																>
																	🎴 Draw Card
																</button>

																<button
																	disabled={!isThisPlayerTurn || userFaceUpCards.length < 3}
																	style={{
																		padding: '15px',
																		fontSize: '1.1rem',
																		backgroundColor:
																			isThisPlayerTurn && userFaceUpCards.length >= 3
																				? '#5a8dc7'
																				: undefined,
																		opacity:
																			isThisPlayerTurn && userFaceUpCards.length < 3 ? 0.5 : 1,
																	}}
																	onClick={() => {
																		gameProvider.executeAction(userGamePlayer.id, {
																			action: ActionTypes.Stop,
																			params: {},
																		});
																	}}
																>
																	✋ Stop & Keep Cards
																	{userFaceUpCards.length < 3 &&
																		isThisPlayerTurn &&
																		userFaceUpCards.length > 0 && (
																			<div
																				style={{
																					fontSize: '0.7rem',
																					marginTop: '4px',
																				}}
																			>
																				(Need {3 - userFaceUpCards.length} more cards)
																			</div>
																		)}
																</button>
															</>
														)}
													</div>

													{/* Turn indicator */}
													<div
														style={{
															textAlign: 'center',
															padding: '10px',
															fontWeight: 'bold',
															color: isThisPlayerTurn ? '#4a9c6d' : '#888',
														}}
													>
														{isThisPlayerTurn
															? "🎯 It's Your Turn!"
															: 'Waiting for other players...'}
													</div>
												</>
											)}
										</div>

										{/* ======= PLAYERS BOARD ======= */}
										<div
											style={{
												flex: 7,
												display: 'flex',
												flexDirection: 'column',
												gap: '10px',
												paddingTop: '10px',
												paddingBottom: '10px',
												paddingRight: '10px',
												overflow: 'auto',
											}}
										>
											{gameProvider.game?.players.map((player) => (
												<GamePlayerZone
													isThisPlayerTurn={currentPlayerId === player.id}
													key={player.id}
													isUserPlayer={userGamePlayer?.id === player.id}
													playerId={player.id}
													gamePlayer={player}
												/>
											))}
										</div>

										{/* ======= GAME LOG ======= */}
										<div
											style={{
												flex: 2,
												minWidth: '200px',
												backgroundColor: 'var(--container)',
												display: 'flex',
												flexDirection: 'column',
												justifyContent: 'space-between',
												padding: '10px',
												overflow: 'auto',
											}}
										>
											<GameLogPanel
												history={gameProvider.game?.history || []}
												currentPlayerId={currentPlayerId || undefined}
											/>
										</div>
									</div>
								);
							}}
						</PlayerContext.Consumer>
					);
				}}
			</GameContext.Consumer>
		</>
	);
}
