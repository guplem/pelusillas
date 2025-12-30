import { getCardColor } from '@/app/modules/game/cardColors';
import React, { JSX } from 'react';

interface DustBunnyCardProps extends React.HTMLAttributes<HTMLDivElement> {
	value: number;
	count?: number; // Number of cards with this value (for grouped display)
	isHighlighted?: boolean;
}

/**
 * DustBunnyCard displays a dust bunny card with its value.
 * Can optionally show a count when multiple cards of the same value are grouped.
 */
export default function DustBunnyCard({
	value,
	count = 1,
	isHighlighted = false,
	style,
	...props
}: DustBunnyCardProps): JSX.Element {
	const cardColor: string = getCardColor(value);
	const classNames: string = [
		'dust-bunny-card',
		isHighlighted ? 'highlighted' : '',
		props.className ?? '',
	]
		.join(' ')
		.trim();

	return (
		<div
			className={classNames}
			style={{
				aspectRatio: '1 / 1',
				minWidth: '50px',
				maxWidth: '80px',
				backgroundColor: cardColor,
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px',
				border: isHighlighted ? '3px solid white' : '2px solid rgba(0, 0, 0, 0.3)',
				boxShadow: isHighlighted
					? '0 0 10px rgba(255, 255, 255, 0.5)'
					: '0 2px 4px rgba(0, 0, 0, 0.2)',
				position: 'relative',
				...style,
			}}
			{...props}
		>
			<h2
				style={{
					margin: 0,
					fontSize: '1.8rem',
					color: 'white',
					textShadow: '1px 1px 2px rgba(0, 0, 0, 0.5)',
					fontWeight: 'bold',
				}}
			>
				{value}
			</h2>
			{count > 1 && (
				<div
					style={{
						position: 'absolute',
						top: '-8px',
						right: '-8px',
						backgroundColor: 'var(--accent, #e07b53)',
						color: 'white',
						borderRadius: '50%',
						width: '24px',
						height: '24px',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
						fontSize: '0.8rem',
						fontWeight: 'bold',
					}}
				>
					×{count}
				</div>
			)}
		</div>
	);
}
