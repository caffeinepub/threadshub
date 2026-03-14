import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  index?: number;
}

const categoryColors: Record<string, string> = {
  Men: "bg-foreground/10 text-foreground",
  Women: "bg-primary/15 text-primary",
  Boys: "bg-blue-100 text-blue-700",
  Girls: "bg-pink-100 text-pink-700",
  Baby: "bg-amber-100 text-amber-700",
};

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const { addToCart } = useCart();

  const handleQuickAdd = () => {
    addToCart(product, product.sizes[0], 1);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${product.sizes[0]}`,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.07 }}
      className="group relative bg-card rounded-sm overflow-hidden shadow-card hover:shadow-elevated transition-shadow"
    >
      <Link
        to="/product/$id"
        params={{ id: product.id }}
        className="block relative overflow-hidden"
      >
        <img
          src={product.image}
          alt={product.name}
          className="product-card-img"
        />
        <div className="absolute top-3 left-3">
          <span
            className={`text-xs font-sans font-semibold px-2 py-1 rounded-full ${
              categoryColors[product.category] ??
              "bg-muted text-muted-foreground"
            }`}
          >
            {product.category}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-display text-base font-semibold text-card-foreground hover:text-primary transition-colors leading-tight">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground mt-0.5 mb-3">
          {product.type}
        </p>
        <div className="flex items-center justify-between gap-2">
          <span className="font-sans font-bold text-lg text-foreground">
            ${product.price.toFixed(2)}
          </span>
          <Button
            size="sm"
            onClick={handleQuickAdd}
            data-ocid="product.add_button"
            className="bg-primary text-primary-foreground hover:opacity-90 rounded-sm text-xs px-3 gap-1"
          >
            <ShoppingBag className="h-3.5 w-3.5" />
            Add
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
