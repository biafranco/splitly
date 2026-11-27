
import { isValidAmount } from '../../utils/money';
import type { ExpenseSplit } from '../entities/expense-split';

export type SplitResult = Pick<
  ExpenseSplit,
  'participantId' | 'amount'
>;

export function splitEqually(
  amount: number,
  participantIds: string[],
): SplitResult[] {
  if (!isValidAmount(amount)) {
    throw new Error('Invalid expense amount');
  }

  if (participantIds.length === 0) {
    throw new Error('At least one participant is required');
  }

  if (new Set(participantIds).size !== participantIds.length) {
    throw new Error('Duplicate participants are not allowed');
  }

  const baseAmount = Math.floor(amount / participantIds.length);
  const remainder = amount % participantIds.length;

  return participantIds.map((participantId, index) => ({
    participantId,
    amount: baseAmount + (index < remainder ? 1 : 0),
  }));
}
