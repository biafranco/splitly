import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Participant } from '../../domain/entities/participant';
import type { Expense, SplitType } from '../../domain/entities/expense';
import type { ExpenseSplit } from '../../domain/entities/expense-split';
import type { CreateExpenseInput } from '../../domain/services/expense';
import { toCents, fromCents } from '../../utils/money';

interface Props {
  groupId: string;
  participants: Participant[];
  expense?: Expense;
  splits: ExpenseSplit[];
  onSave: (input: CreateExpenseInput) => void;
  onClose: () => void;
}

export function ExpenseForm({
  groupId,
  participants,
  expense,
  splits,
  onSave,
  onClose,
}: Props) {
  const [description, setDescription] = useState(
    expense?.description ?? '',
  );

  const [amount, setAmount] = useState(
    expense ? String(fromCents(expense.amount)) : '',
  );

  const [paidById, setPaidById] = useState(
    expense?.paidById ?? participants[0]?.id ?? '',
  );

  const [date, setDate] = useState(
    expense?.date ?? new Date().toISOString().slice(0, 10),
  );

  const [splitType, setSplitType] = useState<SplitType>(
    expense?.splitType ?? 'equal',
  );

  const [custom, setCustom] = useState<Record<string, string>>(
    Object.fromEntries(
      splits.map((s) => [
        s.participantId,
        String(fromCents(s.amount)),
      ]),
    ),
  );

  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      onSave({
        groupId,
        description,
        amount: toCents(Number(amount)),
        paidById,
        date,
        splitType,
        participantIds: participants.map((p) => p.id),
        customSplits:
          splitType === 'custom'
            ? participants.map((p) => ({
                participantId: p.id,
                amount: toCents(Number(custom[p.id] || 0)),
              }))
            : undefined,
      });

      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    }
  }

  const field =
    'mt-1 w-full rounded-lg border border-slate-200 px-3 py-2';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Formulário de despesa"
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6"
      >
        <h2 className="mb-5 text-xl font-bold">
          {expense ? 'Editar despesa' : 'Nova despesa'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="block text-sm font-medium">
            Descrição
            <input
              className={field}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Valor (R$)
            <input
              className={field}
              type="number"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Pago por
            <select
              className={field}
              value={paidById}
              onChange={(e) => setPaidById(e.target.value)}
              required
            >
              {participants.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-medium">
            Data
            <input
              className={field}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </label>

          <label className="block text-sm font-medium">
            Tipo de divisão
            <select
              className={field}
              value={splitType}
              onChange={(e) =>
                setSplitType(e.target.value as SplitType)
              }
            >
              <option value="equal">Igualitária</option>
              <option value="custom">Personalizada</option>
            </select>
          </label>

          {splitType === 'custom' && (
            <div className="space-y-3 rounded-xl bg-slate-50 p-4">
              {participants.map((p) => (
                <label key={p.id} className="block text-sm">
                  {p.name}
                  <input
                    className={field}
                    type="number"
                    min="0"
                    step="0.01"
                    value={custom[p.id] ?? ''}
                    onChange={(e) =>
                      setCustom({
                        ...custom,
                        [p.id]: e.target.value,
                      })
                    }
                  />
                </label>
              ))}
            </div>
          )}

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-4 py-2 text-white"
            >
              Salvar despesa
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}