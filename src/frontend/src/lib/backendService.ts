// backend.ts only exposes _initializeAccessControlWithSecret in TS type
// The actual runtime actor has all methods via ICP actor proxy
// We use a cast approach to access the full API
import type {
  Contact as BackendContact,
  Discount as BackendDiscount,
  Order as BackendOrder,
  Product as BackendProduct,
  Review as BackendReview,
  Settings as BackendSettings,
  Subscriber as BackendSubscriber,
} from "@/backend.d";
import { createActorWithConfig } from "@/config";
import type { Product as LocalProduct, ProductReview } from "@/data/products";

// ─── Actor singleton ───────────────────────────────────────────────────────────
// biome-ignore lint/suspicious/noExplicitAny: actor proxy has all methods at runtime
let _actorPromise: Promise<any> | null = null;

// biome-ignore lint/suspicious/noExplicitAny: backend actor supports all methods at runtime
async function getActor(): Promise<any> {
  if (!_actorPromise) {
    _actorPromise = createActorWithConfig().catch((err) => {
      _actorPromise = null;
      throw err;
    });
  }
  return _actorPromise;
}

// ─── Product type conversions ──────────────────────────────────────────────────
export type FrontendProduct = LocalProduct;

function toBackendProduct(p: FrontendProduct): BackendProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description ?? "",
    shortDescription: p.shortDescription ?? "",
    price: p.price,
    discountPrice:
      p.discountPrice != null
        ? { __kind__: "Some" as const, value: p.discountPrice }
        : { __kind__: "None" as const },
    category: p.category,
    image: p.image,
    image2: p.image2 ?? "",
    image3: p.image3 ?? "",
    image4: p.image4 ?? "",
    featured: p.featured,
    newArrival: p.newArrival,
    isBestSeller: p.isBestSeller ?? false,
    sizes: p.sizes,
    colors: p.colors,
    colorImages: Object.entries(p.colorImages ?? {}).map(
      ([k, v]) => [k, v] as [string, string],
    ),
    stock: p.stock ?? 50,
    fabric: p.fabric ?? "",
    rating: p.rating ?? 4.5,
    reviewCount: p.reviewCount ?? 0,
    soldCount: p.soldCount ?? 0,
    deliveryThreshold:
      Number.parseInt(
        (p.deliveryThreshold ?? "2000").replace(/[^0-9]/g, ""),
        10,
      ) || 2000,
    returnDays: p.returnDays ?? 7,
    reviews: (p.reviews ?? []).map((r: ProductReview) => ({
      reviewer: r.name,
      rating: r.rating,
      comment: r.text,
      date: r.date,
    })),
    keyHighlights: (p.shortDescription ?? "").split("\n").filter(Boolean),
    viewingCount: 0,
    trendingBadge: false,
  };
}

function fromBackendProduct(p: BackendProduct): FrontendProduct {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    shortDescription: p.shortDescription || p.keyHighlights?.join("\n") || "",
    price: p.price,
    discountPrice:
      p.discountPrice.__kind__ === "Some" ? p.discountPrice.value : undefined,
    category: p.category as LocalProduct["category"],
    type: "Shirt" as const,
    image: p.image,
    image2: p.image2 || undefined,
    image3: p.image3 || undefined,
    image4: p.image4 || undefined,
    colorImages: Object.fromEntries(p.colorImages ?? []),
    featured: p.featured,
    newArrival: p.newArrival,
    isBestSeller: p.isBestSeller,
    sizes: p.sizes,
    colors: p.colors,
    stock: p.stock,
    fabric: p.fabric || undefined,
    rating: p.rating,
    reviewCount: p.reviewCount,
    soldCount: p.soldCount,
    deliveryThreshold: p.deliveryThreshold
      ? `Above Rs. ${p.deliveryThreshold.toLocaleString()}`
      : "Above Rs. 2,000",
    returnDays: p.returnDays,
    reviews: (p.reviews ?? []).map((r: BackendReview) => ({
      name: r.reviewer,
      rating: r.rating,
      text: r.comment,
      date: r.date,
    })),
  };
}

// ─── Product operations ────────────────────────────────────────────────────────
export async function fetchProducts(): Promise<FrontendProduct[]> {
  try {
    const actor = await getActor();
    const products = await actor.getProducts();
    return products.map(fromBackendProduct);
  } catch (err) {
    console.error("fetchProducts failed:", err);
    return [];
  }
}

export async function saveProduct(p: FrontendProduct): Promise<string> {
  const actor = await getActor();
  const bp = toBackendProduct(p);
  if (p.id) {
    await actor.updateProduct(bp);
    return p.id;
  }
  return actor.addProduct(bp);
}

