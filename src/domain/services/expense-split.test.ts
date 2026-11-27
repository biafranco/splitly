
import { describe, it, expect } from 'vitest';
import { splitEqually } from './expense-split';

describe('splitEqually', () => {
  it('should split an expense between two participants', () => {
    expect(splitEqually(10000, ['a', 'b'])).toEqual([
      { participantId: 'a', amount: 5000 },
      { participantId: 'b', amount: 5000 },
    ]);
  });

  it('should distribute remaining cents', () => {
    expect(splitEqually(10000, ['a', 'b', 'c'])).toEqual([
      { participantId: 'a', amount: 3334 },
      { participantId: 'b', amount: 3333 },
      { participantId: 'c', amount: 3333 },
    ]);
  });

  it('should preserve the original total amount', () => {
    const splits = splitEqually(9999, ['a', 'b', 'c', 'd']);

    const total = splits.reduce(
      (sum, split) => sum + split.amount,
      0,
    );

    expect(total).toBe(9999);
  });

  it('should assign the full amount to a single participant', () => {
    expect(splitEqually(5000, ['a'])).toEqual([
      { participantId: 'a', amount: 5000 },
    ]);
  });

  it('should handle amounts smaller than participant count', () => {
    expect(splitEqually(2, ['a', 'b', 'c'])).toEqual([
      { participantId: 'a', amount: 1 },
      { participantId: 'b', amount: 1 },
      { participantId: 'c', amount: 0 },
    ]);
  });

  it('should reject an empty participant list', () => {
    expect(() => splitEqually(1000, [])).toThrow();
  });

  it('should reject duplicate participants', () => {
    expect(() => splitEqually(1000, ['a', 'a'])).toThrow();
  });

  it('should reject negative amounts', () => {
    expect(() => splitEqually(-1000, ['a'])).toThrow();
  });

  it('should reject zero amounts', () => {
    expect(() => splitEqually(0, ['a'])).toThrow();
  });

  it('should reject fractional cents', () => {
    expect(() => splitEqually(100.5, ['a'])).toThrow();
  });
});
