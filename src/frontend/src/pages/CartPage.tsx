import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/context/CartContext";
import { Link } from "@tanstack/react-router";
import { ArrowRight, ShoppingBag, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function CartPage() {
  const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground/30 mb-6" />
        <h1 className="font-display text-3xl font-bold">Your bag is empty</h1>
        <p className="text-muted-foreground mt-2 font-sans">
          Add some items to get started.
        </p>
        <Link to="/shop">
          <Button className="mt-8 bg-primary text-primary-foreground hover:opacity-90 rounded-sm px-8 uppercase tracking-widest text-sm gap-2">
            Browse Shop <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-display text-4xl font-bold mb-8">Shopping Bag</h1>

      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {cartItems.map((item, idx) => (
              <motion.div
                key={item.cartKey}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.25 }}
                data-ocid={`cart.item.${idx + 1}`}
                className="flex gap-4 bg-card rounded-sm p-4 shadow-card"
              >
                <Link
                  to="/product/$id"
                  params={{ id: item.product.id }}
                  className="shrink-0"
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-24 h-24 object-cover rounded-sm bg-secondary/30"
                  />
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <Link to="/product/$id" params={{ id: item.product.id }}>
                        <h3 className="font-display font-semibold text-base hover:text-primary transition-colors">
                          {item.product.name}
                        </h3>
                      </Link>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {item.product.category} · {item.product.type} · Size:{" "}
                        {item.size}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item.cartKey)}
                      data-ocid={`cart.remove_button.${idx + 1}`}
                      className="text-muted-foreground hover:text-destructive transition-colors p-1"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2 border border-border rounded-sm">
                      <button
                        type="button"
                        onClick={() => updateQty(item.cartKey, item.qty - 1)}
                        className="px-2.5 py-1 hover:bg-muted transition-colors text-sm"
                      >
                        −
                      </button>
                      <input
                        type="number"
                        value={item.qty}
                        min={1}
                        onChange={(e) =>
                          updateQty(item.cartKey, Number(e.target.value))
                        }
                        data-ocid={`cart.quantity_input.${idx + 1}`}
                        className="w-10 text-center text-sm font-semibold bg-transparent border-none outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => updateQty(item.cartKey, item.qty + 1)}
                        className="px-2.5 py-1 hover:bg-muted transition-colors text-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="font-sans font-bold text-base">
                      ${(item.product.price * item.qty).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-card rounded-sm shadow-card p-6 sticky top-24">
            <h2 className="font-display text-xl font-semibold mb-4">
              Order Summary
            </h2>
            <Separator className="mb-4" />
            {cartItems.map((item) => (
              <div
                key={item.cartKey}
                className="flex justify-between text-sm font-sans mb-2"
              >
                <span className="text-muted-foreground truncate max-w-[150px]">
                  {item.product.name} ×{item.qty}
                </span>
                <span className="font-medium">
                  ${(item.product.price * item.qty).toFixed(2)}
                </span>
              </div>
            ))}
            <Separator className="my-4" />
            <div className="flex justify-between font-sans font-bold text-base mb-2">
              <span>Subtotal</span>
              <span>${cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm font-sans text-muted-foreground mb-6">
              <span>Shipping</span>
              <span>{cartTotal >= 50 ? "Free" : "$5.99"}</span>
            </div>
            <div className="flex justify-between font-sans font-bold text-lg border-t border-border pt-4">
              <span>Total</span>
              <span>
                ${(cartTotal + (cartTotal >= 50 ? 0 : 5.99)).toFixed(2)}
              </span>
            </div>
            <Link to="/checkout">
              <Button className="w-full mt-6 bg-primary text-primary-foreground hover:opacity-90 rounded-sm uppercase tracking-widest text-sm gap-2">
                Checkout <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
