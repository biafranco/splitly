
import { describe, it, expect } from 'vitest';
import { createGroup } from './group';

describe('createGroup', () => {
  it('should create a group with a valid name', () => {
    const group = createGroup('Trip');

    expect(group.name).toBe('Trip');
    expect(group.id).toBeTruthy();
  });

  it('should create a group with a description', () => {
    const group = createGroup('Trip', 'Summer vacation');

    expect(group.description).toBe('Summer vacation');
  });

  it('should trim the group name', () => {
    expect(createGroup('  Trip  ').name).toBe('Trip');
  });

  it('should reject empty names', () => {
    expect(() => createGroup('')).toThrow();
  });

  it('should reject whitespace-only names', () => {
    expect(() => createGroup('   ')).toThrow();
  });

  it('should reject names longer than 100 characters', () => {
    expect(() => createGroup('a'.repeat(101))).toThrow();
  });

  it('should generate unique identifiers', () => {
    expect(createGroup('Trip').id).not.toBe(
      createGroup('Trip').id,
    );
  });

  it('should initialize creation and update dates', () => {
    const group = createGroup('Trip');

    expect(group.createdAt).toBeTruthy();
    expect(group.updatedAt).toBe(group.createdAt);
  });

  it('should trim the description', () => {
    const group = createGroup('Trip', '  Vacation  ');

    expect(group.description).toBe('Vacation');
  });

  it('should allow groups without descriptions', () => {
    expect(createGroup('Trip').description).toBeUndefined();
  });
});
