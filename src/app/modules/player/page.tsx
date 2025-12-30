import { GameContext, GameContextType } from '@/app/modules/game/manager';
import PlayerCard from '@/app/modules/player/card';
import PlayerCreationForm from '@/app/modules/player/creationForm';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { JSX, MouseEvent, useContext } from 'react';

export default function PlayerPage(): JSX.Element {
	const { room, leave }: RoomStoreType = RoomStore();
	const gameContext: GameContextType | null = useContext(GameContext);

	return (
		<PlayerContext.Consumer>
			{(playerProvider: PlayerContextType | null): JSX.Element => {
				if (!playerProvider) {
					return <div>Player context not available</div>;
				}

				return (
					<div
						style={{
							display: 'flex',
							flexDirection: 'column',
							minHeight: '100vh',
							justifyContent: 'space-between',
						}}
					>
						<div>
							{/* Player Form */}
							<div
								// Div (container) that centers its child at its center
								className='centeredChildren'
							>
								<div
									// The centered div (element)
									style={{
										backgroundColor: 'var(--container)',
										borderRadius: '10px',
										padding: '20px',
										margin: '20px',
									}}
								>
									<PlayerCreationForm />
								</div>
							</div>

							{/* Player List */}
							<div style={{ margin: '20px' }}>
								<h3>Players ({playerProvider.players.length})</h3>
								<div
									style={{
										display: 'flex',
										flexWrap: 'wrap',
										gap: '10px',
										// justifyContent: 'center',
										backgroundColor: 'var(--container)',
										borderRadius: '10px',
										padding: '20px',
									}}
								>
									{playerProvider.players.map(
										(player: Player): JSX.Element => (
											<div
												key={player.id}
												style={{
													width: 'min(100px, 100%)',
													maxWidth: '100px',
												}}
											>
												<PlayerCard player={player} removePlayer={playerProvider.removePlayer} />
											</div>
										),
									)}
									{playerProvider.players.length === 0 && <p>No players yet</p>}
								</div>
							</div>

							<div
								// Div (container) that centers its child at its center
								className='centeredChildren'
							>
								<button
									// The centered div (element)
									onClick={(): void => {
										if (playerProvider.players.length > 0) {
											if (!gameContext) {
												alert('Game context not available');
												return;
											}

											gameContext?.startGame(playerProvider.players);
										} else {
											alert('Please add at least one player to start the game.');
										}
									}}
								>
									Start Game
								</button>
							</div>
						</div>

						{/* Leave Room at Bottom of the page */}
						<small
							style={{ marginTop: '15px', textAlign: 'center', display: 'block', padding: '20px' }}
						>
							<a
								href='#' // With this, the link will visually look like a link, but it won't redirect to anything
								onClick={(e: MouseEvent<HTMLAnchorElement>): void => {
									e.preventDefault();
									leave();
								}}
							>
								Leave Room "{room}"
							</a>
							{' - '}
							<a href='/help' target='_blank' rel='noopener noreferrer'>
								Help
							</a>
						</small>
					</div>
				);
			}}
		</PlayerContext.Consumer>
	);
}
