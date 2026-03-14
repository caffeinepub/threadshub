import ProductCard from "@/components/ProductCard";
import { Input } from "@/components/ui/input";
import { categories, productTypes, products } from "@/data/products";
import type { Category, ProductType } from "@/data/products";
import { useSearch } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function ShopPage() {
  const search = useSearch({ strict: false }) as { category?: string };
  const initialCategory: Category | "All" =
    search.category && (categories as string[]).includes(search.category)
      ? (search.category as Category)
      : "All";

  const [activeCategory, setActiveCategory] = useState<Category | "All">(
    initialCategory,
  );
  const [activeType, setActiveType] = useState<ProductType | "All">("All");
  const [searchText, setSearchText] = useState("");

  // Sync category when URL search param changes
  useEffect(() => {
    const cat = search.category;
    if (cat && (categories as string[]).includes(cat)) {
      setActiveCategory(cat as Category);
    } else if (!cat) {
      setActiveCategory("All");
    }
  }, [search.category]);

  const filtered = products.filter((p) => {
    const matchCat = activeCategory === "All" || p.category === activeCategory;
    const matchType = activeType === "All" || p.type === activeType;
    const matchSearch = p.name.toLowerCase().includes(searchText.toLowerCase());
    return matchCat && matchType && matchSearch;
  });

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          Explore
        </span>
        <h1 className="font-display text-4xl font-bold mt-1">All Products</h1>
        <p className="text-muted-foreground mt-2 font-sans text-sm">
          {filtered.length} item{filtered.length !== 1 ? "s" : ""} found
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search products..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            className="pl-9 rounded-sm"
            data-ocid="shop.search_input"
          />
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-sans font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Category
        </p>
        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as (Category | "All")[]).map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
              data-ocid="shop.category_filter.tab"
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
      </div>

      <div className="mb-8">
        <p className="text-xs font-sans font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Type
        </p>
        <div className="flex flex-wrap gap-2">
          {(["All", ...productTypes] as (ProductType | "All")[]).map((type) => (
            <button
              type="button"
              key={type}
              onClick={() => setActiveType(type)}
              data-ocid="shop.type_filter.tab"
              className={`category-pill ${
                activeType === type
                  ? "bg-foreground text-background border-foreground"
                  : "bg-background text-foreground border-border hover:border-foreground"
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div
          className="text-center py-24 text-muted-foreground"
          data-ocid="shop.empty_state"
        >
          <p className="font-display text-xl">No products found</p>
          <p className="text-sm mt-2">Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      )}
    </main>
  );
}
