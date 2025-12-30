import React, { JSX } from 'react';

interface ScorePileDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
	scorePile: number[];
}

/**
 * ScorePileDisplay shows a summary of a player's banked score pile.
 */
export default function ScorePileDisplay({
	scorePile,
	style,
	...props
}: ScorePileDisplayProps): JSX.Element {
	const totalScore: number = scorePile.reduce((sum: number, val: number) => sum + val, 0);
	const cardCount: number = scorePile.length;

	return (
		<div
			style={{
				backgroundColor: 'var(--container)',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px',
				padding: '10px',
				minWidth: '60px',
				border: '2px solid var(--safe, #4a9c6d)',
				...style,
			}}
			{...props}
		>
			<div style={{ fontSize: '0.7rem', opacity: 0.8, marginBottom: '4px' }}>BANKED</div>
			<h2 style={{ margin: 0 }}>{totalScore}</h2>
			<div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
				{cardCount} {cardCount === 1 ? 'card' : 'cards'}
			</div>
		</div>
	);
}
