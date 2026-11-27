
import { describe, it, expect } from 'vitest';
import { toCents, fromCents, isValidAmount } from './money';

describe('toCents', () => {
  it('should convert reais to cents', () => {
    expect(toCents(10)).toBe(1000);
  });

  it('should convert decimal values', () => {
    expect(toCents(10.99)).toBe(1099);
  });

  it('should round floating point values', () => {
    expect(toCents(0.1 + 0.2)).toBe(30);
  });

  it('should convert zero', () => {
    expect(toCents(0)).toBe(0);
  });
});

describe('fromCents', () => {
  it('should convert cents to reais', () => {
    expect(fromCents(1000)).toBe(10);
  });

  it('should convert fractional amounts', () => {
    expect(fromCents(1099)).toBe(10.99);
  });

  it('should convert zero', () => {
    expect(fromCents(0)).toBe(0);
  });
});

describe('isValidAmount', () => {
  it('should accept positive integer amounts', () => {
    expect(isValidAmount(1000)).toBe(true);
  });

  it('should reject negative amounts', () => {
    expect(isValidAmount(-100)).toBe(false);
  });

  it('should reject zero', () => {
    expect(isValidAmount(0)).toBe(false);
  });

  it('should reject fractional cents', () => {
    expect(isValidAmount(10.5)).toBe(false);
  });

  it('should reject NaN', () => {
    expect(isValidAmount(NaN)).toBe(false);
  });

  it('should reject Infinity', () => {
    expect(isValidAmount(Infinity)).toBe(false);
  });

  it('should reject unsafe integers', () => {
    expect(isValidAmount(Number.MAX_SAFE_INTEGER + 1)).toBe(false);
  });
});
