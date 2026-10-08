export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'high tea';

export type MealCounts = {
  [key in MealType]: number;
};

export type SelectedItemsMap = {
  [key in MealType]: string[];
};

export type MealSelectionOption = {
  key: MealType;
  label: string;
  items: string[];
};

export interface DateSelection {
  mealCounts: MealCounts;
  selectedItems: SelectedItemsMap;
}

export interface Selection {
  clientName: string;
  dates: Date[];
  dateSelections: { [dateStr: string]: DateSelection };
  currentDate: string | null;
}

export interface GlossaryItem {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  unit: string;
  sellerId?: string | null;
}

export interface CartItem {
  item: GlossaryItem;
  quantity: number;
}

export interface CustomerDetails {
  name: string;
  phone: string;
  address: string;
}