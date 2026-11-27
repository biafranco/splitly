import { describe, it, expect } from 'vitest';
import { calculateBalances } from './balance';

describe('calculateBalances', () => {
  it('should initialize participants with zero balance', () => {
    expect(calculateBalances(['a', 'b'], [])).toEqual({
      a: 0,
      b: 0,
    });
  });

  it('should return empty balances without participants', () => {
    expect(calculateBalances([], [])).toEqual({});
  });

  it('should calculate balances for an equal expense', () => {
    expect(
      calculateBalances(['a', 'b'], [
        {
          paidById: 'a',
          amount: 10000,
          splits: [
            { participantId: 'a', amount: 5000 },
            { participantId: 'b', amount: 5000 },
          ],
        },
      ]),
    ).toEqual({ a: 5000, b: -5000 });
  });

  it('should calculate balances for custom splits', () => {
    expect(
      calculateBalances(['a', 'b', 'c'], [
        {
          paidById: 'a',
          amount: 15000,
          splits: [
            { participantId: 'a', amount: 8000 },
            { participantId: 'b', amount: 5000 },
            { participantId: 'c', amount: 2000 },
          ],
        },
      ]),
    ).toEqual({ a: 7000, b: -5000, c: -2000 });
  });

  it('should accumulate multiple expenses', () => {
    expect(
      calculateBalances(['a', 'b'], [
        {
          paidById: 'a',
          amount: 10000,
          splits: [
            { participantId: 'a', amount: 5000 },
            { participantId: 'b', amount: 5000 },
          ],
        },
        {
          paidById: 'b',
          amount: 4000,
          splits: [
            { participantId: 'a', amount: 2000 },
            { participantId: 'b', amount: 2000 },
          ],
        },
      ]),
    ).toEqual({ a: 3000, b: -3000 });
  });

  it('should handle expenses paid entirely for another participant', () => {
    expect(
      calculateBalances(['a', 'b'], [
        {
          paidById: 'a',
          amount: 1000,
          splits: [{ participantId: 'b', amount: 1000 }],
        },
      ]),
    ).toEqual({ a: 1000, b: -1000 });
  });

  it('should handle expenses paid entirely for oneself', () => {
    expect(
      calculateBalances(['a'], [
        {
          paidById: 'a',
          amount: 1000,
          splits: [{ participantId: 'a', amount: 1000 }],
        },
      ]),
    ).toEqual({ a: 0 });
  });

  it('should reject unknown payers', () => {
    expect(() =>
      calculateBalances(['a'], [
        {
          paidById: 'b',
          amount: 1000,
          splits: [{ participantId: 'a', amount: 1000 }],
        },
      ]),
    ).toThrow();
  });

  it('should reject unknown participants in splits', () => {
    expect(() =>
      calculateBalances(['a'], [
        {
          paidById: 'a',
          amount: 1000,
          splits: [{ participantId: 'b', amount: 1000 }],
        },
      ]),
    ).toThrow();
  });

  it('should reject inconsistent expense totals', () => {
    expect(() =>
      calculateBalances(['a'], [
        {
          paidById: 'a',
          amount: 1000,
          splits: [{ participantId: 'a', amount: 500 }],
        },
      ]),
    ).toThrow();
  });

  it('should reject duplicate participant IDs', () => {
    expect(() =>
      calculateBalances(['a', 'a'], []),
    ).toThrow();
  });
});
