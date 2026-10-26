export function money(value: number, digits = 0): string {
  if (!Number.isFinite(value)) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

export function pct(value: number, digits = 1): string {
  if (!Number.isFinite(value)) return "n/a";
  return `${(value * 100).toFixed(digits)}%`;
}

export function years(value: number): string {
  if (!Number.isFinite(value) || value < 0) return "No payback";
  if (value > 40) return "Over 40 years";
  return `${value.toFixed(1)} years`;
}

export function stamp(date = new Date()): string {
  const formatted = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Los_Angeles",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
  return `${formatted} PT`;
}

export function linspace(min: number, max: number, count: number): number[] {
  if (count <= 1) return [min];
  const step = (max - min) / (count - 1);
  return Array.from({ length: count }, (_, index) =>
    Math.round(min + step * index),
  );
}
