export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatOrdinal(index: number): string {
  return String(index + 1).padStart(2, "0");
}
