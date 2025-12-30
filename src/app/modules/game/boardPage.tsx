import GameHandCard from '@/app/modules/game/handCard';
import { GameLogPanel } from '@/app/modules/game/logPanel';
import { GameContext, GameContextType } from '@/app/modules/game/manager';
import { ActionTypes, GamePlayer } from '@/app/modules/game/model';
import GamePlayerZone from '@/app/modules/game/playerZone';
import { remainingAccumulatorsDefending, remainingHp } from '@/app/modules/game/utils';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import React, { JSX, MouseEvent, useState } from 'react';

interface BoardPageParams {
	/** The id for the player that the user is controlling */
	userPlayerId: string;
}

export default function GameBoardPage({ userPlayerId }: BoardPageParams): JSX.Element {
	const { leave }: RoomStoreType = RoomStore();
	const [handSelected, setHandSelected] = useState<number | null>(null);
	const [boomValue, setBoomValue] = useState<string>('');

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
					const canBoom: boolean =
						userGamePlayer?.hand.length === 3 &&
						userGamePlayer?.hand.reduce((sum: number, value: number) => sum + value, 0) === 0;

					function handleSelectHandCard(handCardIndex: number): void {
						setHandSelected((prevSelected) => {
							if (prevSelected === handCardIndex) {
								return null; // Deselect if already selected
							}
							return handCardIndex; // Select the new card
						});
					}

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
												minWidth: '200px',
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
													href='#' // With this, the link will visually look like a link, but it won't redirect to anything
													onClick={(e: MouseEvent<HTMLAnchorElement>): void => {
														e.preventDefault();
														leave();
													}}
												>
													Leave
												</a>
												{' - '}
												<a
													href='#' // With this, the link will visually look like a link, but it won't redirect to anything
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
											</small>{' '}
											{/* {!userGamePlayer && (
												<div>
													Unknown Controlled player: {userPlayerId}. <br /> All (
													{gameProvider.game?.players.length}) players:{' '}
													{gameProvider.game?.players.map((player) => player.id).join(', ')}
												</div>
											)} */}
											{/* {isThisPlayerTurn && <div style={{ textAlign: 'center' }}>Your Turn</div>} */}
											{userGamePlayer && (
												<>
													<div
														style={{
															display: 'flex',
															flexDirection: 'column',
															justifyContent: 'center',
															gap: '10px',
															minHeight: 0,
															padding: '10px',
															overflow: 'visible',
														}}
													>
														{userGamePlayer.hand.map((handCard, index) => (
															<GameHandCard
																onClick={() => handleSelectHandCard(index)}
																style={{
																	cursor: 'pointer',
																}}
																key={index}
																originalValue={handCard}
																isSelected={handSelected === index}
																isPlayerTurn={isThisPlayerTurn}
															/>
														))}
													</div>
													<div
														style={{
															display: 'flex',
															flexDirection: 'row',
															justifyContent: 'space-evenly',
															alignItems: 'center',
															gap: '10px',
															margin: '10px',
														}}
													>
														<div
															style={{
																textAlign: 'center',
																display: 'flex',
																flexDirection: 'column',
																alignItems: 'center',
															}}
														>
															<h2>
																{
																	remainingAccumulatorsDefending(userGamePlayer.accumulators).length
																}{' '}
															</h2>
															<div>Defenses</div>
														</div>
														<div>
															<p>{remainingHp(userGamePlayer.accumulators)} HP</p>
															<p>{userGamePlayer.accumulators.length} Acc</p>
														</div>
													</div>
													<div
														style={{
															display: 'flex',
															flexDirection: 'column',
															justifyContent: 'center',
															gap: '10px',
														}}
													>
														<div
															style={{
																display: 'flex',
																flexDirection: 'row',
																alignItems: 'center',
																justifyContent: 'center',
																gap: '10px',
															}}
														>
															<input
																style={{ flex: 1 }}
																type='number'
																min='1'
																max='9'
																value={boomValue}
																onChange={(e: React.ChangeEvent<HTMLInputElement>): void => {
																	const value: string = e.target.value;
																	if (value === '' || (Number(value) >= 1 && Number(value) <= 9)) {
																		setBoomValue(value);
																	}
																}}
																placeholder='Target'
																disabled={!isThisPlayerTurn || !canBoom}
															/>
															<button
																style={{
																	flex: 1,
																	flexDirection: 'column',
																	display: 'flex',
																	alignItems: 'center',
																}}
																disabled={boomValue === '' || !isThisPlayerTurn || !canBoom}
																onClick={() => {
																	const numValue: number = Number(boomValue);
																	if (numValue >= 1 && numValue <= 9) {
																		const success: boolean = gameProvider.executeAction(
																			userGamePlayer.id,
																			{
																				action: ActionTypes.Boom,
																				params: {
																					targetValue: numValue,
																				},
																			},
																		);
																		if (success) {
																			setBoomValue(''); // Reset input after action
																		}
																	}
																}}
															>
																<img
																	src='/boom-text.png'
																	alt='Boom Action'
																	style={{
																		opacity:
																			boomValue === '' || !isThisPlayerTurn || !canBoom ? 0.5 : 1,
																		maxHeight: '25px',
																	}}
																/>
															</button>
														</div>

														<button
															disabled={handSelected === null || !isThisPlayerTurn}
															onClick={() => {
																let success: boolean = false;
																success = gameProvider.executeAction(userGamePlayer.id, {
																	action: ActionTypes.Discard,
																	params: {
																		sourceHandIndex: handSelected!,
																	},
																});
																if (success) {
																	setHandSelected(null); // Reset selection after action
																}
															}}
														>
															Discard Hand Card
														</button>
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
													canSelectAccumulator={handSelected !== null}
													onSelectAccumulator={(index: number) => {
														if (!userGamePlayer) return;
														let success: boolean = false;
														if (player.id === userGamePlayer.id) {
															success = gameProvider.executeAction(player.id, {
																action: ActionTypes.Swap,
																params: {
																	sourceHandIndex: handSelected!,
																	targetAccumulatorIndex: index,
																},
															});
														} else {
															success = gameProvider.executeAction(userGamePlayer.id, {
																action: ActionTypes.Attack,
																params: {
																	targetPlayerId: player.id,
																	sourceHandIndex: handSelected!,
																	targetAccumulatorIndex: index,
																},
															});
														}
														if (success) {
															setHandSelected(null); // Reset selection after action
														}
													}}
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
												userPlayerId={userPlayerId}
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
