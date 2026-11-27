
import {
  Wallet,
  UsersRound,
  TrendingUp,
  TrendingDown,
  Plus,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const metrics = [
  {
    label: 'Total de despesas',
    value: 'R$ 0,00',
    icon: Wallet,
    color: 'bg-blue-50 text-blue-600',
  },
  {
    label: 'Total a receber',
    value: 'R$ 0,00',
    icon: TrendingUp,
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    label: 'Total a pagar',
    value: 'R$ 0,00',
    icon: TrendingDown,
    color: 'bg-red-50 text-red-600',
  },
  {
    label: 'Grupos ativos',
    value: '0',
    icon: UsersRound,
    color: 'bg-violet-50 text-violet-600',
  },
];

export function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header>
        <h2 className="text-3xl font-bold tracking-tight">
          Visão geral
        </h2>

        <p className="mt-2 text-slate-500">
          Gerencie suas despesas compartilhadas em um só lugar.
        </p>
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
        <h3 className="text-lg font-semibold">Meus grupos</h3>

        <div className="flex flex-col items-center py-16 text-center">
          <div className="mb-4 rounded-full bg-primary-50 p-5 text-primary-600">
            <UsersRound size={32} />
          </div>

          <h4 className="font-semibold">
            Nenhum grupo criado
          </h4>

          <p className="mt-2 max-w-sm text-sm text-slate-500">
            Crie um grupo para começar a compartilhar despesas
            com seus amigos.
          </p>

          <Link
            to="/groups"
            className="mt-6 flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 text-sm font-medium text-white hover:bg-primary-700"
          >
            <Plus size={18} />
            Criar primeiro grupo
          </Link>
        </div>
      </section>
    </div>
  );
}
