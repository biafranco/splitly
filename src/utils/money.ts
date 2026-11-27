
export function toCents(amount: number): number {
  return Math.round(amount * 100);
}

export function fromCents(amount: number): number {
  return amount / 100;
}

export function isValidAmount(amount: number): boolean {
  return Number.isSafeInteger(amount) && amount > 0;
}

export function formatMoney(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(fromCents(amount));
}