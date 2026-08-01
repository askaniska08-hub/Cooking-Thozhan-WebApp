import type { Ingredient, IngredientCategory } from '@/types';

export const CATEGORY_META: {
  key: IngredientCategory;
  label: string;
  emoji: string;
}[] = [
  { key: 'Vegetables', label: 'Vegetables', emoji: '🥕' },
  { key: 'Herbs & Flavourings', label: 'Herbs & Flavourings', emoji: '🌿' },
  { key: 'Essentials & Staples', label: 'Essentials & Staples', emoji: '🍚' },
  { key: 'Dal Varieties', label: 'Dal Varieties', emoji: '🫘' },
  { key: 'Fruits & Nuts', label: 'Fruits & Nuts', emoji: '🍎' },
  { key: 'Dairy', label: 'Dairy', emoji: '🥛' },
  { key: 'Eggs', label: 'Eggs', emoji: '🥚' },
];

export const INGREDIENTS: Ingredient[] = [
  // 🥕 Vegetables
  { name: 'Tomato', emoji: '🍅', category: 'Vegetables' },
  { name: 'Potato', emoji: '🥔', category: 'Vegetables' },
  { name: 'Onion', emoji: '🧅', category: 'Vegetables' },
  { name: 'Carrot', emoji: '🥕', category: 'Vegetables' },
  { name: 'Beans', emoji: '🫛', category: 'Vegetables' },
  { name: 'Ginger', emoji: '🫚', category: 'Vegetables' },
  { name: 'Garlic', emoji: '🧄', category: 'Vegetables' },
  { name: 'Green Chilli', emoji: '🌶️', category: 'Vegetables' },
  { name: 'Cabbage', emoji: '🥬', category: 'Vegetables' },
  { name: 'Capsicum', emoji: '🫑', category: 'Vegetables' },
  { name: 'Cauliflower', emoji: '🥦', category: 'Vegetables' },
  { name: 'Mushroom', emoji: '🍄', category: 'Vegetables' },
  { name: 'Spinach', emoji: '🥬', category: 'Vegetables' },
  { name: 'Brinjal', emoji: '🍆', category: 'Vegetables' },
  { name: 'Ladies Finger', emoji: '🥬', category: 'Vegetables' },
  { name: 'Coconut', emoji: '🥥', category: 'Vegetables' },
  { name: 'Lemon', emoji: '🍋', category: 'Vegetables' },
  { name: 'Pumpkin', emoji: '🎃', category: 'Vegetables' },
  { name: 'Beetroot', emoji: '🟣', category: 'Vegetables' },
  { name: 'Dried Red Chilli', emoji: '🌶️', category: 'Vegetables' },
  { name: 'Drumstick', emoji: '🥬', category: 'Vegetables' },
  { name: 'Peas', emoji: '🫛', category: 'Vegetables' },
  { name: 'Corn', emoji: '🌽', category: 'Vegetables' },
  { name: 'Cucumber', emoji: '🥒', category: 'Vegetables' },

  // 🌿 Herbs & Flavourings
  { name: 'Curry Leaves', emoji: '🌿', category: 'Herbs & Flavourings' },
  { name: 'Coriander Leaves', emoji: '🌿', category: 'Herbs & Flavourings' },
  { name: 'Mint Leaves', emoji: '🌿', category: 'Herbs & Flavourings' },
  { name: 'Tamarind', emoji: '🟤', category: 'Herbs & Flavourings' },
  { name: 'Mustard Seeds', emoji: '🟤', category: 'Herbs & Flavourings' },
  { name: 'Salt', emoji: '🧂', category: 'Herbs & Flavourings' },
  { name: 'Black Pepper', emoji: '⚫', category: 'Herbs & Flavourings' },
  { name: 'Turmeric', emoji: '🟡', category: 'Herbs & Flavourings' },
  { name: 'Pepper Powder', emoji: '⚫', category: 'Herbs & Flavourings' },
  { name: 'Red Chilli Powder', emoji: '🌶️', category: 'Herbs & Flavourings' },
  { name: 'Cumin Powder', emoji: '🟤', category: 'Herbs & Flavourings' },
  { name: 'Coriander Powder', emoji: '🟤', category: 'Herbs & Flavourings' },
  { name: 'Garam Masala', emoji: '🟤', category: 'Herbs & Flavourings' },
  { name: 'Sambar Powder', emoji: '🟤', category: 'Herbs & Flavourings' },
  { name: 'Curry Masala', emoji: '🟤', category: 'Herbs & Flavourings' },
  { name: 'Cardamom Powder', emoji: '🫛', category: 'Herbs & Flavourings' },
  { name: 'Saffron', emoji: '🌼', category: 'Herbs & Flavourings' },
  { name: 'Rose Essence', emoji: '🌹', category: 'Herbs & Flavourings' },
  { name: 'Idli Podi', emoji: '🌶️', category: 'Herbs & Flavourings' },
  { name: 'Cornstarch', emoji: '🌽', category: 'Herbs & Flavourings' },
  { name: 'Cocoa Powder', emoji: '🍫', category: 'Herbs & Flavourings' },

  // 🍚 Essentials & Staples
  { name: 'Rice', emoji: '🍚', category: 'Essentials & Staples' },
  { name: 'Wheat Flour', emoji: '🌾', category: 'Essentials & Staples' },
  { name: 'Maida', emoji: '🌾', category: 'Essentials & Staples' },
  { name: 'Cooking Oil', emoji: '🫒', category: 'Essentials & Staples' },
  { name: 'White Sugar', emoji: '🟫', category: 'Essentials & Staples' },
  { name: 'Jaggery', emoji: '🟫', category: 'Essentials & Staples' },
  { name: 'Tea Powder', emoji: '🍃', category: 'Essentials & Staples' },
  { name: 'Coffee Powder', emoji: '☕', category: 'Essentials & Staples' },
  { name: 'Rava', emoji: '🟡', category: 'Essentials & Staples' },
  { name: 'Besan', emoji: '🟡', category: 'Essentials & Staples' },
  { name: 'Poha', emoji: '🟡', category: 'Essentials & Staples' },
  { name: 'Vermicelli', emoji: '🍝', category: 'Essentials & Staples' },
  { name: 'Bread', emoji: '🍞', category: 'Essentials & Staples' },
  { name: 'Pasta', emoji: '🍝', category: 'Essentials & Staples' },
  { name: 'Noodles', emoji: '🍜', category: 'Essentials & Staples' },
  { name: 'Batter', emoji: '⚪', category: 'Essentials & Staples' },
  { name: 'Rice Flour', emoji: '🍚', category: 'Essentials & Staples' },
  { name: 'Baking Powder', emoji: '🧁', category: 'Essentials & Staples' },
  { name: 'Sesame Oil', emoji: '🫒', category: 'Essentials & Staples' },
  { name: 'Vinegar', emoji: '🍶', category: 'Essentials & Staples' },

  // 🫘 Dal Varieties
  { name: 'Toor Dal (Thuvaram Paruppu)', emoji: '🟡', category: 'Dal Varieties' },
  { name: 'Urad Dal (Ulundham Paruppu)', emoji: '⚪', category: 'Dal Varieties' },
  { name: 'Bengal Gram (Kadalai Paruppu)', emoji: '🟡', category: 'Dal Varieties' },
  { name: 'Moong Dal (Paasi Paruppu)', emoji: '🟡', category: 'Dal Varieties' },
  { name: 'Channa', emoji: '🟡', category: 'Dal Varieties' },

  // 🍎 Fruits & Nuts
  { name: 'Mango', emoji: '🥭', category: 'Fruits & Nuts' },
  { name: 'Banana', emoji: '🍌', category: 'Fruits & Nuts' },
  { name: 'Almonds', emoji: '🌰', category: 'Fruits & Nuts' },
  { name: 'Cashew', emoji: '🥜', category: 'Fruits & Nuts' },
  { name: 'Peanuts', emoji: '🥜', category: 'Fruits & Nuts' },
  { name: 'Raisins', emoji: '🍇', category: 'Fruits & Nuts' },
  { name: 'Oats', emoji: '🥣', category: 'Fruits & Nuts' },

  // 🥛 Dairy
  { name: 'Milk', emoji: '🥛', category: 'Dairy' },
  { name: 'Ghee', emoji: '🧈', category: 'Dairy' },
  { name: 'Curd', emoji: '🥛', category: 'Dairy' },
  { name: 'Butter', emoji: '🧈', category: 'Dairy' },
  { name: 'Paneer', emoji: '🧀', category: 'Dairy' },
  { name: 'Cheese', emoji: '🧀', category: 'Dairy' },

  // 🥚 Eggs
  { name: 'Egg', emoji: '🥚', category: 'Eggs' },
];

export const PANTRY_STAPLES = new Set([
  'Salt',
  'Cooking Oil',
  'Water',
  'Turmeric',
  'Mustard Seeds',
  'Curry Leaves',
]);

export const PANTRY_OPTIONAL = new Set(['Ghee']);
