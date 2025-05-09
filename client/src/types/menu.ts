export interface Ingredient {
  name: string;
  cost: number;
  unit: string;
  category: string;
}

export interface MenuItem {
  id: string;
  name: string;
  category: string;
  sellingPrice: number;
  hasRecipe: boolean;
  buyingPrice?: number;
  ingredients?: Record<string, number>;
  description?: string; // Added for dish description
}

export interface MenuInterface {
  items: MenuItem[];
  initialIngredients: Record<string, Ingredient>;
  costMultiplier: number;
}

export interface MenusResponse {
  success: boolean;
  data: {
    izMenu: MenuInterface;
    bellFood: MenuInterface;
  };
}