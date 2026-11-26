export interface Settlement {
  id: string;
  groupId: string;
  fromParticipantId: string;
  toParticipantId: string;
  amount: number;
  createdAt: string;
}