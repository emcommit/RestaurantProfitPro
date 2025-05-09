import create from 'zustand';

interface MenuInterface {
  items: any[];
  initialIngredients: Record<string, { cost: number; unit: string; category: string }>;
  costMultiplier: number;
}

interface AppState {
  menus: Record<string, MenuInterface>;
  selectedMenu: 'izMenu' | 'bellFood';
  setMenus: (menus: Record<string, MenuInterface>) => void;
  setSelectedMenu: (menu: 'izMenu' | 'bellFood') => void;
}

export const useAppStore = create<AppState>((set) => ({
  menus: {
    izMenu: { items: [], initialIngredients: {}, costMultiplier: 1 },
    bellFood: { items: [], initialIngredients: {}, costMultiplier: 1 }
  },
  selectedMenu: 'izMenu',
  setMenus: (menus) => set({ menus }),
  setSelectedMenu: (menu) => set({ selectedMenu: menu }),
}));