
import { describe, it, expect } from 'vitest';
import { simplifyDebts } from './settlement';

describe('simplifyDebts', () => {
  it('should return no settlements for empty balances', () => {
    expect(simplifyDebts({})).toEqual([]);
  });

  it('should return no settlements for zero balances', () => {
    expect(simplifyDebts({ a: 0, b: 0 })).toEqual([]);
  });

  it('should settle a single debt', () => {
    expect(simplifyDebts({ a: 5000, b: -5000 })).toEqual([
      {
        fromParticipantId: 'b',
        toParticipantId: 'a',
        amount: 5000,
      },
    ]);
  });

  it('should handle multiple debtors', () => {
    expect(
      simplifyDebts({ a: 10000, b: -6000, c: -4000 }),
    ).toEqual([
      {
        fromParticipantId: 'b',
        toParticipantId: 'a',
        amount: 6000,
      },
      {
        fromParticipantId: 'c',
        toParticipantId: 'a',
        amount: 4000,
      },
    ]);
  });

  it('should handle multiple creditors', () => {
    expect(
      simplifyDebts({ a: 6000, b: 4000, c: -10000 }),
    ).toEqual([
      {
        fromParticipantId: 'c',
        toParticipantId: 'a',
        amount: 6000,
      },
      {
        fromParticipantId: 'c',
        toParticipantId: 'b',
        amount: 4000,
      },
    ]);
  });

  it('should ignore participants with zero balance', () => {
    expect(
      simplifyDebts({ a: 1000, b: -1000, c: 0 }),
    ).toHaveLength(1);
  });

  it('should reject unbalanced totals', () => {
    expect(() =>
      simplifyDebts({ a: 1000, b: -500 }),
    ).toThrow();
  });

  it('should reject fractional balances', () => {
    expect(() =>
      simplifyDebts({ a: 10.5, b: -10.5 }),
    ).toThrow();
  });

  it('should reject non-finite balances', () => {
    expect(() =>
      simplifyDebts({ a: Infinity, b: -Infinity }),
    ).toThrow();
  });

  it('should not modify original balances', () => {
    const balances = { a: 1000, b: -1000 };

    simplifyDebts(balances);

    expect(balances).toEqual({ a: 1000, b: -1000 });
  });

  it('should settle all outstanding balances', () => {
    const balances = {
      a: 7000,
      b: 3000,
      c: -4000,
      d: -6000,
    };

    const result = simplifyDebts(balances);
    const remaining: Record<string, number> = {
      ...balances,
    };

    for (const settlement of result) {
      remaining[settlement.fromParticipantId] +=
        settlement.amount;

      remaining[settlement.toParticipantId] -=
        settlement.amount;
    }

    expect(Object.values(remaining)).toEqual([0, 0, 0, 0]);
  });
});
