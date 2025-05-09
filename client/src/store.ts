
import { create } from 'zustand';

interface AppStore {
  selectedMenu: 'izMenu' | 'bellFood';
  setSelectedMenu: (menu: 'izMenu' | 'bellFood') => void;
}

export const useAppStore = create<AppStore>((set) => ({
  selectedMenu: 'izMenu',
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));