
import type { Group } from '../domain/entities/group';
import type { Participant } from '../domain/entities/participant';
import type { Expense } from '../domain/entities/expense';
import type { ExpenseSplit } from '../domain/entities/expense-split';
import type { Settlement } from '../domain/entities/settlement';

export interface AppData {
  groups: Group[];
  participants: Participant[];
  expenses: Expense[];
  splits: ExpenseSplit[];
  settlements: Settlement[];
}

const STORAGE_KEY = 'splitly:data';

export function createEmptyData(): AppData {
  return {
    groups: [],
    participants: [],
    expenses: [],
    splits: [],
    settlements: [],
  };
}

export function loadData(): AppData {
  const stored = localStorage.getItem(STORAGE_KEY);

  if (!stored) {
    return createEmptyData();
  }

  return JSON.parse(stored) as AppData;
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
