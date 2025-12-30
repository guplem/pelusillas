import { strategiesList } from '@/app/modules/ai/strategies';
import { PlayerContext, PlayerContextType } from '@/app/modules/player/manager';
import { Player } from '@/app/modules/player/model';
import { createPlayer } from '@/app/modules/player/setup';
import { FormEvent, JSX, useContext, useState } from 'react';

export default function PlayerCreationForm(): JSX.Element {
	const [playerName, setPlayerName] = useState<string>('');
	const [aiStrategy, setAiStrategy] = useState<string>('human');
	const [playerColor, setPlayerColor] = useState<string>('');
	const playerContext: PlayerContextType | null = useContext(PlayerContext);

	const isValidHexColor = (color: string): boolean => {
		const hexColorRegex: RegExp = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
		return hexColorRegex.test(color);
	};

	const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		if (!playerContext) {
			console.error('Player context not available');
			return;
		}

		// Validate color if provided
		if (playerColor.trim() && !isValidHexColor(playerColor.trim())) {
			alert('Please enter a valid hex color (e.g., #FF0000 or #F00)');
			return;
		}

		const newPlayer: Player = createPlayer({
			name: playerName.trim() || undefined,
			color: playerColor.trim() || undefined,
			aiStrategy: aiStrategy === 'human' ? null : aiStrategy,
		});

		playerContext.addPlayer(newPlayer);

		// Reset form
		setPlayerName('');
		setAiStrategy('human');
		setPlayerColor('');
	};

	return (
		<form onSubmit={handleSubmit}>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					gap: '10px',
				}}
			>
				<div>
					<label htmlFor='playerName'>Player Name: </label>
					<input
						type='text'
						id='playerName'
						value={playerName}
						onChange={(e) => setPlayerName(e.target.value)}
						placeholder='Leave empty for random name'
					/>
				</div>

				<div style={{ display: 'flex', alignItems: 'center' }}>
					<label htmlFor='playerColor' style={{ marginRight: '4px' }}>
						Color:{' '}
					</label>
					<input
						type='text'
						id='playerColor'
						value={playerColor}
						onChange={(e) => setPlayerColor(e.target.value)}
						placeholder='Leave empty for random color'
						style={{ verticalAlign: 'middle' }}
					/>
					<span
						style={{
							width: '20px',
							height: '20px',
							backgroundColor:
								playerColor && isValidHexColor(playerColor.trim())
									? playerColor.trim()
									: 'transparent',
							marginLeft: '10px',
							borderRadius: '5px',
							verticalAlign: 'middle',
							border:
								playerColor && isValidHexColor(playerColor.trim())
									? ''
									: '1px solid var(--border, #719488)',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							// fontWeight: 'bold',
							fontSize: '11px',
							color: '#719488',
						}}
					>
						{!playerColor.trim() || !isValidHexColor(playerColor.trim()) ? '?' : ''}
					</span>
				</div>
				{playerColor.trim() && !isValidHexColor(playerColor.trim()) && (
					<div style={{ color: 'red', marginLeft: '0', fontSize: '12px', marginTop: '2px' }}>
						Invalid hex color format
					</div>
				)}

				<div>
					<label htmlFor='aiStrategy'>Strategy: </label>
					<select
						id='aiStrategy'
						value={aiStrategy}
						onChange={(e): void => setAiStrategy(e.target.value)}
					>
						<option value='human'>Human</option>
						{strategiesList.map((strategy) => (
							<option key={strategy.name} value={strategy.name}>
								{strategy.name}
							</option>
						))}
					</select>
					{/* Show description for selected AI strategy, if not human */}
					{aiStrategy !== 'human' && (
						<div
							style={{
								fontSize: '12px',
								color: '#719488',
								marginTop: '4px',
								maxWidth: '300px', // Prevents the box from growing too wide
								wordBreak: 'break-word', // Ensures long words/lines break
								whiteSpace: 'pre-line', // Preserves line breaks if present
							}}
						>
							{
								strategiesList.find((strategy): boolean => strategy.name === aiStrategy)
									?.description
							}
						</div>
					)}
				</div>
			</div>
			<button
				type='submit'
				style={{
					width: '100%',
					marginTop: '10px',
				}}
			>
				Add Player
			</button>
		</form>
	);
}
