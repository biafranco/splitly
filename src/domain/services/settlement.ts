
import type { Balances } from './balance';
import type { Settlement } from '../entities/settlement';

export type SettlementSuggestion = Pick<
  Settlement,
  'fromParticipantId' | 'toParticipantId' | 'amount'
>;

export function simplifyDebts(
  balances: Balances,
): SettlementSuggestion[] {
  const entries = Object.entries(balances);

  if (entries.some(([, amount]) => !Number.isSafeInteger(amount))) {
    throw new Error('Invalid participant balance');
  }

  const total = entries.reduce(
    (sum, [, amount]) => sum + amount,
    0,
  );

  if (total !== 0) {
    throw new Error('Balances must sum to zero');
  }

  const creditors = entries
    .filter(([, amount]) => amount > 0)
    .map(([id, amount]) => ({ id, amount }))
    .sort((a, b) => b.amount - a.amount);

  const debtors = entries
    .filter(([, amount]) => amount < 0)
    .map(([id, amount]) => ({
      id,
      amount: Math.abs(amount),
    }))
    .sort((a, b) => b.amount - a.amount);

  const settlements: SettlementSuggestion[] = [];

  let creditorIndex = 0;
  let debtorIndex = 0;

  while (
    creditorIndex < creditors.length &&
    debtorIndex < debtors.length
  ) {
    const creditor = creditors[creditorIndex];
    const debtor = debtors[debtorIndex];

    const amount = Math.min(
      creditor.amount,
      debtor.amount,
    );

    settlements.push({
      fromParticipantId: debtor.id,
      toParticipantId: creditor.id,
      amount,
    });

    creditor.amount -= amount;
    debtor.amount -= amount;

    if (creditor.amount === 0) {
      creditorIndex++;
    }

    if (debtor.amount === 0) {
      debtorIndex++;
    }
  }

  return settlements;
}
