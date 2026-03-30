import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import type { Product } from "@/data/products";
import { Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface QuickAddModalProps {
  product: Product | null;
  open: boolean;
  onClose: () => void;
}

export default function QuickAddModal({
  product,
  open,
  onClose,
}: QuickAddModalProps) {
  const { addToCart, openCart } = useCart();
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [qty, setQty] = useState(1);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      onClose();
      setSelectedSize("");
      setSelectedColor("");
      setQty(1);
    }
  };

  if (!product) return null;

  const hasDiscount =
    product.discountPrice && product.discountPrice < product.price;
  const displayPrice = hasDiscount ? product.discountPrice! : product.price;

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }
    if (product.colors.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    addToCart(product, selectedSize, qty, selectedColor || undefined);
    toast.success(`${product.name} added to cart!`, {
      description: `Size: ${selectedSize}${
        selectedColor ? ` · Color: ${selectedColor}` : ""
      }`,
    });
    onClose();
    setSelectedSize("");
    setSelectedColor("");
    setQty(1);
    openCart();
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm w-[95vw] rounded-xl p-0 overflow-hidden">
        {/* Product image + info header */}
        <div className="flex items-center gap-3 p-4 border-b bg-[#F8F5F2]">
          <img
            src={product.image}
            alt={product.name}
            className="w-16 h-16 rounded-lg object-cover flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-foreground leading-tight line-clamp-2">
              {product.name}
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="font-bold text-base text-[#8B3A2F]">
                Rs. {displayPrice?.toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-muted-foreground line-through">
                  Rs. {product.price.toLocaleString()}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="p-4 space-y-4">
          {/* Color selector */}
          {product.colors.length > 0 && (
            <div>
              <p className="text-sm font-semibold mb-2 text-foreground">
                Color
                {selectedColor && (
                  <span className="font-normal text-muted-foreground ml-1">
                    — {selectedColor}
                  </span>
                )}
              </p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    type="button"
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                      selectedColor === color
                        ? "border-[#8B3A2F] bg-[#8B3A2F] text-white"
                        : "border-border bg-background text-foreground hover:border-[#8B3A2F]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Size
              {selectedSize && (
                <span className="font-normal text-muted-foreground ml-1">
                  — {selectedSize}
                </span>
              )}
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((size) => (
                <button
                  type="button"
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-[44px] h-9 px-3 rounded-md text-sm font-medium border transition-all ${
                    selectedSize === size
                      ? "border-[#8B3A2F] bg-[#8B3A2F] text-white"
                      : "border-border bg-background text-foreground hover:border-[#8B3A2F]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity */}
          <div>
            <p className="text-sm font-semibold mb-2 text-foreground">
              Quantity
            </p>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:border-[#8B3A2F] transition-colors"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-8 text-center font-semibold text-sm">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty((q) => q + 1)}
                className="w-9 h-9 rounded-md border border-border flex items-center justify-center hover:border-[#8B3A2F] transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Add to Cart button */}
          <Button
            onClick={handleAddToCart}
            className="w-full h-11 bg-[#8B3A2F] hover:bg-[#7a3228] text-white font-bold rounded-lg gap-2 text-sm"
          >
            <ShoppingBag className="h-4 w-4" />
            Add to Cart
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
