
import type { Expense } from '../entities/expense';
import { splitCustom } from './expense-split';
import type { SplitResult } from './expense-split';

export type BalanceExpense = Pick<
  Expense,
  'paidById' | 'amount'
> & {
  splits: SplitResult[];
};

export type Balances = Record<string, number>;

export function calculateBalances(
  participantIds: string[],
  expenses: BalanceExpense[],
): Balances {
  const participants = new Set(participantIds);

  if (participants.size !== participantIds.length) {
    throw new Error('Duplicate participants are not allowed');
  }

  const balances: Balances = Object.fromEntries(
    participantIds.map((id) => [id, 0]),
  );

  for (const expense of expenses) {
    if (!participants.has(expense.paidById)) {
      throw new Error('Unknown expense payer');
    }

    const splits = splitCustom(
      expense.amount,
      expense.splits,
    );

    balances[expense.paidById] += expense.amount;

    for (const split of splits) {
      if (!participants.has(split.participantId)) {
        throw new Error('Unknown participant');
      }

      balances[split.participantId] -= split.amount;
    }
  }

  return balances;
}
