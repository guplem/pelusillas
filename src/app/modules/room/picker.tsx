import { RoomStore, RoomStoreType } from '@/app/modules/room/store';
import React, { ChangeEvent, FormEvent, JSX, useState } from 'react';

export type RoomPickerProps = {
	onSwitchToCreator: () => void;
};

export default function RoomPicker({ onSwitchToCreator }: RoomPickerProps): JSX.Element {
	const { join }: RoomStoreType = RoomStore();

	// state for the text field
	const [roomFieldValue, setRoomFieldValue] = useState<string>('');

	const [error, setError] = useState<string | null>(null);

	// on submit, prevent reload, log and set the entered room name
	const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
		event.preventDefault();

		const params: URLSearchParams = new URLSearchParams({ roomName: roomFieldValue });
		const response: Response = await fetch(`/api/room?${params.toString()}`, {
			method: 'HEAD',
		});
		if (!response.ok) {
			console.warn(`Room "${roomFieldValue}" does not exist`);
			setError(`Room "${roomFieldValue}" does not exist`);
			return;
		}

		setError(null);
		join(roomFieldValue);
	};

	return (
		<form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
			<div className='wrapWithStretchedChildren' style={{ gap: '5px' }}>
				<label htmlFor='roomName'>Room Name</label>
				<input
					id='roomName'
					type='text'
					value={roomFieldValue}
					onChange={(event: ChangeEvent<HTMLInputElement>): void =>
						setRoomFieldValue(event.target.value)
					}
					autoFocus
					placeholder='Enter room name'
				/>
			</div>
			<button type='submit' disabled={roomFieldValue === ''}>
				Join
			</button>
			{error && <p style={{ color: 'red' }}>{error}</p>}
			<div style={{ marginTop: '10px', textAlign: 'center' }}>
				<hr
					style={{
						width: '30px',
						height: '3px',
						background: 'var(--border, #719488)',
						opacity: 0.5,
						border: 'none',
						borderRadius: '5px',
					}}
				/>
				<span
					style={{
						color: 'var(--accent)',
						cursor: 'pointer',
						textDecoration: 'none',
					}}
					onMouseOver={(e: React.MouseEvent<HTMLSpanElement>): void => {
						(e.target as HTMLSpanElement).style.textDecoration = 'underline';
					}}
					onMouseOut={(e: React.MouseEvent<HTMLSpanElement>): void => {
						(e.target as HTMLSpanElement).style.textDecoration = 'none';
					}}
					onClick={onSwitchToCreator}
					tabIndex={0}
					role='button'
					aria-label='Switch to create room'
				>
					Create a room instead
				</span>
			</div>
		</form>
	);
}
