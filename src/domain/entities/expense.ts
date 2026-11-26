export type SplitType = 'equal' | 'custom';

export interface Expense {
  id: string;
  groupId: string;
  paidById: string;
  description: string;
  amount: number;
  splitType: SplitType;
  date: string;
  createdAt: string;
  updatedAt: string;
}