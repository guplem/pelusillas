import { executeAiStrategy } from '@/app/modules/ai/manager';
import GameBoardPage from '@/app/modules/game/boardPage';
import { executeAction, finishGame, GameContext, startGame } from '@/app/modules/game/manager';
import { ActionConfig, Game } from '@/app/modules/game/model';
import GameOverPage from '@/app/modules/game/overPage';
import { getCurrentPlayer } from '@/app/modules/game/utils';
import { addPlayer, PlayerContext, removePlayer } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import PlayerPage from '@/app/modules/player/page';
import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import { UserStore, UserStoreType } from '@/app/modules/user/store';
import { useSyncState } from '@robojs/sync';
import { JSX, useEffect, useMemo, useState } from 'react';

export default function GamePage(): JSX.Element {
	const { room }: RoomStoreType = RoomStore();
	const { id: userId }: UserStoreType = UserStore();

	const [players, setPlayers] = useSyncState<Player[]>([], [room, 'players']);
	const [game, setGame] = useSyncState<Game | null>(null, [room, 'game']);

	// For local multiplayer: track which human player is currently selected for viewing
	const [selectedPlayerIndex, setSelectedPlayerIndex] = useState<number>(0);

	// Get all human players owned by the current user
	const ownedHumanPlayers: Player[] = useMemo(
		(): Player[] => players.filter((p: Player) => p.owner === userId && !p.aiStrategy),
		[players, userId],
	);

	// Determine which player to show controls for
	const activePlayerId: string = useMemo((): string => {
		if (ownedHumanPlayers.length === 0) {
			return 'not-found';
		}

		// If current turn is one of our players, show that player
		if (game) {
			const currentPlayer: Player | undefined = ownedHumanPlayers.find(
				(p: Player) => p.id === getCurrentPlayer(game).id,
			);
			if (currentPlayer) {
				return currentPlayer.id;
			}
		}

		// Otherwise show the selected player (for viewing their stats)
		const safeIndex: number = Math.min(selectedPlayerIndex, ownedHumanPlayers.length - 1);
		return ownedHumanPlayers[safeIndex]?.id || 'not-found';
	}, [ownedHumanPlayers, game, selectedPlayerIndex]);

	useEffect((): void => {
		// This effect is the trigger for AI players.
		// Whenever the game state changes, it checks if it's an AI's turn and, if so, executes its strategy.
		if (!game || !userId) {
			return;
		}
		console.log('Received game update');
		executeAiStrategy(userId, game, players, setGame);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [game]);

	return (
		<div
			style={{
				minHeight: '100vh',
			}}
		>
			<GameContext.Provider
				value={{
					game: game,
					startGame: (players: Player[]) => startGame(setGame, players),
					finishGame: () => finishGame(setGame),
					getCurrentPlayer: (game: Game) => getCurrentPlayer(game),
					executeAction: (playerId: string, actionDefinition: ActionConfig) =>
						executeAction(game, setGame, playerId, actionDefinition),
				}}
			>
				<PlayerContext.Provider
					value={{
						players: players,
						addPlayer: (player: Player) => addPlayer(setPlayers, player),
						removePlayer: (id: string) => removePlayer(setPlayers, id),
					}}
				>
					{game ? (
						// Show end screen only if game has a winner and no pending steal decision
						game.winnerId !== undefined && !game.pendingStealDecision ? (
							<GameOverPage />
						) : (
							<GameBoardPage
								userPlayerId={activePlayerId}
								ownedPlayerCount={ownedHumanPlayers.length}
								onSelectPlayer={(index: number): void => setSelectedPlayerIndex(index)}
								ownedPlayers={ownedHumanPlayers}
							/>
						)
					) : (
						<PlayerPage />
					)}
				</PlayerContext.Provider>
			</GameContext.Provider>
		</div>
	);
}
