
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

export function splitCustom(
  amount: number,
  splits: SplitResult[],
): SplitResult[] {
  if (!isValidAmount(amount)) {
    throw new Error('Invalid expense amount');
  }

  if (splits.length === 0) {
    throw new Error('At least one participant is required');
  }

  const participantIds = splits.map(
    (split) => split.participantId,
  );

  if (new Set(participantIds).size !== participantIds.length) {
    throw new Error('Duplicate participants are not allowed');
  }

  for (const split of splits) {
    if (!Number.isSafeInteger(split.amount) || split.amount < 0) {
      throw new Error('Invalid individual split amount');
    }
  }

  const total = splits.reduce(
    (sum, split) => sum + split.amount,
    0,
  );

  if (total !== amount) {
    throw new Error('Split amounts must match the expense total');
  }

  return splits.map((split) => ({ ...split }));
}
