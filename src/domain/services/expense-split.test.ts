import { describe, it, expect } from 'vitest';
import { splitEqually, splitCustom } from './expense-split';

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

describe('splitCustom', () => {
  it('should accept different amounts per participant', () => {
    const splits = [
      { participantId: 'a', amount: 8000 },
      { participantId: 'b', amount: 5000 },
      { participantId: 'c', amount: 2000 },
    ];

    expect(splitCustom(15000, splits)).toEqual(splits);
  });

  it('should accept a single participant', () => {
    const splits = [{ participantId: 'a', amount: 1000 }];

    expect(splitCustom(1000, splits)).toEqual(splits);
  });

  it('should accept zero individual amounts', () => {
    const splits = [
      { participantId: 'a', amount: 1000 },
      { participantId: 'b', amount: 0 },
    ];

    expect(splitCustom(1000, splits)).toEqual(splits);
  });

  it('should reject amounts below the expense total', () => {
    expect(() =>
      splitCustom(1000, [
        { participantId: 'a', amount: 900 },
      ]),
    ).toThrow();
  });

  it('should reject amounts above the expense total', () => {
    expect(() =>
      splitCustom(1000, [
        { participantId: 'a', amount: 1100 },
      ]),
    ).toThrow();
  });

  it('should reject negative individual amounts', () => {
    expect(() =>
      splitCustom(1000, [
        { participantId: 'a', amount: 1100 },
        { participantId: 'b', amount: -100 },
      ]),
    ).toThrow();
  });

  it('should reject fractional cents', () => {
    expect(() =>
      splitCustom(1000, [
        { participantId: 'a', amount: 500.5 },
        { participantId: 'b', amount: 499.5 },
      ]),
    ).toThrow();
  });

  it('should reject duplicate participants', () => {
    expect(() =>
      splitCustom(1000, [
        { participantId: 'a', amount: 500 },
        { participantId: 'a', amount: 500 },
      ]),
    ).toThrow();
  });

  it('should reject empty splits', () => {
    expect(() => splitCustom(1000, [])).toThrow();
  });

  it('should reject invalid expense amounts', () => {
    expect(() =>
      splitCustom(0, [
        { participantId: 'a', amount: 0 },
      ]),
    ).toThrow();
  });

  it('should reject non-finite individual amounts', () => {
    expect(() =>
      splitCustom(1000, [
        { participantId: 'a', amount: NaN },
      ]),
    ).toThrow();
  });

  it('should return independent split objects', () => {
    const splits = [{ participantId: 'a', amount: 1000 }];
    const result = splitCustom(1000, splits);

    expect(result).not.toBe(splits);
    expect(result[0]).not.toBe(splits[0]);
  });
});
