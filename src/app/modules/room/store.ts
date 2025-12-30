import { create, StoreApi, UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';

export type RoomStoreType = {
	room: string | null;
	join: (_roomName: string) => void;
	leave: () => void;
};

export const RoomStore: UseBoundStore<StoreApi<RoomStoreType>> = create<RoomStoreType>()(
	persist<RoomStoreType>(
		(set): RoomStoreType => ({
			room: null,
			join: (roomName: string): void => set({ room: roomName }),
			leave: (): void => set({ room: null }),
		}),
		// PERSISTANCE CONFIGURATION
		{ name: 'roomStore' },
	),
);
