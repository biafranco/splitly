
import { describe, it, expect } from 'vitest';
import { createGroup, updateGroup } from './group';

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

describe('updateGroup', () => {
  it('should update the group name', () => {
    const group = createGroup('Trip');
    const updated = updateGroup(group, { name: 'Vacation' });

    expect(updated.name).toBe('Vacation');
  });

  it('should update the description', () => {
    const group = createGroup('Trip');

    const updated = updateGroup(group, {
      description: 'Summer vacation',
    });

    expect(updated.description).toBe('Summer vacation');
  });

  it('should preserve the group identifier', () => {
    const group = createGroup('Trip');

    expect(updateGroup(group, { name: 'Vacation' }).id)
      .toBe(group.id);
  });

  it('should preserve the creation date', () => {
    const group = createGroup('Trip');

    expect(updateGroup(group, { name: 'Vacation' }).createdAt)
      .toBe(group.createdAt);
  });

  it('should update the modification date', () => {
    const group = {
      ...createGroup('Trip'),
      updatedAt: '2020-01-01T00:00:00.000Z',
    };

    const updated = updateGroup(group, { name: 'Vacation' });

    expect(updated.updatedAt).not.toBe(group.updatedAt);
  });

  it('should reject empty names', () => {
    const group = createGroup('Trip');

    expect(() => updateGroup(group, { name: ' ' })).toThrow();
  });

  it('should reject names longer than 100 characters', () => {
    const group = createGroup('Trip');

    expect(() =>
      updateGroup(group, { name: 'a'.repeat(101) }),
    ).toThrow();
  });

  it('should remove an existing description', () => {
    const group = createGroup('Trip', 'Vacation');

    expect(updateGroup(group, { description: '' }).description)
      .toBeUndefined();
  });

  it('should preserve fields that were not updated', () => {
    const group = createGroup('Trip', 'Vacation');

    expect(updateGroup(group, { name: 'Travel' }).description)
      .toBe('Vacation');
  });

  it('should not modify the original group', () => {
    const group = createGroup('Trip');

    updateGroup(group, { name: 'Vacation' });

    expect(group.name).toBe('Trip');
  });
});
