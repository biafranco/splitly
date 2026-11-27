
import { UsersRound, Pencil, Trash2 } from 'lucide-react';
import type { Group } from '../../domain/entities/group';

interface GroupCardProps {
  group: Group;
  onEdit: () => void;
  onDelete: () => void;
}

export function GroupCard({
  group,
  onEdit,
  onDelete,
}: GroupCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6">
      <div className="flex items-center justify-between">
        <div className="rounded-xl bg-primary-50 p-3 text-primary-600">
          <UsersRound size={24} />
        </div>

        <div className="flex gap-2">
          <button
            aria-label={`Editar ${group.name}`}
            onClick={onEdit}
            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
          >
            <Pencil size={18} />
          </button>

          <button
            aria-label={`Excluir ${group.name}`}
            onClick={onDelete}
            className="rounded-lg p-2 text-red-500 hover:bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      <h3 className="mt-5 text-lg font-semibold">
        {group.name}
      </h3>

      <p className="mt-2 text-sm text-slate-500">
        {group.description || 'Sem descrição'}
      </p>
    </article>
  );
}
