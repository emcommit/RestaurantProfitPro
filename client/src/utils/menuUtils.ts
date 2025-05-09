export const calculateRecipeCost = (
  ingredients: Record<string, number>,
  ingredientList: { name: string; cost: number; unit: string; category: string }[],
  costMultiplier: number
): number => {
  return Object.entries(ingredients).reduce((total, [name, quantity]) => {
    const ingredient = ingredientList.find(ing => ing.name === name);
    if (!ingredient) return total;
    let costPerBaseUnit = ingredient.cost;
    if (ingredient.unit === 'kg' || ingredient.unit === 'L') {
      costPerBaseUnit = ingredient.cost / 1000; // Convert to g or ml
    }
    return total + (quantity * costPerBaseUnit * costMultiplier);
  }, 0);
};

export const calculateProfitMargin = (
  sellingPrice: number,
  cost: number
): string => {
  if (sellingPrice <= 0) return '0.00';
  return (((sellingPrice - cost) / sellingPrice) * 100).toFixed(2);
};

export const getProfitMarginColor = (profitMargin: number): string => {
  if (profitMargin < 60) return 'bg-red-500';
  if (profitMargin <= 70) return 'bg-orange-500';
  if (profitMargin <= 80) return 'bg-yellow-500';
  return 'bg-green-500';
};