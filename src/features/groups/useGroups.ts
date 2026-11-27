
import { useState } from 'react';
import { loadData, saveData } from '../../services/storage';
import {
  createGroup,
  updateGroup,
} from '../../domain/services/group';
import type { UpdateGroupInput } from '../../domain/services/group';

export function useGroups() {
  const [groups, setGroups] = useState(() => loadData().groups);

  function addGroup(name: string, description?: string) {
    const group = createGroup(name, description);
    const data = loadData();

    data.groups.push(group);

    saveData(data);
    setGroups(data.groups);

    return group;
  }

  function editGroup(id: string, input: UpdateGroupInput) {
    const data = loadData();
    const group = data.groups.find((item) => item.id === id);

    if (!group) {
      throw new Error('Group not found');
    }

    data.groups = data.groups.map((item) =>
      item.id === id ? updateGroup(item, input) : item,
    );

    saveData(data);
    setGroups(data.groups);
  }

  function deleteGroup(id: string) {
    const data = loadData();

    const expenseIds = new Set(
      data.expenses
        .filter((expense) => expense.groupId === id)
        .map((expense) => expense.id),
    );

    data.groups = data.groups.filter(
      (group) => group.id !== id,
    );

    data.participants = data.participants.filter(
      (participant) => participant.groupId !== id,
    );

    data.expenses = data.expenses.filter(
      (expense) => expense.groupId !== id,
    );

    data.splits = data.splits.filter(
      (split) => !expenseIds.has(split.expenseId),
    );

    data.settlements = data.settlements.filter(
      (settlement) => settlement.groupId !== id,
    );

    saveData(data);
    setGroups(data.groups);
  }

  return { groups, addGroup, editGroup, deleteGroup };
}
