import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle, HandCoins } from 'lucide-react';
import { loadData } from '../infrastructure/storage';
import { calculateGroupBalances } from '../domain/services/group-balance';
import { simplifyDebts } from '../domain/services/settlement';
import { formatMoney } from '../utils/money';

export function Settlements() {
  const data = loadData();

  const groups = data.groups.map((group) => ({
    ...group,
    suggestions: simplifyDebts(
      calculateGroupBalances(data, group.id),
    ),
  }));

  const totalPending = groups
    .flatMap((group) => group.suggestions)
    .reduce((sum, suggestion) => sum + suggestion.amount, 0);

  const totalPaid = data.settlements.reduce(
    (sum, settlement) => sum + settlement.amount,
    0,
  );

  function getName(id: string) {
    return data.participants.find((p) => p.id === id)?.name
      ?? 'Desconhecido';
  }

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header>
        <h2 className="text-3xl font-bold">Acertos</h2>
        <p className="mt-2 text-slate-500">
          Acompanhe dívidas e pagamentos realizados.
        </p>
      </header>

      <section className="grid gap-5 sm:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <HandCoins className="mb-4 text-amber-500" />
          <p className="text-sm text-slate-500">Total pendente</p>
          <p className="mt-2 text-3xl font-bold">
            {formatMoney(totalPending)}
          </p>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6">
          <CheckCircle className="mb-4 text-emerald-600" />
          <p className="text-sm text-slate-500">Total pago</p>
          <p className="mt-2 text-3xl font-bold">
            {formatMoney(totalPaid)}
          </p>
        </article>
      </section>

      <section className="space-y-4">
        <h3 className="text-xl font-semibold">Acertos por grupo</h3>

        {groups.length === 0 && (
          <p className="text-slate-500">Nenhum grupo cadastrado.</p>
        )}

        {groups.map((group) => (
          <article
            key={group.id}
            className="rounded-2xl border border-slate-200 bg-white p-6"
          >
            <header className="mb-5 flex justify-between gap-4">
              <h4 className="font-semibold">{group.name}</h4>

              <Link
                to={`/groups/${group.id}`}
                className="text-sm font-medium text-primary-600"
              >
                Gerenciar acertos
              </Link>
            </header>

            {group.suggestions.length === 0 ? (
              <p className="flex items-center gap-2 text-sm text-emerald-600">
                <CheckCircle size={18} />
                Nenhuma dívida pendente.
              </p>
            ) : (
              group.suggestions.map((suggestion) => (
                <div
                  key={`${suggestion.fromParticipantId}-${suggestion.toParticipantId}`}
                  className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 py-4"
                >
                  <div className="flex items-center gap-3">
                    <span>{getName(suggestion.fromParticipantId)}</span>
                    <ArrowRight size={18} className="text-slate-400" />
                    <span>{getName(suggestion.toParticipantId)}</span>
                  </div>

                  <strong>{formatMoney(suggestion.amount)}</strong>
                </div>
              ))
            )}
          </article>
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6">
        <h3 className="mb-5 text-xl font-semibold">
          Histórico de pagamentos
        </h3>

        {data.settlements.length === 0 && (
          <p className="text-sm text-slate-500">
            Nenhum pagamento registrado.
          </p>
        )}

        {[...data.settlements]
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((settlement) => (
            <div
              key={settlement.id}
              className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 py-4"
            >
              <div>
                <p className="font-medium">
                  {getName(settlement.fromParticipantId)} pagou{' '}
                  {getName(settlement.toParticipantId)}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {data.groups.find(
                    (g) => g.id === settlement.groupId,
                  )?.name}
                  {' · '}
                  {new Date(settlement.createdAt).toLocaleDateString('pt-BR')}
                </p>
              </div>

              <strong className="text-emerald-600">
                {formatMoney(settlement.amount)}
              </strong>
            </div>
          ))}
      </section>
    </div>
  );
}