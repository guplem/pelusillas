import { Accumulator } from '@/app/modules/game/model';
import React, { JSX } from 'react';

interface GameAccumulatorCardProps extends React.HTMLAttributes<HTMLDivElement> {
	accumulator: Accumulator;
}

export default function GameAccumulatorCard({
	accumulator,
	style,
	onClick,
	...props
}: GameAccumulatorCardProps): JSX.Element {
	let remainingHp: number = accumulator.originalValue;
	for (const attack of accumulator.attacks) {
		remainingHp -= attack;
	}
	if (remainingHp < 0) {
		remainingHp = 0;
	}

	const isClickable: boolean = typeof onClick === 'function' && !props['aria-disabled'];

	const classNames: string = [
		'accumulator-card',
		isClickable ? 'clickable' : '',
		props.className ?? '',
	]
		.join(' ')
		.trim();

	return (
		<div
			className={classNames}
			style={{
				aspectRatio: '1 / 1',
				backgroundColor: 'var(--container)',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'space-evenly',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px',
				...style, // Merge provided styles with default styles
			}}
			onClick={onClick}
			{...props}
		>
			<h1>{remainingHp}</h1>
			{accumulator.attacks.length > 0 && <div>({accumulator.attacks.join(', ')})</div>}
		</div>
	);
}
