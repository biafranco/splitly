
import type { Group } from '../entities/group';

function validateGroupName(name: string): string {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error('Group name is required');
  }

  if (normalizedName.length > 100) {
    throw new Error('Group name is too long');
  }

  return normalizedName;
}

export function createGroup(
  name: string,
  description?: string,
): Group {
  const normalizedName = validateGroupName(name);
  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name: normalizedName,
    description: description?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };
}

export type UpdateGroupInput = Partial<
  Pick<Group, 'name' | 'description'>
>;

export function updateGroup(
  group: Group,
  input: UpdateGroupInput,
): Group {
  return {
    ...group,
    name:
      input.name !== undefined
        ? validateGroupName(input.name)
        : group.name,
    description:
      input.description !== undefined
        ? input.description.trim() || undefined
        : group.description,
    updatedAt: new Date().toISOString(),
  };
}
