
import { describe, it, expect } from 'vitest';
import { createExpense, updateExpense } from './expense';

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

describe('updateExpense', () => {
  it('should update the description', () => {
    const { expense } = createExpense(input);

    const result = updateExpense(expense, {
      ...input,
      description: 'Lunch',
    });

    expect(result.expense.description).toBe('Lunch');
  });

  it('should recalculate splits when amount changes', () => {
    const { expense } = createExpense(input);

    const result = updateExpense(expense, {
      ...input,
      amount: 20000,
    });

    expect(result.expense.amount).toBe(20000);
    expect(result.splits[0].amount).toBe(10000);
    expect(result.splits[1].amount).toBe(10000);
  });

  it('should preserve the expense identifier', () => {
    const { expense } = createExpense(input);

    const result = updateExpense(expense, input);

    expect(result.expense.id).toBe(expense.id);
  });

  it('should preserve the creation date', () => {
    const { expense } = createExpense(input);

    const result = updateExpense(expense, input);

    expect(result.expense.createdAt).toBe(expense.createdAt);
  });

  it('should update the modification date', () => {
    const { expense } = createExpense(input);

    expense.updatedAt = '2020-01-01T00:00:00.000Z';

    const result = updateExpense(expense, input);

    expect(result.expense.updatedAt).not.toBe(expense.updatedAt);
  });

  it('should preserve the expense identifier in splits', () => {
    const { expense } = createExpense(input);

    const result = updateExpense(expense, input);

    expect(result.splits.every(
      (split) => split.expenseId === expense.id,
    )).toBe(true);
  });

  it('should allow changing the payer', () => {
    const { expense } = createExpense(input);

    const result = updateExpense(expense, {
      ...input,
      paidById: 'b',
    });

    expect(result.expense.paidById).toBe('b');
  });

  it('should allow changing the split type', () => {
    const { expense } = createExpense(input);

    const result = updateExpense(expense, {
      ...input,
      splitType: 'custom',
      customSplits: [
        { participantId: 'a', amount: 7000 },
        { participantId: 'b', amount: 3000 },
      ],
    });

    expect(result.expense.splitType).toBe('custom');
    expect(result.splits[0].amount).toBe(7000);
  });

  it('should reject invalid updates', () => {
    const { expense } = createExpense(input);

    expect(() =>
      updateExpense(expense, {
        ...input,
        amount: -100,
      }),
    ).toThrow();
  });

  it('should reject changing the expense group', () => {
    const { expense } = createExpense(input);

    expect(() =>
      updateExpense(expense, {
        ...input,
        groupId: 'group-2',
      }),
    ).toThrow();
  });

  it('should not modify the original expense', () => {
    const { expense } = createExpense(input);

    updateExpense(expense, {
      ...input,
      description: 'Lunch',
    });

    expect(expense.description).toBe('Dinner');
  });
});
