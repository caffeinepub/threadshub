import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { products } from "@/data/products";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle, ShoppingBag, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";

export default function ProductDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const product = products.find((p) => p.id === id);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [selectedSize, setSelectedSize] = useState<string>("");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <p className="font-display text-2xl">Product not found</p>
        <Link to="/shop" className="text-primary underline mt-4 inline-block">
          Back to Shop
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    addToCart(product, selectedSize, qty);
    setAdded(true);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${selectedSize} · Qty: ${qty}`,
    });
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (!selectedSize) {
      toast.error("Please select a size first");
      return;
    }
    addToCart(product, selectedSize, qty);
    navigate({ to: "/checkout" });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link
        to="/shop"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Shop
      </Link>

      <div className="grid md:grid-cols-2 gap-12 lg:gap-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="aspect-square overflow-hidden rounded-sm bg-secondary/30"
        >
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="flex flex-col"
        >
          <div className="flex items-center gap-2 mb-3">
            <Badge variant="secondary" className="font-sans text-xs">
              {product.category}
            </Badge>
            <Badge variant="outline" className="font-sans text-xs">
              {product.type}
            </Badge>
          </div>

          <h1 className="font-display text-3xl sm:text-4xl font-bold text-foreground leading-tight">
            {product.name}
          </h1>
          <p className="mt-2 font-sans font-bold text-3xl text-primary">
            Rs. {product.price.toFixed(0)}
          </p>
          <p className="mt-4 font-sans text-muted-foreground leading-relaxed">
            {product.description}
          </p>

          <div className="mt-8">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest mb-3">
              Select Size
            </p>
            <div
              className="flex flex-wrap gap-2"
              data-ocid="product.size_select"
            >
              {product.sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 border text-sm font-sans font-medium rounded-sm transition-all ${
                    selectedSize === size
                      ? "bg-foreground text-background border-foreground"
                      : "bg-background text-foreground border-border hover:border-foreground"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
            {!selectedSize && (
              <p className="text-xs text-muted-foreground mt-2">
                Please choose a size to continue
              </p>
            )}
          </div>

          <div className="mt-6">
            <p className="font-sans text-sm font-semibold uppercase tracking-widest mb-3">
              Quantity
            </p>
            <div className="flex items-center gap-3 border border-border rounded-sm w-fit">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-lg hover:bg-muted transition-colors"
              >
                −
              </button>
              <span className="px-2 font-sans font-semibold w-8 text-center">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-2 text-lg hover:bg-muted transition-colors"
              >
                +
              </button>
            </div>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleBuyNow}
              data-ocid="product.buy_now_button"
              className="flex-1 py-4 px-8 rounded-sm font-semibold uppercase tracking-widest text-sm gap-2 bg-primary text-primary-foreground hover:opacity-90"
            >
              <Zap className="h-4 w-4" /> Buy Now
            </Button>
            <Button
              onClick={handleAddToCart}
              data-ocid="product.add_button"
              variant="outline"
              className={`flex-1 py-4 px-8 rounded-sm font-semibold uppercase tracking-widest text-sm gap-2 transition-all ${
                added ? "border-green-600 text-green-600 hover:bg-green-50" : ""
              }`}
            >
              {added ? (
                <>
                  <CheckCircle className="h-4 w-4" /> Added!
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" /> Add to Cart
                </>
              )}
            </Button>
          </div>

          {/* Payment info */}
          <div className="mt-6 bg-secondary/40 rounded-sm p-4">
            <p className="font-sans text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
              Payment Options
            </p>
            <div className="flex flex-wrap gap-3 text-xs font-sans text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="text-green-600 font-bold">✓</span> Cash on
                Delivery (COD)
              </span>
              <span className="flex items-center gap-1">
                <span className="text-green-600 font-bold">✓</span> EasyPaisa —
                03041329809
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
