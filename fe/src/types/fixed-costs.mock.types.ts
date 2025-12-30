export type FixedCostListItem = {
  id: string;
  title: string;
  type: 'income' | 'expense';
  amount: number;
  displayCycle?: string;
  isActive: boolean;
};
