
import { useState } from 'react';
import { Plus, UsersRound } from 'lucide-react';
import { useGroups } from '../features/groups/useGroups';
import { GroupCard } from '../features/groups/GroupCard';
import { GroupForm } from '../features/groups/GroupForm';
import type { Group } from '../domain/entities/group';

export function Groups() {
  const { groups, addGroup, editGroup, deleteGroup } = useGroups();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group>();

  function openCreateForm() {
    setEditingGroup(undefined);
    setIsFormOpen(true);
  }

  function handleSubmit(name: string, description: string) {
    if (editingGroup) {
      editGroup(editingGroup.id, { name, description });
    } else {
      addGroup(name, description);
    }
  }

  function handleDelete(group: Group) {
    if (window.confirm(`Deseja excluir o grupo "${group.name}" e todos os seus dados?`)) {
      deleteGroup(group.id);
    }
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold">Meus grupos</h2>
          <p className="mt-2 text-slate-500">
            Organize suas despesas por grupos.
          </p>
        </div>

        <button
          onClick={openCreateForm}
          className="flex items-center gap-2 rounded-lg bg-primary-600 px-5 py-3 font-medium text-white hover:bg-primary-700"
        >
          <Plus size={20} />
          Novo grupo
        </button>
      </header>

      {groups.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white py-20 text-center">
          <UsersRound
            size={40}
            className="mx-auto mb-4 text-primary-600"
          />

          <h3 className="font-semibold">
            Nenhum grupo criado
          </h3>

          <p className="mt-2 text-sm text-slate-500">
            Crie seu primeiro grupo para começar.
          </p>
        </section>
      ) : (
        <section className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {groups.map((group) => (
            <GroupCard
              key={group.id}
              group={group}
              onEdit={() => {
                setEditingGroup(group);
                setIsFormOpen(true);
              }}
              onDelete={() => handleDelete(group)}
            />
          ))}
        </section>
      )}

      {isFormOpen && (
        <GroupForm
          group={editingGroup}
          onSubmit={handleSubmit}
          onClose={() => setIsFormOpen(false)}
        />
      )}
    </div>
  );
}