export async function removeProduct(id: string): Promise<void> {
  const actor = await getActor();
  await actor.deleteProduct(id);
}

export async function bulkImportProducts(
  products: FrontendProduct[],
): Promise<number> {
  const actor = await getActor();
  return actor.bulkImportProducts(products.map(toBackendProduct));
}

export async function seedInitialProducts(
  products: FrontendProduct[],
): Promise<void> {
  try {
    const actor = await getActor();
    await actor.seedProducts(products.map(toBackendProduct));
  } catch (err) {
    console.error("seedInitialProducts failed:", err);
  }
}

// ─── Order operations ──────────────────────────────────────────────────────────
export type FrontendOrder = BackendOrder;

export async function fetchOrders(): Promise<FrontendOrder[]> {
  try {
    const actor = await getActor();
    return actor.getOrders();
  } catch (err) {
    console.error("fetchOrders failed:", err);
    return [];
  }
}

export async function saveOrder(o: FrontendOrder): Promise<string> {
  const actor = await getActor();
  return actor.addOrder(o);
}

export async function changeOrderStatus(
  id: string,
  status: string,
): Promise<void> {
  const actor = await getActor();
  await actor.updateOrderStatus(id, status);
}

// ─── Settings ─────────────────────────────────────────────────────────────────
export type FrontendSettings = BackendSettings;

const DEFAULT_SETTINGS: FrontendSettings = {
  storeName: "ThreadsHub",
  whatsappNumber: "03174933882",
  easyPaisaNumber: "03041329809",
  contactEmail: "mirzayasir592@gmail.com",
  deliveryFee: 250,
  freeShippingThreshold: 2000,
  currency: "PKR",
  heroImage: "",
  announcementCode: "FIRST10",
  popupCode: "SUMMER26",
};

export async function fetchSettings(): Promise<FrontendSettings> {
  try {
    const actor = await getActor();
    const s = await actor.getSettings();
    return { ...DEFAULT_SETTINGS, ...s };
  } catch (err) {
    console.error("fetchSettings failed:", err);
    return { ...DEFAULT_SETTINGS };
  }
}

export async function updateSettings(s: FrontendSettings): Promise<void> {
  const actor = await getActor();
  await actor.saveSettings(s);
}

// ─── Discounts ─────────────────────────────────────────────────────────────────
export type FrontendDiscount = BackendDiscount;

export async function fetchDiscounts(): Promise<FrontendDiscount[]> {
  try {
    const actor = await getActor();
    return actor.getDiscounts();
  } catch (err) {
    console.error("fetchDiscounts failed:", err);
    return [];
  }
}

export async function saveDiscount(d: FrontendDiscount): Promise<void> {
  const actor = await getActor();
  const existing = await fetchDiscounts();
  const exists = existing.find((x) => x.code === d.code);
  if (exists) {
    await actor.updateDiscount(d);
  } else {
    await actor.addDiscount(d);
  }
}

export async function removeDiscount(code: string): Promise<void> {
  const actor = await getActor();
  await actor.deleteDiscount(code);
}

export async function checkDiscount(code: string): Promise<number | null> {
  try {
    const actor = await getActor();
    const result = await actor.validateDiscount(code);
    return result.__kind__ === "Some" ? result.value : null;
  } catch {
    return null;
  }
}

// ─── Contacts ─────────────────────────────────────────────────────────────────
export type FrontendContact = BackendContact;

export async function fetchContacts(): Promise<FrontendContact[]> {
  try {
    const actor = await getActor();
    return actor.getContacts();
  } catch (err) {
    console.error("fetchContacts failed:", err);
    return [];
  }
}

export async function saveContact(
  c: Omit<FrontendContact, "id">,
): Promise<string> {
  const actor = await getActor();
  return actor.addContact({
    ...c,
    id: `contact_${Date.now()}`,
  });
}

export async function removeContact(id: string): Promise<void> {
  const actor = await getActor();
  await actor.deleteContact(id);
}

// ─── Subscribers ──────────────────────────────────────────────────────────────
export type FrontendSubscriber = BackendSubscriber;

export async function fetchSubscribers(): Promise<FrontendSubscriber[]> {
  try {
    const actor = await getActor();
    return actor.getSubscribers();
  } catch (err) {
    console.error("fetchSubscribers failed:", err);
    return [];
  }
}

export async function saveSubscriber(
  s: Omit<FrontendSubscriber, "id">,
): Promise<string> {
  const actor = await getActor();
  return actor.addSubscriber({
    ...s,
    id: `sub_${Date.now()}`,
  });
}

export async function removeSubscriber(id: string): Promise<void> {
  const actor = await getActor();
  await actor.deleteSubscriber(id);
}

export function generateProductId(): string {
  return `prod_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
