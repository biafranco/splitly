import {
  Wallet,
  UsersRound,
  TrendingUp,
  TrendingDown,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { loadData } from '../infrastructure/storage';
import { calculateGroupBalances } from '../domain/services/group-balance';
import { formatMoney } from '../utils/money';

export function Dashboard() {
  const data = loadData();

  const totalExpenses = data.expenses.reduce(
    (sum, e) => sum + e.amount,
    0,
  );

  const balances = data.groups.flatMap((group) =>
    Object.values(calculateGroupBalances(data, group.id)),
  );

  const totalReceivable = balances
    .filter((value) => value > 0)
    .reduce((sum, value) => sum + value, 0);

  const totalPayable = balances
    .filter((value) => value < 0)
    .reduce((sum, value) => sum - value, 0);

  const metrics = [
    {
      label: 'Total de despesas',
      value: formatMoney(totalExpenses),
      icon: Wallet,
      color: 'bg-blue-50 text-blue-600',
    },
    {
      label: 'Total a receber',
      value: formatMoney(totalReceivable),
      icon: TrendingUp,
      color: 'bg-emerald-50 text-emerald-600',
    },
    {
      label: 'Total a pagar',
      value: formatMoney(totalPayable),
      icon: TrendingDown,
      color: 'bg-red-50 text-red-600',
    },
    {
      label: 'Grupos ativos',
      value: data.groups.length,
      icon: UsersRound,
      color: 'bg-violet-50 text-violet-600',
    },
  ];

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Visão geral</h2>
          <p className="mt-2 text-slate-500">
            Acompanhe suas despesas compartilhadas.
          </p>
        </div>

        <Link
          to="/groups"
          className="flex items-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-white"
        >
          <Plus size={18} />
          Gerenciar grupos
        </Link>
      </header>

      <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon, color }) => (
          <article
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <div className={`mb-5 w-fit rounded-xl p-3 ${color}`}>
              <Icon size={22} />
            </div>

            <p className="text-sm text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold">{value}</p>
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-6 text-xl font-semibold">Meus grupos</h3>

        {data.groups.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <UsersRound
              size={40}
              className="mb-4 text-primary-600"
            />

            <h4 className="font-semibold">Nenhum grupo criado</h4>

            <p className="mt-2 text-sm text-slate-500">
              Crie um grupo para começar.
            </p>

            <Link
              to="/groups"
              className="mt-6 rounded-xl bg-primary-600 px-5 py-3 text-white"
            >
              Criar primeiro grupo
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {data.groups.map((group) => (
              <Link
                key={group.id}
                to={`/groups/${group.id}`}
                className="rounded-xl border border-slate-200 p-5 transition hover:border-primary-500"
              >
                <div className="flex justify-between">
                  <UsersRound className="text-primary-600" />
                  <ArrowRight size={18} className="text-slate-400" />
                </div>

                <h4 className="mt-4 font-semibold">{group.name}</h4>

                <p className="mt-2 text-sm text-slate-500">
                  {data.participants.filter(
                    (p) => p.groupId === group.id,
                  ).length}{' '}
                  participantes
                </p>

                <p className="mt-4 text-xl font-bold">
                  {formatMoney(
                    data.expenses
                      .filter((e) => e.groupId === group.id)
                      .reduce((sum, e) => sum + e.amount, 0),
                  )}
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-5 text-xl font-semibold">
          Despesas recentes
        </h3>

        {data.expenses.length === 0 && (
          <p className="text-sm text-slate-500">
            Nenhuma despesa registrada.
          </p>
        )}

        {[...data.expenses]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .slice(0, 5)
          .map((expense) => (
            <Link
              key={expense.id}
              to={`/groups/${expense.groupId}`}
              className="flex items-center justify-between border-b border-slate-100 py-4"
            >
              <div>
                <p className="font-medium">{expense.description}</p>
                <p className="text-sm text-slate-500">
                  {data.groups.find(
                    (g) => g.id === expense.groupId,
                  )?.name}
                </p>
              </div>

              <strong>{formatMoney(expense.amount)}</strong>
            </Link>
          ))}
      </section>
    </div>
  );
}