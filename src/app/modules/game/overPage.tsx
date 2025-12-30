import { GameContext, GameContextType } from '@/app/modules/game/manager';
import { Game } from '@/app/modules/game/model';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { JSX } from 'react';

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
							let winnerMessage: string = 'Game ended without a winner (Draw)';

							if (winnerId && playerProvider) {
								const winner: Player | undefined = playerProvider.players.find(
									(player: Player) => player.id === winnerId,
								);
								if (winner) {
									winnerMessage = `🎉 ${winner.name} is the winner! 🎉`;
								} else {
									winnerMessage = `Winner: ${winnerId}`;
								}
							}

							return (
								<div
									// Div (container) that centers its child at its center
									className='centeredChildren'
									style={{
										minHeight: '100vh',
										minWidth: '100vw',
										flexDirection: 'column',
									}}
								>
									<div
										// The centered div (element)
										style={{
											backgroundColor: 'var(--container)',
											borderRadius: '10px',
											padding: '20px',
											display: 'flex',
											flexDirection: 'column',
											alignItems: 'center',
										}}
									>
										<h1>Game Over</h1>
										<h2>{winnerMessage}</h2>
										<p>Thank you for playing!</p>
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
