import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { categories, products } from "@/data/products";
import type { Category } from "@/data/products";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

export default function HomePage() {
  const featured = products.filter((p) => p.featured);
  const [activeCategory, setActiveCategory] = useState<Category | "All">("All");

  const filteredFeatured =
    activeCategory === "All"
      ? featured
      : featured.filter((p) => p.category === activeCategory);

  return (
    <main>
      <section className="relative overflow-hidden bg-foreground">
        <img
          src="/assets/generated/hero-banner.dim_1200x500.jpg"
          alt="ThreadsHub fashion banner"
          className="w-full h-[420px] sm:h-[520px] object-cover opacity-70"
        />
        <div className="absolute inset-0 flex flex-col items-start justify-center px-8 sm:px-16 lg:px-24">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
          >
            <p className="font-sans text-xs font-semibold uppercase tracking-[0.25em] text-primary mb-3">
              New Collection 2026
            </p>
            <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-white leading-tight max-w-xl">
              Style for
              <br />
              <em className="not-italic text-primary">Every</em> Age
            </h1>
            <p className="mt-4 text-white/75 font-sans text-base max-w-sm">
              Quality garments for men, women, boys, girls, and babies. Crafted
              with care — worn with pride.
            </p>
            <div className="mt-8 flex gap-4 flex-wrap">
              <Link to="/shop">
                <Button className="bg-primary text-primary-foreground hover:opacity-90 rounded-sm px-8 py-3 font-semibold uppercase tracking-widest text-sm gap-2">
                  Shop Now <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-4">
        <div className="flex flex-wrap gap-2">
          {(["All", ...categories] as (Category | "All")[]).map((cat) => (
            <button
              type="button"
              key={cat}
              onClick={() => setActiveCategory(cat)}
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
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Curated Picks
            </span>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mt-1">
              Featured Collection
            </h2>
          </div>
          <Link
            to="/shop"
            className="text-sm font-sans font-medium text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {filteredFeatured.length === 0 ? (
          <div
            className="text-center py-16 text-muted-foreground"
            data-ocid="shop.empty_state"
          >
            <Sparkles className="h-8 w-8 mx-auto mb-3 opacity-40" />
            <p className="font-sans">No featured items in this category yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {filteredFeatured.map((p, i) => (
              <ProductCard key={p.id} product={p} index={i} />
            ))}
          </div>
        )}
      </section>

      <section className="bg-secondary/50 mt-16 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: "🚚", title: "Free Shipping", sub: "On orders over $50" },
            { icon: "↩️", title: "Easy Returns", sub: "30-day return policy" },
            { icon: "🛡️", title: "Secure Payment", sub: "100% safe checkout" },
            {
              icon: "💎",
              title: "Premium Quality",
              sub: "Ethically sourced fabrics",
            },
          ].map((item) => (
            <div key={item.title} className="flex flex-col items-center gap-2">
              <span className="text-2xl">{item.icon}</span>
              <p className="font-sans font-semibold text-sm">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.sub}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
