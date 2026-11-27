import { Link } from 'react-router-dom';
import { loadData } from '../infrastructure/storage';
import { calculateGroupBalances } from '../domain/services/group-balance';
import { simplifyDebts } from '../domain/services/settlement';
import { formatMoney } from '../utils/money';

interface Props {
  mode: 'expenses' | 'settlements';
}

export function FinancialOverview({ mode }: Props) {
  const data = loadData();

  function getName(id: string) {
    return data.participants.find((p) => p.id === id)?.name;
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <h2 className="text-3xl font-bold">
        {mode === 'expenses' ? 'Despesas' : 'Acertos'}
      </h2>

      {data.groups.length === 0 && (
        <p className="text-slate-500">Nenhum grupo cadastrado.</p>
      )}

      {data.groups.map((group) => {
        const expenses = data.expenses.filter(
          (e) => e.groupId === group.id,
        );

        const debts = simplifyDebts(
          calculateGroupBalances(data, group.id),
        );

        return (
          <section
            key={group.id}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <header className="mb-5 flex justify-between">
              <h3 className="text-lg font-semibold">{group.name}</h3>

              <Link
                to={`/groups/${group.id}`}
                className="text-sm font-medium text-primary-600"
              >
                Gerenciar grupo
              </Link>
            </header>

            {mode === 'expenses' ? (
              expenses.length === 0 ? (
                <p className="text-slate-500">Nenhuma despesa.</p>
              ) : (
                expenses.map((e) => (
                  <div
                    key={e.id}
                    className="flex justify-between border-b border-slate-100 py-3"
                  >
                    <span>{e.description}</span>
                    <strong>{formatMoney(e.amount)}</strong>
                  </div>
                ))
              )
            ) : debts.length === 0 ? (
              <p className="text-emerald-600">Nenhuma dívida pendente.</p>
            ) : (
              debts.map((debt) => (
                <div
                  key={`${debt.fromParticipantId}-${debt.toParticipantId}`}
                  className="flex justify-between border-b border-slate-100 py-3"
                >
                  <span>
                    {getName(debt.fromParticipantId)} deve a{' '}
                    {getName(debt.toParticipantId)}
                  </span>

                  <strong>{formatMoney(debt.amount)}</strong>
                </div>
              ))
            )}
          </section>
        );
      })}
    </div>
  );
}