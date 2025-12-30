import { create, StoreApi, UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';

export type UserStoreType = {
	id: string | null;
	setId: () => void;
};

export const UserStore: UseBoundStore<StoreApi<UserStoreType>> = create<UserStoreType>()(
	persist<UserStoreType>(
		(set): UserStoreType => ({
			id: null,
			setId: (): void => set({ id: crypto.randomUUID() }),
		}),
		// PERSISTANCE CONFIGURATION
		{ name: 'userStore' },
	),
);
