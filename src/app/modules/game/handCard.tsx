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
				backgroundColor: isHighlighted ? 'var(--highlight, #a8d5ba)' : 'var(--container)',
				display: 'flex',
				flexDirection: 'column',
				justifyContent: 'center',
				alignItems: 'center',
				textAlign: 'center',
				borderRadius: '10px',
				border: isHighlighted
					? '2px solid var(--border-highlight, #4a9c6d)'
					: '1px solid var(--border, #555)',
				position: 'relative',
				...style,
			}}
			{...props}
		>
			<h2 style={{ margin: 0, fontSize: '1.8rem' }}>{value}</h2>
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
