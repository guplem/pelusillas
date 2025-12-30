import React, { JSX } from 'react';

interface GameHandCardProps extends React.HTMLAttributes<HTMLDivElement> {
	originalValue: number;
	isSelected: boolean;
	isPlayerTurn: boolean;
}

export default function GameHandCard({
	originalValue,
	style,
	isSelected,
	isPlayerTurn,
	...props
}: GameHandCardProps): JSX.Element {
	const classNames: string = [
		'hand-card',
		isSelected ? 'selected' : '',
		!isPlayerTurn ? 'disabled' : '',
		props.className ?? '',
	]
		.join(' ')
		.trim();

	return (
		<div
			className={classNames}
			style={{
				aspectRatio: '1 / 1',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				minHeight: 0,
				...style, // Merge provided styles with default styles
			}}
			{...props}
		>
			<h1 style={{ fontSize: '4rem' }}>{originalValue}</h1>
		</div>
	);
}
