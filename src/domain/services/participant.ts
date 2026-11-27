
import type { Participant } from '../entities/participant';

function validateParticipantName(name: string): string {
  const normalizedName = name.trim();

  if (!normalizedName) {
    throw new Error('Participant name is required');
  }

  if (normalizedName.length > 100) {
    throw new Error('Participant name is too long');
  }

  return normalizedName;
}

export function createParticipant(
  groupId: string,
  name: string,
): Participant {
  if (!groupId.trim()) {
    throw new Error('Group identifier is required');
  }

  return {
    id: crypto.randomUUID(),
    groupId,
    name: validateParticipantName(name),
    createdAt: new Date().toISOString(),
  };
}

export function updateParticipant(
  participant: Participant,
  name: string,
): Participant {
  return {
    ...participant,
    name: validateParticipantName(name),
  };
}

export function isDuplicateParticipant(
  participants: Participant[],
  groupId: string,
  name: string,
  excludeId?: string,
): boolean {
  const normalizedName = name.trim().toLowerCase();

  return participants.some(
    (participant) =>
      participant.groupId === groupId &&
      participant.id !== excludeId &&
      participant.name.trim().toLowerCase() === normalizedName,
  );
}
