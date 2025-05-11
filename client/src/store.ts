import { create } from 'zustand';

interface MenuItem {
  id: number;
  name: string;
  price: number;
  hasRecipe?: boolean;
}

interface MenuData {
  items: MenuItem[];
  initialIngredients: Record<string, any>;
  costMultiplier: number;
}

interface AppState {
  menus: Record<string, MenuData>;
  selectedMenu: string;
  setMenus: (menus: Record<string, MenuData>) => void;
  setSelectedMenu: (menu: string) => void;
  clearStore: () => void;
}

export const useAppStore = create<AppState>((set) => ({
  menus: {},
  selectedMenu: 'izMenu',
  setMenus: (menus) => set({ menus }),
  setSelectedMenu: (selectedMenu) => set({ selectedMenu }),
  clearStore: () => set({ menus: {}, selectedMenu: 'izMenu' })
}));