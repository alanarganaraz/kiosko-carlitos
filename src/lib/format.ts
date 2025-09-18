export function formatNumberAR(value: number): string {
  if (typeof value !== "number" || Number.isNaN(value)) return "0,00";
  return new Intl.NumberFormat("es-AR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}
