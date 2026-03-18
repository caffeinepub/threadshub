export interface Discount {
  code: string;
  percent: number;
  active: boolean;
  usageCount: number;
}

const STORAGE_KEY = "threadshub_discounts";

const defaults: Discount[] = [
  { code: "FIRST10", percent: 10, active: true, usageCount: 0 },
];

function seed(): void {
  if (localStorage.getItem(STORAGE_KEY)) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
}

export function getDiscounts(): Discount[] {
  seed();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [...defaults];
    return JSON.parse(raw) as Discount[];
  } catch {
    return [...defaults];
  }
}

export function saveDiscount(d: Discount): void {
  const all = getDiscounts();
  const idx = all.findIndex((x) => x.code === d.code);
  if (idx !== -1) {
    all[idx] = d;
  } else {
    all.push(d);
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function deleteDiscount(code: string): void {
  const all = getDiscounts().filter((d) => d.code !== code);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
}

export function toggleDiscount(code: string): void {
  const all = getDiscounts();
  const idx = all.findIndex((d) => d.code === code);
  if (idx !== -1) {
    all[idx].active = !all[idx].active;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }
}
