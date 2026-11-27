
import { describe, it, expect } from 'vitest';
import {
  createParticipant,
  updateParticipant,
  isDuplicateParticipant,
} from './participant';

describe('createParticipant', () => {
  it('should create a participant', () => {
    const participant = createParticipant('group-1', 'Ana');

    expect(participant.name).toBe('Ana');
    expect(participant.id).toBeTruthy();
  });

  it('should associate the participant with a group', () => {
    expect(createParticipant('group-1', 'Ana').groupId)
      .toBe('group-1');
  });

  it('should trim the participant name', () => {
    expect(createParticipant('group-1', '  Ana  ').name)
      .toBe('Ana');
  });

  it('should reject empty names', () => {
    expect(() => createParticipant('group-1', ''))
      .toThrow();
  });

  it('should reject whitespace-only names', () => {
    expect(() => createParticipant('group-1', '   '))
      .toThrow();
  });

  it('should reject names longer than 100 characters', () => {
    expect(() =>
      createParticipant('group-1', 'a'.repeat(101)),
    ).toThrow();
  });

  it('should reject empty group identifiers', () => {
    expect(() => createParticipant('', 'Ana')).toThrow();
  });

  it('should generate unique identifiers', () => {
    expect(createParticipant('group-1', 'Ana').id)
      .not.toBe(createParticipant('group-1', 'Ana').id);
  });

  it('should initialize the creation date', () => {
    const participant = createParticipant('group-1', 'Ana');

    expect(participant.createdAt).toBeTruthy();
  });
});

describe('updateParticipant', () => {
  it('should update the participant name', () => {
    const participant = createParticipant('group-1', 'Ana');

    expect(updateParticipant(participant, 'Maria').name)
      .toBe('Maria');
  });

  it('should preserve participant information', () => {
    const participant = createParticipant('group-1', 'Ana');

    expect(updateParticipant(participant, 'Maria')).toEqual({
      ...participant,
      name: 'Maria',
    });
  });

  it('should reject invalid names', () => {
    const participant = createParticipant('group-1', 'Ana');

    expect(() => updateParticipant(participant, ' '))
      .toThrow();
  });

  it('should not modify the original participant', () => {
    const participant = createParticipant('group-1', 'Ana');

    updateParticipant(participant, 'Maria');

    expect(participant.name).toBe('Ana');
  });
});

describe('isDuplicateParticipant', () => {
  const participants = [
    createParticipant('group-1', 'Ana'),
    createParticipant('group-1', 'Pedro'),
  ];

  it('should identify duplicate names', () => {
    expect(
      isDuplicateParticipant(participants, 'group-1', 'Ana'),
    ).toBe(true);
  });

  it('should ignore case and surrounding whitespace', () => {
    expect(
      isDuplicateParticipant(participants, 'group-1', ' ANA '),
    ).toBe(true);
  });

  it('should accept different names', () => {
    expect(
      isDuplicateParticipant(participants, 'group-1', 'Maria'),
    ).toBe(false);
  });

  it('should allow identical names in different groups', () => {
    expect(
      isDuplicateParticipant(participants, 'group-2', 'Ana'),
    ).toBe(false);
  });

  it('should ignore the participant being updated', () => {
    expect(
      isDuplicateParticipant(
        participants,
        'group-1',
        'Ana',
        participants[0].id,
      ),
    ).toBe(false);
  });
});
