export type EnergyDrink = {
  id: string;
  brand: string;
  line?: string | null;
  flavor?: string | null;
  volumeMl: number;
  expirationDate: string | null;
  price?: number | null;
  priceCurrency?: 'USD' | 'EUR' | 'RUB' | null;
  quantity: number;
  caffeineMg?: number | null;
  sugarGrams?: number | null;
  calories?: number | null;
  isSugarFree: boolean;
  countries?: string[] | null;
  imageUrl?: string | null;
  canFillState: 'Empty' | 'Full';
  createdAt: string;
  updatedAt: string;
  displayName: string;
};

export type CreateEnergyDrinkRequest = {
  brand: string;
  line?: string | null;
  flavor?: string | null;
  volumeMl: number;
  expirationDate: string | null;
  price?: number | null;
  priceCurrency?: 'USD' | 'EUR' | 'RUB' | null;
  quantity: number;
  caffeineMg?: number | null;
  sugarGrams?: number | null;
  calories?: number | null;
  isSugarFree: boolean;
  countries?: string[] | null;
  imageUrl?: string | null;
  canFillState: 'Empty' | 'Full';
};
