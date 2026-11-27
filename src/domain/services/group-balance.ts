import { calculateBalances } from './balance';
import type { AppData } from '../../infrastructure/storage';

export function calculateGroupBalances(
  data: AppData,
  groupId: string,
) {
  const participants = data.participants.filter(
    (p) => p.groupId === groupId,
  );

  const expenses = data.expenses
    .filter((e) => e.groupId === groupId)
    .map((expense) => ({
      ...expense,
      splits: data.splits.filter(
        (s) => s.expenseId === expense.id,
      ),
    }));

  const balances = calculateBalances(
    participants.map((p) => p.id),
    expenses,
  );

  const settlements = data.settlements.filter(
    (s) => s.groupId === groupId,
  );

  for (const settlement of settlements) {
    balances[settlement.fromParticipantId] += settlement.amount;
    balances[settlement.toParticipantId] -= settlement.amount;
  }

  return balances;
}