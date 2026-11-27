import { ArrowRight, CheckCircle, Trash2 } from 'lucide-react';
import type { Participant } from '../../domain/entities/participant';
import type { Settlement } from '../../domain/entities/settlement';
import type { Balances } from '../../domain/services/balance';
import type { SettlementSuggestion } from '../../domain/services/settlement';
import { formatMoney } from '../../utils/money';

interface Props {
  participants: Participant[];
  balances: Balances;
  suggestions: SettlementSuggestion[];
  settlements: Settlement[];
  onPay: (from: string, to: string, amount: number) => void;
  onRemove: (id: string) => void;
}

export function SettlementPanel({
  participants,
  balances,
  suggestions,
  settlements,
  onPay,
  onRemove,
}: Props) {
  function getName(id: string) {
    return participants.find((p) => p.id === id)?.name ?? 'Desconhecido';
  }

  const card =
    'rounded-2xl border border-slate-200 bg-white p-6';

  return (
    <div className="space-y-6">
      <section className={card}>
        <h3 className="mb-5 text-xl font-semibold">
          Saldos individuais
        </h3>

        {participants.map((p) => {
          const balance = balances[p.id] ?? 0;

          return (
            <div
              key={p.id}
              className="flex justify-between border-b border-slate-100 py-4"
            >
              <div>
                <p className="font-medium">{p.name}</p>
                <p className="text-sm text-slate-500">
                  {balance > 0
                    ? 'Tem a receber'
                    : balance < 0
                      ? 'Tem a pagar'
                      : 'Saldo quitado'}
                </p>
              </div>

              <strong
                className={
                  balance > 0
                    ? 'text-emerald-600'
                    : balance < 0
                      ? 'text-red-600'
                      : 'text-slate-500'
                }
              >
                {formatMoney(balance)}
              </strong>
            </div>
          );
        })}
      </section>

      <section className={card}>
        <h3 className="mb-5 text-xl font-semibold">
          Acertos sugeridos
        </h3>

        {suggestions.length === 0 && (
          <div className="flex items-center gap-3 text-emerald-600">
            <CheckCircle size={22} />
            Nenhuma dívida pendente.
          </div>
        )}

        {suggestions.map((s) => (
          <div
            key={`${s.fromParticipantId}-${s.toParticipantId}`}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 py-4"
          >
            <div className="flex items-center gap-3">
              <span>{getName(s.fromParticipantId)}</span>
              <ArrowRight size={18} />
              <span>{getName(s.toParticipantId)}</span>
            </div>

            <div className="flex items-center gap-4">
              <strong>{formatMoney(s.amount)}</strong>

              <button
                onClick={() =>
                  onPay(
                    s.fromParticipantId,
                    s.toParticipantId,
                    s.amount,
                  )
                }
                className="rounded-lg bg-primary-600 px-4 py-2 text-sm text-white"
              >
                Registrar pagamento
              </button>
            </div>
          </div>
        ))}
      </section>

      <section className={card}>
        <h3 className="mb-5 text-xl font-semibold">
          Histórico de pagamentos
        </h3>

        {settlements.length === 0 && (
          <p className="text-sm text-slate-500">
            Nenhum pagamento registrado.
          </p>
        )}

        {settlements.map((s) => (
          <div
            key={s.id}
            className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 py-4"
          >
            <div>
              <p>
                {getName(s.fromParticipantId)} pagou{' '}
                {getName(s.toParticipantId)}
              </p>

              <p className="text-sm text-slate-500">
                {new Date(s.createdAt).toLocaleDateString('pt-BR')}
              </p>
            </div>

            <div className="flex items-center gap-4">
              <strong>{formatMoney(s.amount)}</strong>

              <button
                aria-label="Excluir pagamento"
                className="text-red-500"
                onClick={() => {
                  if (window.confirm('Excluir este pagamento?')) {
                    onRemove(s.id);
                  }
                }}
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}