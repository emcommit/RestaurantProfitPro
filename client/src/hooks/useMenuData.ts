import { useQuery } from 'react-query';
import axios from 'axios';
import { useAppStore } from '../store';
import { MenusResponse } from '../types/menu';

const fetchMenus = async (): Promise<MenusResponse> => {
  const { data } = await axios.get('http://localhost:3000/api/menus');
  if (!data.success) throw new Error('Failed to fetch menus');
  return data;
};

const useMenuData = () => {
  const { selectedMenu } = useAppStore();
  const { data, error, isLoading } = useQuery('menus', fetchMenus, { 
    retry: 1,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // Cache data for 5 minutes
  });

  // Debug logs
  console.log('useMenuData - Selected Menu:', selectedMenu);
  console.log('useMenuData - API Data:', data);
  console.log('useMenuData - Error:', error);

  const menus = data?.data || {
    izMenu: { items: [], initialIngredients: {}, costMultiplier: 1 },
    bellFood: { items: [], initialIngredients: {}, costMultiplier: 1 },
  };
  const currentMenu = menus[selectedMenu] || { items: [], initialIngredients: {}, costMultiplier: 1 };

  return {
    menus,
    currentMenu,
    ingredientList: Object.entries(currentMenu.initialIngredients || {}).map(([name, { cost, unit, category }]) => ({
      name,
      cost,
      unit,
      category,
    })),
    isLoading,
    error: error ? (error as Error).message : null,
  };
};

export default useMenuData;