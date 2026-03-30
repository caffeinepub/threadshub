import { Button } from "@/components/ui/button";
import { useCart } from "@/context/CartContext";
import { useStore } from "@/context/StoreContext";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export default function CartDrawer() {
  const {
    cartItems,
    cartTotal,
    cartOpen,
    closeCart,
    removeFromCart,
    updateQty,
  } = useCart();
  const { settings } = useStore();
  const navigate = useNavigate();

  const freeThreshold = settings.freeShippingThreshold ?? 2000;
  const remaining = Math.max(0, freeThreshold - cartTotal);
  const progress = Math.min(100, (cartTotal / freeThreshold) * 100);
  const freeDelivery = cartTotal >= freeThreshold;

  const handleCheckout = () => {
    closeCart();
    navigate({ to: "/checkout" });
  };

  const handleStartShopping = () => {
    closeCart();
    navigate({ to: "/shop" });
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[200] bg-black/50 backdrop-blur-sm"
            onClick={closeCart}
            data-ocid="cart.backdrop"
          />

          {/* Drawer Panel */}
          <motion.div
            key="cart-panel"
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-background shadow-2xl flex flex-col z-[201]"
            data-ocid="cart.panel"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-5 w-5 text-primary" />
                <h2 className="font-display text-lg font-bold">Shopping Bag</h2>
                {cartItems.length > 0 && (
                  <span className="text-xs bg-primary text-primary-foreground rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItems.reduce((a, i) => a + i.qty, 0)}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={closeCart}
                className="p-1.5 rounded-full hover:bg-muted transition-colors"
                data-ocid="cart.close_button"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Free delivery progress */}
            {cartItems.length > 0 && (
              <div className="px-5 py-3 bg-muted/40 border-b border-border">
                {freeDelivery ? (
                  <p className="text-xs text-green-700 font-semibold flex items-center gap-1">
                    <span>🎉</span> You&apos;ve unlocked FREE delivery!
                  </p>
                ) : (
                  <div>
                    <p className="text-xs text-muted-foreground mb-1.5">
                      Add{" "}
                      <span className="font-bold text-foreground">
                        Rs. {remaining.toLocaleString()}
                      </span>{" "}
                      more for FREE delivery
                    </p>
                    <div className="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                      <div
                        className="h-1.5 rounded-full bg-primary transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Cart Items */}
            {cartItems.length === 0 ? (
              <div
                className="flex-1 flex flex-col items-center justify-center gap-4 px-5 py-10"
                data-ocid="cart.empty_state"
              >
                <ShoppingBag className="h-14 w-14 text-muted-foreground/25" />
                <p className="font-display text-xl font-bold">
                  Your bag is empty
                </p>
                <p className="text-sm text-muted-foreground text-center">
                  Add some items to get started.
                </p>
                <Button
                  onClick={handleStartShopping}
                  className="bg-primary text-primary-foreground hover:opacity-90 min-h-[48px] px-8 uppercase tracking-widest text-sm"
                  data-ocid="cart.start_shopping_button"
                >
                  Start Shopping
                </Button>
              </div>
            ) : (
              <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
                <AnimatePresence>
                  {cartItems.map((item, idx) => {
                    const price =
                      item.product.discountPrice ?? item.product.price;
                    return (
                      <motion.div
                        key={item.cartKey}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, x: 40 }}
                        transition={{ duration: 0.2 }}
                        data-ocid={`cart.item.${idx + 1}`}
                        className="flex gap-3 bg-card rounded-lg p-3 border border-border shadow-sm"
                      >
                        {/* Image */}
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-muted flex-shrink-0">
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm leading-tight line-clamp-1">
                            {item.product.name}
                          </p>
                          <p className="text-xs text-muted-foreground mt-0.5">
                            Size: {item.size}
                          </p>
                          <p className="text-sm font-bold text-primary mt-1">
                            Rs. {(price * item.qty).toLocaleString()}
                          </p>

                          {/* Qty controls */}
                          <div className="flex items-center gap-2 mt-2">
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.cartKey, item.qty - 1)
                              }
                              className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              data-ocid={`cart.qty_minus.${idx + 1}`}
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="text-sm font-semibold w-5 text-center">
                              {item.qty}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQty(item.cartKey, item.qty + 1)
                              }
                              className="w-6 h-6 rounded border border-border flex items-center justify-center hover:bg-muted transition-colors"
                              data-ocid={`cart.qty_plus.${idx + 1}`}
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                        </div>

                        {/* Remove */}
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.cartKey)}
                          className="p-1 text-muted-foreground hover:text-destructive transition-colors self-start flex-shrink-0"
                          data-ocid={`cart.delete_button.${idx + 1}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Footer */}
            {cartItems.length > 0 && (
              <div className="border-t border-border px-5 py-4 space-y-3 bg-background">
                {/* Subtotal */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground font-medium uppercase tracking-wide">
                    Subtotal
                  </span>
                  <span className="text-xl font-bold text-primary">
                    Rs. {cartTotal.toLocaleString()}
                  </span>
                </div>

                {/* Trust line */}
                <p className="text-center text-xs text-muted-foreground">
                  🔒 Secure Checkout | 🚚 Fast Delivery
                </p>

                {/* Checkout button */}
                <Button
                  onClick={handleCheckout}
                  className="w-full min-h-[52px] bg-primary text-primary-foreground hover:opacity-90 font-bold text-base uppercase tracking-wider shadow-md hover:shadow-lg transition-all"
                  data-ocid="cart.checkout_button"
                >
                  Proceed to Checkout →
                </Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
