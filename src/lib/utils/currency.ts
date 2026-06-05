/**
 * Format a number as Indian Rupees (INR) with the ₹ symbol.
 * Uses the Indian numbering system (lakhs, crores).
 */
export function formatCurrency(
  amount: number | null | undefined,
  options?: {
    showSign?: boolean;
    compact?: boolean;
    showSymbol?: boolean;
  }
): string {
  if (amount === null || amount === undefined) return "—";

  const { showSign = false, compact = false, showSymbol = true } = options ?? {};
  const symbol = showSymbol ? "₹" : "";

  if (compact) {
    const abs = Math.abs(amount);
    if (abs >= 10000000) {
      const val = (amount / 10000000).toFixed(2);
      return `${symbol}${val} Cr`;
    }
    if (abs >= 100000) {
      const val = (amount / 100000).toFixed(2);
      return `${symbol}${val} L`;
    }
    if (abs >= 1000) {
      const val = (amount / 1000).toFixed(1);
      return `${symbol}${val}K`;
    }
  }

  // Indian number format: 1,00,000
  const formatted = new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(Math.abs(amount));

  const sign = amount < 0 ? "-" : showSign && amount > 0 ? "+" : "";

  return `${sign}${symbol}${formatted}`;
}

/**
 * Parse a currency string back to a number.
 */
export function parseCurrency(value: string): number {
  return parseFloat(value.replace(/[₹,\s]/g, "")) || 0;
}
