
import type { Expense, SplitType } from '../entities/expense';
import type { ExpenseSplit } from '../entities/expense-split';
import { isValidAmount } from '../../utils/money';
import { splitEqually, splitCustom } from './expense-split';
import type { SplitResult } from './expense-split';

export interface CreateExpenseInput {
  groupId: string;
  paidById: string;
  description: string;
  amount: number;
  date: string;
  splitType: SplitType;
  participantIds: string[];
  customSplits?: SplitResult[];
}

export interface ExpenseResult {
  expense: Expense;
  splits: ExpenseSplit[];
}

export function createExpense(
  input: CreateExpenseInput,
): ExpenseResult {
  const description = input.description.trim();

  if (!input.groupId.trim()) {
    throw new Error('Group identifier is required');
  }

  if (!description) {
    throw new Error('Expense description is required');
  }

  if (!isValidAmount(input.amount)) {
    throw new Error('Invalid expense amount');
  }

  if (!input.participantIds.includes(input.paidById)) {
    throw new Error('Unknown expense payer');
  }

  if (!Number.isFinite(Date.parse(input.date))) {
    throw new Error('Invalid expense date');
  }

  const calculatedSplits =
    input.splitType === 'equal'
      ? splitEqually(input.amount, input.participantIds)
      : splitCustom(input.amount, input.customSplits ?? []);

  if (
    calculatedSplits.some(
      (split) =>
        !input.participantIds.includes(split.participantId),
    )
  ) {
    throw new Error('Unknown participant');
  }

  const now = new Date().toISOString();

  const expense: Expense = {
    id: crypto.randomUUID(),
    groupId: input.groupId,
    paidById: input.paidById,
    description,
    amount: input.amount,
    splitType: input.splitType,
    date: input.date,
    createdAt: now,
    updatedAt: now,
  };

  const splits: ExpenseSplit[] = calculatedSplits.map(
    (split) => ({
      id: crypto.randomUUID(),
      expenseId: expense.id,
      participantId: split.participantId,
      amount: split.amount,
    }),
  );

  return { expense, splits };
}

export function updateExpense(
  expense: Expense,
  input: CreateExpenseInput,
): ExpenseResult {
  if (input.groupId !== expense.groupId) {
    throw new Error('Expense group cannot be changed');
  }

  const result = createExpense(input);

  return {
    expense: {
      ...result.expense,
      id: expense.id,
      createdAt: expense.createdAt,
    },
    splits: result.splits.map((split) => ({
      ...split,
      expenseId: expense.id,
    })),
  };
}
