
import type { Group } from '../entities/group';

export function createGroup(
  name: string,
  description?: string,
): Group {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error('Group name is required');
  }

  if (normalizedName.length > 100) {
    throw new Error('Group name is too long');
  }

  const now = new Date().toISOString();

  return {
    id: crypto.randomUUID(),
    name: normalizedName,
    description: description?.trim() || undefined,
    createdAt: now,
    updatedAt: now,
  };
}
