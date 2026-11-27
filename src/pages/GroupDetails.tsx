import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Plus, Pencil, Trash2 } from 'lucide-react';
import { useGroupDetails } from '../features/groups/useGroupDetails';
import { ExpenseForm } from '../features/expenses/ExpenseForm';
import { formatMoney } from '../utils/money';
import type { Expense } from '../domain/entities/expense';

export function GroupDetails() {
  const { id = '' } = useParams();

  const {
    data,
    group,
    participants,
    expenses,
    addParticipant,
    editParticipant,
    removeParticipant,
    saveExpense,
    removeExpense,
  } = useGroupDetails(id);

  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [editingId, setEditingId] = useState<string>();
  const [expenseOpen, setExpenseOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState<Expense>();

  function execute(action: () => void) {
    try {
      action();
      setError('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    }
  }

  if (!group) {
    return <p>Grupo não encontrado.</p>;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <Link
        to="/groups"
        className="flex items-center gap-2 text-sm text-slate-500"
      >
        <ArrowLeft size={18} />
        Voltar para grupos
      </Link>

      <header>
        <h2 className="text-3xl font-bold">{group.name}</h2>
        <p className="mt-2 text-slate-500">{group.description}</p>
      </header>

      <section className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: 'Total de despesas',
            value: formatMoney(
              expenses.reduce((sum, e) => sum + e.amount, 0),
            ),
          },
          {
            label: 'Participantes',
            value: participants.length,
          },
          {
            label: 'Despesas registradas',
            value: expenses.length,
          },
        ].map((item) => (
          <article
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <p className="text-sm text-slate-500">{item.label}</p>
            <p className="mt-2 text-2xl font-bold">{item.value}</p>
          </article>
        ))}
      </section>

      {error && (
        <p role="alert" className="rounded-lg bg-red-50 p-4 text-red-600">
          {error}
        </p>
      )}

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-5 text-xl font-semibold">Participantes</h3>

        <form
          className="mb-5 flex flex-wrap gap-3"
          onSubmit={(event) => {
            event.preventDefault();

            execute(() => {
              if (editingId) {
                editParticipant(editingId, name);
              } else {
                addParticipant(name);
              }

              setName('');
              setEditingId(undefined);
            });
          }}
        >
          <input
            aria-label="Nome do participante"
            placeholder="Nome do participante"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="min-w-0 flex-1 rounded-lg border border-slate-200 px-4 py-2"
          />

          <button className="rounded-lg bg-primary-600 px-4 py-2 text-white">
            {editingId ? 'Salvar participante' : 'Adicionar participante'}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={() => {
                setEditingId(undefined);
                setName('');
              }}
            >
              Cancelar
            </button>
          )}
        </form>

        {participants.length === 0 && (
          <p className="text-sm text-slate-500">
            Nenhum participante cadastrado.
          </p>
        )}

        {participants.map((p) => (
          <div
            key={p.id}
            className="flex items-center justify-between border-b border-slate-100 py-3"
          >
            <span>{p.name}</span>

            <div className="flex gap-3">
              <button
                aria-label={`Editar participante ${p.name}`}
                onClick={() => {
                  setEditingId(p.id);
                  setName(p.name);
                }}
              >
                <Pencil size={18} />
              </button>

              <button
                aria-label={`Excluir participante ${p.name}`}
                className="text-red-500"
                onClick={() =>
                  execute(() => removeParticipant(p.id))
                }
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-xl font-semibold">Despesas</h3>

          <button
            disabled={participants.length === 0}
            onClick={() => {
              setEditingExpense(undefined);
              setExpenseOpen(true);
            }}
            className="flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-white disabled:opacity-50"
          >
            <Plus size={18} />
            Nova despesa
          </button>
        </header>

        {expenses.length === 0 && (
          <p className="text-sm text-slate-500">
            Nenhuma despesa registrada.
          </p>
        )}

        {expenses.map((expense) => (
          <article
            key={expense.id}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 py-4"
          >
            <div>
              <p className="font-semibold">{expense.description}</p>

              <p className="text-sm text-slate-500">
                Pago por{' '}
                {participants.find((p) => p.id === expense.paidById)?.name}
                {' · '}
                {expense.date}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <strong>{formatMoney(expense.amount)}</strong>

              <button
                aria-label={`Editar despesa ${expense.description}`}
                onClick={() => {
                  setEditingExpense(expense);
                  setExpenseOpen(true);
                }}
              >
                <Pencil size={18} />
              </button>

              <button
                aria-label={`Excluir despesa ${expense.description}`}
                className="text-red-500"
                onClick={() => {
                  if (window.confirm('Excluir esta despesa?')) {
                    execute(() => removeExpense(expense.id));
                  }
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </article>
        ))}
      </section>

      {expenseOpen && (
        <ExpenseForm
          groupId={id}
          participants={participants}
          expense={editingExpense}
          splits={data.splits.filter(
            (s) => s.expenseId === editingExpense?.id,
          )}
          onSave={(input) => saveExpense(input, editingExpense?.id)}
          onClose={() => setExpenseOpen(false)}
        />
      )}
    </div>
  );
}