import { GamePlayer } from '@/app/modules/game/model';
import { remainingAccumulatorsDefending } from '@/app/modules/game/utils';
import { Player } from '@/app/modules/player/model';
import { isPlayerOwned } from '@/app/modules/player/utils';
import React, { JSX, useState } from 'react';

interface PlayerCardProps extends React.HTMLAttributes<HTMLDivElement> {
	player: Player;
	removePlayer?: (_id: string) => void | undefined; // Optional, if you want to handle player removal
	gamePlayer?: GamePlayer | undefined; // Optional, if you want to display game player info
	showOwnedIndicator?: boolean; // Optional prop to show owned indicator
}

export default function PlayerCard({
	player,
	removePlayer: onRemovePlayer,
	gamePlayer,
	style,
	showOwnedIndicator = true, // Optional prop to show owned indicator
	...props
}: PlayerCardProps): JSX.Element {
	const [isHovered, setIsHovered] = useState<boolean>(false);

	// Determine if there's content to show in the hover section
	const hasHoverContent: boolean =
		!!player.aiStrategy || (showOwnedIndicator && isPlayerOwned(player));
	const showHover: boolean = !gamePlayer || (isHovered && hasHoverContent);

	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				aspectRatio: '1 / 1',
				backgroundColor: player.color,
				alignItems: 'center',
				padding: !gamePlayer ? '10px' : '0',
				borderRadius: '10px',
				...style, // Merge provided styles with default styles
			}}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			{...props}
		>
			{/* Top section with ownership indicator, name, and bot indicator */}
			<div
				style={{
					display: 'flex',
					flexWrap: 'wrap',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '8px',
					flex: 1,
				}}
			>
				{!showHover && (
					<span
						style={{
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							display: '-webkit-box',
							WebkitLineClamp: 2,
							WebkitBoxOrient: 'vertical',
							cursor: 'default',
						}}
					>
						{player.name}
					</span>
				)}
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					justifyContent: 'center',
					alignItems: 'center',
					gap: '8px',
					flex: 1,
				}}
			>
				{/* Show CPU and ownership indicators only on hover and if there's content */}
				{showHover && (
					<p style={{ textAlign: 'center', cursor: 'default' }}>
						{player.aiStrategy && (
							<span
								style={{
									display: '-webkit-box',
									WebkitLineClamp: 2,
									WebkitBoxOrient: 'vertical',
									overflow: 'hidden',
									textOverflow: 'ellipsis',
									whiteSpace: 'normal',
									maxWidth: '100%',
								}}
							>
								{player.aiStrategy}
							</span>
						)}
						{showOwnedIndicator && isPlayerOwned(player) && (
							<span
								style={{
									display: 'inline-block',
									padding: '2px 10px',
									borderRadius: '999px',
									background: 'rgba(0,0,0,0.15)',
									color: '#222',
									fontSize: '0.85em',
									fontWeight: 500,
									letterSpacing: '0.02em',
									marginTop: '4px',
								}}
							>
								Owned
							</span>
						)}
					</p>
				)}

				{/* Remove button at the bottom */}
				{onRemovePlayer && isPlayerOwned(player) && (
					<button onClick={() => onRemovePlayer(player.id)} title={`Remove player ${player.name}`}>
						Remove
					</button>
				)}

				{/* Optional: Display game player info if available */}
				{!showHover && (
					<div
						style={{
							display: 'flex',
							flexDirection: 'row',
							justifyContent: 'space-evenly',
							gap: '4px',
							cursor: 'default',
						}}
					>
						{/* <div>{remainingHp(gamePlayer.accumulators)} HP</div>
					<div>{remainingAccumulators(gamePlayer.accumulators).length} Acc</div> */}
						<h2>{remainingAccumulatorsDefending(gamePlayer?.accumulators ?? []).length}</h2>
					</div>
				)}
			</div>
		</div>
	);
}
