import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Receipt, Search, ArrowRight } from 'lucide-react';
import { loadData } from '../infrastructure/storage';
import { formatMoney } from '../utils/money';

export function Expenses() {
  const data = loadData();

  const [search, setSearch] = useState('');
  const [groupId, setGroupId] = useState('');

  const expenses = data.expenses
    .filter((expense) => {
      const matchesGroup =
        !groupId || expense.groupId === groupId;

      const matchesSearch = expense.description
        .toLowerCase()
        .includes(search.toLowerCase());

      return matchesGroup && matchesSearch;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0,
  );

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h2 className="text-3xl font-bold">Despesas</h2>
        <p className="mt-2 text-slate-500">
          Consulte as despesas de todos os seus grupos.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <Receipt size={24} className="mb-3 text-primary-600" />
        <p className="text-sm text-slate-500">Total de despesas</p>
        <p className="mt-2 text-3xl font-bold">{formatMoney(total)}</p>
        <p className="mt-2 text-sm text-slate-500">
          {expenses.length} despesas encontradas
        </p>
      </section>

      <div className="flex flex-wrap gap-4">
        <div className="flex min-w-0 flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-white px-4">
          <Search size={18} className="text-slate-400" />

          <input
            aria-label="Buscar despesas"
            placeholder="Buscar despesas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full py-3 outline-none"
          />
        </div>

        <select
          aria-label="Filtrar por grupo"
          value={groupId}
          onChange={(e) => setGroupId(e.target.value)}
          className="rounded-xl border border-slate-200 bg-white px-4 py-3"
        >
          <option value="">Todos os grupos</option>

          {data.groups.map((group) => (
            <option key={group.id} value={group.id}>
              {group.name}
            </option>
          ))}
        </select>
      </div>

      <section className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
        {expenses.length === 0 ? (
          <div className="flex flex-col items-center py-16">
            <Receipt size={40} className="mb-4 text-slate-300" />
            <p className="text-slate-500">Nenhuma despesa encontrada.</p>
          </div>
        ) : (
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                {['Descrição', 'Grupo', 'Pago por', 'Data', 'Valor', 'Ações'].map(
                  (column) => (
                    <th key={column} className="whitespace-nowrap p-4 font-medium">
                      {column}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {expenses.map((expense) => (
                <tr
                  key={expense.id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  <td className="p-4 font-medium">
                    {expense.description}
                  </td>

                  <td className="p-4">
                    {data.groups.find(
                      (g) => g.id === expense.groupId,
                    )?.name}
                  </td>

                  <td className="p-4">
                    {data.participants.find(
                      (p) => p.id === expense.paidById,
                    )?.name}
                  </td>

                  <td className="whitespace-nowrap p-4">
                    {expense.date.slice(0, 10).split('-').reverse().join('/')}
                  </td>

                  <td className="whitespace-nowrap p-4 font-semibold">
                    {formatMoney(expense.amount)}
                  </td>

                  <td className="p-4">
                    <Link
                      to={`/groups/${expense.groupId}`}
                      aria-label={`Gerenciar ${expense.description}`}
                      className="text-primary-600"
                    >
                      <ArrowRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}