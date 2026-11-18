const pad = (n: number) => String(n).padStart(2, '0');

export const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export function ageFrom(birth: string, today = new Date()) {
  const b = new Date(birth + 'T00:00:00');
  if (isNaN(b.getTime())) return null;
  let y = today.getFullYear() - b.getFullYear();
  let m = today.getMonth() - b.getMonth();
  let d = today.getDate() - b.getDate();
  if (d < 0) { m--; d += new Date(today.getFullYear(), today.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return { y: Math.max(0, y), m: Math.max(0, m), d: Math.max(0, d) };
}

export function birthFrom(y: number, m: number, d: number, today = new Date()) {
  return toIsoDate(new Date(today.getFullYear() - y, today.getMonth() - m, today.getDate() - d));
}
