import { useState } from 'react';
import { loadData, saveData } from '../../infrastructure/storage';
import { calculateGroupBalances } from '../../domain/services/group-balance';
import { simplifyDebts } from '../../domain/services/settlement';
import type { Settlement } from '../../domain/entities/settlement';
import {
  createParticipant,
  updateParticipant,
  isDuplicateParticipant,
} from '../../domain/services/participant';
import {
  createExpense,
  updateExpense,
} from '../../domain/services/expense';
import type { CreateExpenseInput } from '../../domain/services/expense';

export function useGroupDetails(groupId: string) {
  const [data, setData] = useState(loadData);

  const group = data.groups.find((g) => g.id === groupId);

  const participants = data.participants.filter(
    (p) => p.groupId === groupId,
  );

  const expenses = data.expenses.filter(
    (e) => e.groupId === groupId,
  );

  function persist(next: typeof data) {
    saveData(next);
    setData(next);
  }

  function addParticipant(name: string) {
    if (!group) throw new Error('Grupo não encontrado');

    if (isDuplicateParticipant(participants, groupId, name)) {
      throw new Error('Participante já cadastrado');
    }

    persist({
      ...data,
      participants: [
        ...data.participants,
        createParticipant(groupId, name),
      ],
    });
  }

  function editParticipant(id: string, name: string) {
    if (isDuplicateParticipant(participants, groupId, name, id)) {
      throw new Error('Participante já cadastrado');
    }

    persist({
      ...data,
      participants: data.participants.map((p) =>
        p.id === id && p.groupId === groupId
          ? updateParticipant(p, name)
          : p,
      ),
    });
  }

  function removeParticipant(id: string) {
    const hasExpenses =
      data.expenses.some((e) => e.paidById === id) ||
      data.splits.some((s) => s.participantId === id);

    const hasSettlements = data.settlements.some(
      (s) =>
        s.fromParticipantId === id ||
        s.toParticipantId === id,
    );

    if (hasExpenses || hasSettlements) {
      throw new Error(
        'Este participante possui movimentações financeiras',
      );
    }

    persist({
      ...data,
      participants: data.participants.filter(
        (p) => !(p.id === id && p.groupId === groupId),
      ),
    });
  }

  function saveExpense(input: CreateExpenseInput, id?: string) {
    if (!group || input.groupId !== groupId) {
      throw new Error('Grupo inválido');
    }

    if (
      input.participantIds.some(
        (id) => !participants.some((p) => p.id === id),
      )
    ) {
      throw new Error('Participante inválido');
    }

    const existing = expenses.find((e) => e.id === id);

    if (id && !existing) {
      throw new Error('Despesa não encontrada');
    }

    const result = existing
      ? updateExpense(existing, input)
      : createExpense(input);

    persist({
      ...data,
      expenses: [
        ...data.expenses.filter((e) => e.id !== result.expense.id),
        result.expense,
      ],
      splits: [
        ...data.splits.filter(
          (s) => s.expenseId !== result.expense.id,
        ),
        ...result.splits,
      ],
    });
  }

  function removeExpense(id: string) {
    if (!expenses.some((e) => e.id === id)) return;

    persist({
      ...data,
      expenses: data.expenses.filter((e) => e.id !== id),
      splits: data.splits.filter((s) => s.expenseId !== id),
    });
  }

  const balances = calculateGroupBalances(data, groupId);

const suggestions = simplifyDebts(balances);

const settlements = data.settlements.filter(
  (s) => s.groupId === groupId,
);

function registerSettlement(
  fromParticipantId: string,
  toParticipantId: string,
  amount: number,
) {
  const valid = suggestions.some(
    (s) =>
      s.fromParticipantId === fromParticipantId &&
      s.toParticipantId === toParticipantId &&
      s.amount === amount,
  );

  if (!valid) {
    throw new Error('Pagamento inválido');
  }

  const settlement: Settlement = {
    id: crypto.randomUUID(),
    groupId,
    fromParticipantId,
    toParticipantId,
    amount,
    createdAt: new Date().toISOString(),
  };

  persist({
    ...data,
    settlements: [...data.settlements, settlement],
  });
}

function removeSettlement(id: string) {
  persist({
    ...data,
    settlements: data.settlements.filter(
      (s) => !(s.id === id && s.groupId === groupId),
    ),
  });
}
return {
  data,
  group,
  participants,
  expenses,
  balances,
  suggestions,
  settlements,
  addParticipant,
  editParticipant,
  removeParticipant,
  saveExpense,
  removeExpense,
  registerSettlement,
  removeSettlement,
};
}