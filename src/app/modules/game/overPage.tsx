import { GameContext, GameContextType } from '@/app/modules/game/manager';
import { Game, GamePlayer } from '@/app/modules/game/model';
import { calculateScore, getUniqueValues } from '@/app/modules/game/utils';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { JSX } from 'react';

interface PlayerScoreData {
	player: Player;
	gamePlayer: GamePlayer;
	score: number;
	uniqueValues: number;
	totalCards: number;
}

export default function GameOverPage(): JSX.Element {
	return (
		<GameContext.Consumer>
			{(gameProvider: GameContextType | null): JSX.Element => {
				if (!gameProvider || !gameProvider.game) {
					return (
						<div>
							<h1>Game Over</h1>
							<p>Game data not available</p>
						</div>
					);
				}

				const game: Game = gameProvider.game;
				const winnerId: string | null | undefined = game.winnerId;

				return (
					<PlayerContext.Consumer>
						{(playerProvider: PlayerContextType | null): JSX.Element => {
							// Build player score data
							const playerScores: PlayerScoreData[] = [];

							if (playerProvider) {
								for (const gp of game.players) {
									const player: Player | undefined = playerProvider.players.find(
										(p: Player) => p.id === gp.id,
									);
									if (player) {
										playerScores.push({
											player,
											gamePlayer: gp,
											score: calculateScore(gp.scorePile),
											uniqueValues: getUniqueValues(gp.scorePile).length,
											totalCards: gp.scorePile.length,
										});
									}
								}
							}

							// Sort by score descending, then unique values descending
							playerScores.sort((a, b) => {
								if (b.score !== a.score) return b.score - a.score;
								return b.uniqueValues - a.uniqueValues;
							});

							let winnerMessage: string = 'Game ended in a tie!';
							let winnerScore: number = 0;

							if (winnerId && playerProvider) {
								const winner: Player | undefined = playerProvider.players.find(
									(player: Player) => player.id === winnerId,
								);
								const winnerGP: GamePlayer | undefined = game.players.find(
									(gp: GamePlayer) => gp.id === winnerId,
								);
								if (winner && winnerGP) {
									winnerScore = calculateScore(winnerGP.scorePile);
									winnerMessage = `🎉 ${winner.name} wins with ${winnerScore} points! 🎉`;
								} else if (winner) {
									winnerMessage = `🎉 ${winner.name} is the winner! 🎉`;
								}
							}

							return (
								<div
									className='centeredChildren'
									style={{
										minHeight: '100vh',
										minWidth: '100vw',
										flexDirection: 'column',
									}}
								>
									<div
										style={{
											backgroundColor: 'var(--container)',
											borderRadius: '10px',
											padding: '30px',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
											gap: '20px',
											maxWidth: '600px',
											width: '90%',
										}}
									>
										<h1 style={{ margin: 0 }}>🐰 Game Over 🐰</h1>
										<h2 style={{ margin: 0, textAlign: 'center' }}>{winnerMessage}</h2>

										{/* Scoreboard */}
										<div
											style={{
												width: '100%',
												display: 'flex',
												flexDirection: 'column',
												gap: '10px',
											}}
										>
											<h3 style={{ margin: 0, textAlign: 'center' }}>Final Scores</h3>
											<table
												style={{
													width: '100%',
													borderCollapse: 'collapse',
													textAlign: 'left',
												}}
											>
												<thead>
													<tr style={{ borderBottom: '2px solid var(--text)' }}>
														<th style={{ padding: '8px' }}>Rank</th>
														<th style={{ padding: '8px' }}>Player</th>
														<th style={{ padding: '8px', textAlign: 'right' }}>Score</th>
														<th style={{ padding: '8px', textAlign: 'right' }}>Cards</th>
														<th style={{ padding: '8px', textAlign: 'right' }}>Unique</th>
													</tr>
												</thead>
												<tbody>
													{playerScores.map((ps, index) => (
														<tr
															key={ps.player.id}
															style={{
																borderBottom: '1px solid var(--text-muted)',
																backgroundColor:
																	ps.player.id === winnerId
																		? 'rgba(255, 215, 0, 0.2)'
																		: 'transparent',
															}}
														>
															<td style={{ padding: '8px' }}>
																{index === 0
																	? '🥇'
																	: index === 1
																		? '🥈'
																		: index === 2
																			? '🥉'
																			: index + 1}
															</td>
															<td
																style={{
																	padding: '8px',
																	fontWeight: ps.player.id === winnerId ? 'bold' : 'normal',
																}}
															>
																{ps.player.name}
																{ps.player.id === winnerId && ' 👑'}
															</td>
															<td
																style={{ padding: '8px', textAlign: 'right', fontWeight: 'bold' }}
															>
																{ps.score}
															</td>
															<td style={{ padding: '8px', textAlign: 'right' }}>
																{ps.totalCards}
															</td>
															<td style={{ padding: '8px', textAlign: 'right' }}>
																{ps.uniqueValues}
															</td>
														</tr>
													))}
												</tbody>
											</table>
											<div
												style={{
													fontSize: '0.8rem',
													color: 'var(--text-muted)',
													textAlign: 'center',
												}}
											>
												Tiebreaker: Most unique card values wins
											</div>
										</div>

										<p style={{ margin: 0 }}>Thank you for playing Pelusillas!</p>
										<button onClick={(): void => gameProvider.finishGame()}>
											Finish Game & Return to Lobby
										</button>
									</div>
								</div>
							);
						}}
					</PlayerContext.Consumer>
				);
			}}
		</GameContext.Consumer>
	);
}
