import { describe, expect, it } from 'vitest';
import { calculateGroupBalances } from './group-balance';
import { createEmptyData } from '../../infrastructure/storage';
import { createGroup } from './group';
import { createParticipant } from './participant';
import { createExpense } from './expense';

function createFixture() {
  const data = createEmptyData();
  const group = createGroup('Viagem');

  const ana = createParticipant(group.id, 'Ana');
  const pedro = createParticipant(group.id, 'Pedro');

  data.groups.push(group);
  data.participants.push(ana, pedro);

  const result = createExpense({
    groupId: group.id,
    paidById: ana.id,
    description: 'Restaurante',
    amount: 10000,
    date: '2026-11-26',
    splitType: 'equal',
    participantIds: [ana.id, pedro.id],
  });

  data.expenses.push(result.expense);
  data.splits.push(...result.splits);

  return { data, group, ana, pedro };
}

describe('calculateGroupBalances', () => {
  it('should return empty balances for an empty group', () => {
    expect(
      calculateGroupBalances(createEmptyData(), 'unknown'),
    ).toEqual({});
  });

  it('should calculate balances from expenses', () => {
    const { data, group, ana, pedro } = createFixture();

    expect(calculateGroupBalances(data, group.id)).toEqual({
      [ana.id]: 5000,
      [pedro.id]: -5000,
    });
  });

  it('should account for completed settlements', () => {
    const { data, group, ana, pedro } = createFixture();

    data.settlements.push({
      id: 'settlement-1',
      groupId: group.id,
      fromParticipantId: pedro.id,
      toParticipantId: ana.id,
      amount: 5000,
      createdAt: new Date().toISOString(),
    });

    expect(calculateGroupBalances(data, group.id)).toEqual({
      [ana.id]: 0,
      [pedro.id]: 0,
    });
  });

  it('should account for partial settlements', () => {
    const { data, group, ana, pedro } = createFixture();

    data.settlements.push({
      id: 'settlement-1',
      groupId: group.id,
      fromParticipantId: pedro.id,
      toParticipantId: ana.id,
      amount: 2000,
      createdAt: new Date().toISOString(),
    });

    expect(calculateGroupBalances(data, group.id)).toEqual({
      [ana.id]: 3000,
      [pedro.id]: -3000,
    });
  });

  it('should ignore data from other groups', () => {
    const { data } = createFixture();

    expect(
      calculateGroupBalances(data, 'another-group'),
    ).toEqual({});
  });

  it('should return zero balances without expenses', () => {
    const { data, group, ana, pedro } = createFixture();

    data.expenses = [];
    data.splits = [];

    expect(calculateGroupBalances(data, group.id)).toEqual({
      [ana.id]: 0,
      [pedro.id]: 0,
    });
  });
});