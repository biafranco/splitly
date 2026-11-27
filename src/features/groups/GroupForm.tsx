
import { useState } from 'react';
import type { FormEvent } from 'react';
import type { Group } from '../../domain/entities/group';
import { X } from 'lucide-react';

interface GroupFormProps {
  group?: Group;
  onSubmit: (name: string, description: string) => void;
  onClose: () => void;
}

export function GroupForm({
  group,
  onSubmit,
  onClose,
}: GroupFormProps) {
  const [name, setName] = useState(group?.name ?? '');
  const [description, setDescription] = useState(
    group?.description ?? '',
  );
  const [error, setError] = useState('');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      onSubmit(name, description);
      onClose();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'Erro inesperado',
      );
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="group-form-title"
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <header className="mb-6 flex items-center justify-between">
          <h2 id="group-form-title" className="text-xl font-bold">
            {group ? 'Editar grupo' : 'Novo grupo'}
          </h2>

          <button aria-label="Fechar" onClick={onClose}>
            <X size={22} />
          </button>
        </header>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="group-name" className="text-sm font-medium">
              Nome do grupo
            </label>

            <input
              id="group-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Ex.: Viagem para o Rio"
              required
              maxLength={100}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-primary-500"
            />
          </div>

          <div>
            <label htmlFor="group-description" className="text-sm font-medium">
              Descrição
            </label>

            <textarea
              id="group-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              placeholder="Descrição opcional"
              rows={3}
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-primary-500"
            />
          </div>

          {error && (
            <p role="alert" className="text-sm text-red-600">
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 px-4 py-2"
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="rounded-lg bg-primary-600 px-4 py-2 font-medium text-white hover:bg-primary-700"
            >
              {group ? 'Salvar alterações' : 'Criar grupo'}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}
