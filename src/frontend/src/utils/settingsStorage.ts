export interface StoreSettings {
  storeName: string;
  whatsappNumber: string;
  easyPaisaNumber: string;
  contactEmail: string;
  deliveryFee: number;
  freeShippingThreshold: number;
  currency: string;
  heroImage?: string;
}

const STORAGE_KEY = "threadshub_settings";

const defaults: StoreSettings = {
  storeName: "ThreadsHub",
  whatsappNumber: "03174933882",
  easyPaisaNumber: "03041329809",
  contactEmail: "mirzayasir592@gmail.com",
  deliveryFee: 250,
  freeShippingThreshold: 5000,
  currency: "PKR",
  heroImage: "",
};

export function getSettings(): StoreSettings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...defaults };
    return { ...defaults, ...(JSON.parse(raw) as Partial<StoreSettings>) };
  } catch {
    return { ...defaults };
  }
}

export function saveSettings(s: StoreSettings): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s));
}
