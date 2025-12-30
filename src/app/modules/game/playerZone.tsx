import ScorePileDisplay from '@/app/modules/game/accumulatorCard';
import DustBunnyCard from '@/app/modules/game/handCard';
import { GamePlayer } from '@/app/modules/game/model';
import { calculateScore, countCardsByValue } from '@/app/modules/game/utils';
import PlayerCard from '@/app/modules/player/card';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import React, { JSX } from 'react';

interface GamePlayerZoneProps extends React.HTMLAttributes<HTMLDivElement> {
	playerId: string;
	gamePlayer: GamePlayer;
	isThisPlayerTurn?: boolean;
	isUserPlayer: boolean;
}

export default function GamePlayerZone({
	playerId,
	gamePlayer,
	isThisPlayerTurn,
	isUserPlayer,
	style,
	...props
}: GamePlayerZoneProps): JSX.Element {
	const elementsHeight: string = '80px';

	// Group face-up cards by value
	const groupedCards: Map<number, number> = countCardsByValue(gamePlayer.faceUpCards);
	const faceUpTotal: number = calculateScore(gamePlayer.faceUpCards);

	return (
		<>
			<PlayerContext.Consumer>
				{(playerProvider: PlayerContextType | null): JSX.Element => {
					if (!playerProvider) {
						return <div>Player context not available</div>;
					}
					const playerData: Player | null =
						playerProvider.players.find((p) => p.id === playerId) || null;
					if (!playerData) {
						return <div>Unknown player: {playerId}</div>;
					}
					return (
						<div
							style={{
								backgroundColor: isUserPlayer ? playerData.color : '',
								borderTopRightRadius: isUserPlayer ? '12px' : '0',
								borderBottomRightRadius: isUserPlayer ? '12px' : '0',
								...style,
							}}
							{...props}
						>
							<div
								style={{
									marginLeft: '10px',
									padding: '3px',
									background: !isThisPlayerTurn
										? ''
										: isUserPlayer
											? 'linear-gradient(to left, #3d4749, transparent)'
											: ' #3d4749',
									borderRadius: '12px',
								}}
							>
								<div
									style={{
										display: 'flex',
										flexDirection: 'row',
										flexWrap: 'wrap',
										alignItems: 'center',
										gap: '10px',
										backgroundColor: playerData.color || 'var(--container)',
										padding: '10px',
										borderTopRightRadius: '10px',
										borderBottomRightRadius: '10px',
										borderTopLeftRadius: isUserPlayer ? '0px' : '10px',
										borderBottomLeftRadius: isUserPlayer ? '0px' : '10px',
										overflow: 'visible',
									}}
								>
									{/* Player info card */}
									<PlayerCard
										showOwnedIndicator={!isUserPlayer}
										style={{ height: elementsHeight }}
										player={playerData}
										gamePlayer={gamePlayer}
									/>

									{/* Score pile display */}
									<ScorePileDisplay
										scorePile={gamePlayer.scorePile}
										style={{ height: elementsHeight }}
									/>

									{/* Face-up cards */}
									{gamePlayer.faceUpCards.length > 0 && (
										<div
											style={{
												display: 'flex',
												flexDirection: 'column',
												alignItems: 'center',
												padding: '5px 10px',
												backgroundColor: 'rgba(0,0,0,0.1)',
												borderRadius: '8px',
											}}
										>
											<div style={{ fontSize: '0.7rem', marginBottom: '5px' }}>
												At Risk: {faceUpTotal} pts
											</div>
											<div
												style={{
													display: 'flex',
													flexWrap: 'wrap',
													gap: '5px',
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
															style={{ width: '45px', height: '45px' }}
														/>
													))}
											</div>
										</div>
									)}

									{/* No cards indicator */}
									{gamePlayer.faceUpCards.length === 0 && gamePlayer.scorePile.length === 0 && (
										<div
											style={{
												padding: '10px',
												opacity: 0.6,
												fontStyle: 'italic',
											}}
										>
											No cards yet
										</div>
									)}
								</div>
							</div>
						</div>
					);
				}}
			</PlayerContext.Consumer>
		</>
	);
}
