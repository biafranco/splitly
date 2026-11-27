
import { describe, it, expect } from 'vitest';
import { createExpense } from './expense';

const input = {
  groupId: 'group-1',
  paidById: 'a',
  description: 'Dinner',
  amount: 10000,
  date: '2026-11-26',
  splitType: 'equal' as const,
  participantIds: ['a', 'b'],
};

describe('createExpense', () => {
  it('should create an expense', () => {
    const { expense } = createExpense(input);

    expect(expense.description).toBe('Dinner');
    expect(expense.amount).toBe(10000);
    expect(expense.id).toBeTruthy();
  });

  it('should associate the expense with its group', () => {
    expect(createExpense(input).expense.groupId)
      .toBe('group-1');
  });

  it('should identify the payer', () => {
    expect(createExpense(input).expense.paidById)
      .toBe('a');
  });

  it('should create equal splits', () => {
    const { splits } = createExpense(input);

    expect(splits).toHaveLength(2);
    expect(splits[0].amount).toBe(5000);
    expect(splits[1].amount).toBe(5000);
  });

  it('should create custom splits', () => {
    const { splits } = createExpense({
      ...input,
      splitType: 'custom',
      customSplits: [
        { participantId: 'a', amount: 7000 },
        { participantId: 'b', amount: 3000 },
      ],
    });

    expect(splits[0].amount).toBe(7000);
    expect(splits[1].amount).toBe(3000);
  });

  it('should associate splits with the expense', () => {
    const { expense, splits } = createExpense(input);

    expect(splits.every(
      (split) => split.expenseId === expense.id,
    )).toBe(true);
  });

  it('should reject empty descriptions', () => {
    expect(() =>
      createExpense({ ...input, description: ' ' }),
    ).toThrow();
  });

  it('should reject invalid amounts', () => {
    expect(() =>
      createExpense({ ...input, amount: -100 }),
    ).toThrow();
  });

  it('should reject unknown payers', () => {
    expect(() =>
      createExpense({ ...input, paidById: 'unknown' }),
    ).toThrow();
  });

  it('should reject invalid dates', () => {
    expect(() =>
      createExpense({ ...input, date: 'invalid' }),
    ).toThrow();
  });

  it('should reject empty group identifiers', () => {
    expect(() =>
      createExpense({ ...input, groupId: '' }),
    ).toThrow();
  });

  it('should reject custom splits with unknown participants', () => {
    expect(() =>
      createExpense({
        ...input,
        splitType: 'custom',
        customSplits: [
          { participantId: 'unknown', amount: 10000 },
        ],
      }),
    ).toThrow();
  });

  it('should reject missing custom splits', () => {
    expect(() =>
      createExpense({ ...input, splitType: 'custom' }),
    ).toThrow();
  });

  it('should initialize expense timestamps', () => {
    const { expense } = createExpense(input);

    expect(expense.createdAt).toBeTruthy();
    expect(expense.updatedAt).toBe(expense.createdAt);
  });

  it('should trim the description', () => {
    const { expense } = createExpense({
      ...input,
      description: '  Dinner  ',
    });

    expect(expense.description).toBe('Dinner');
  });
});
