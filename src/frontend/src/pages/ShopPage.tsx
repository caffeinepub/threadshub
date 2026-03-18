import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { categories, productTypes } from "@/data/products";
import type { Category, ProductType } from "@/data/products";
import { getProducts } from "@/utils/productStorage";
import { useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

type ShopSearch = { category?: string; filter?: string };

const PAGE_HEADINGS: Record<string, string> = {
  new: "New Arrivals",
  bestseller: "Best Sellers",
  Men: "Men's Collection",
  Women: "Women's Collection",
  Boys: "Boys' Collection",
  Girls: "Girls' Collection",
  Baby: "Baby Collection",
};

export default function ShopPage() {
  const search = useSearch({ strict: false }) as ShopSearch;
  const initialCategory: Category | "All" =
    search.category && (categories as string[]).includes(search.category)
      ? (search.category as Category)
      : "All";

  const [activeCategory, setActiveCategory] = useState<Category | "All">(
    initialCategory,
  );
  const [activeType, setActiveType] = useState<ProductType | "All">("All");
  const [searchText, setSearchText] = useState("");
  const [products, setProducts] = useState(() => getProducts());

  // Update active category when URL changes
  useEffect(() => {
    const cat = search.category;
    if (cat && (categories as string[]).includes(cat)) {
      setActiveCategory(cat as Category);
    } else if (!cat) {
      setActiveCategory("All");
    }
  }, [search.category]);

  // Listen for storage changes (cross-tab admin edits)
  useEffect(() => {
    const handler = () => setProducts(getProducts());
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  // Listen for same-tab visibility changes
  useEffect(() => {
    const handler = () => {
      if (document.visibilityState === "visible") setProducts(getProducts());
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchType = activeType === "All" || p.type === activeType;
    const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    // filter param overrides
    if (search.filter === "new") return p.newArrival && matchSearch;
    if (search.filter === "bestseller") return p.isBestSeller && matchSearch;
    return matchCat && matchType && matchSearch;
  });

  const pageHeading =
    search.filter && PAGE_HEADINGS[search.filter]
      ? PAGE_HEADINGS[search.filter]
      : search.category && PAGE_HEADINGS[search.category]
        ? PAGE_HEADINGS[search.category]
        : "All Products";

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {search.filter ? "Collections" : "Explore"}
        </span>
        <h1 className="font-display text-4xl font-bold mt-1">{pageHeading}</h1>
        <p className="text-muted-foreground mt-2 font-sans text-sm">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      {/* Filters — only show if not using filter param */}
      {!search.filter && (
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="pl-10"
              data-ocid="shop.search_input"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {(["All", ...categories] as (Category | "All")[]).map((cat) => (
              <button
                type="button"
                key={cat}
                onClick={() => setActiveCategory(cat)}
                data-ocid="shop.category.tab"
                className={`category-pill ${
                  activeCategory === cat
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-background text-foreground border-border hover:border-primary"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex gap-2">
            {(["All", ...productTypes] as (ProductType | "All")[]).map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setActiveType(t)}
                data-ocid="shop.type.tab"
                className={`category-pill ${
                  activeType === t
                    ? "bg-foreground text-background border-foreground"
                    : "bg-background text-foreground border-border hover:border-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Search bar for filtered views */}
      {search.filter && (
        <div className="relative max-w-sm mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-10"
            data-ocid="shop.search_input"
          />
        </div>
      )}

      {filtered.length === 0 ? (
        <div
          className="text-center py-24 text-muted-foreground"
          data-ocid="shop.empty_state"
        >
          <p className="font-display text-2xl mb-2">No products found</p>
          <p className="font-sans text-sm">
            Try a different filter or search term.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
