# ThreadsHub Mobile UX + Checkout Optimization

## Current State
ThreadsHub is a Pakistan-based garment e-commerce site with:
- Product detail page (ProductDetailPage.tsx, 1336 lines) with full gallery, color/size selectors, sticky add-to-cart bar, viewing count, reviews, UGC section, delivery countdown
- Cart page (CartPage.tsx) with order summary, free delivery progress bar, You May Also Like section
- Checkout page (CheckoutPage.tsx) with one-page form, payment method, discount code, trust badges strip, order confirmation
- Navbar with slide-in cart (Navbar.tsx)
- Theme: #8B3A2F (primary brownish-red), #E4572E (accent orange), #F8F5F2 (background beige)

## Requested Changes (Diff)

### Add
- Sticky mobile bottom bar on product page with "Buy Now ⚡" button (min 48px height)
- Slide animation + backdrop blur on cart panel open/close
- Trust line in cart: "🔒 Secure Checkout | 🚚 Fast Delivery"
- "Why Customers Love This" bullet section on product page (if not already present)
- Trust badges above Place Order button: 🔒 Secure Payment, 🚚 Cash on Delivery Available, ↩️ 7 Days Exchange
- "Estimated Delivery: 3–5 Days" text below shipping methods
- "You saved Rs. XXX 🎉" line in order summary when discount applied
- Trust strip in footer/checkout: 🔒 100% Secure Checkout, 🚚 Fast Delivery Across Pakistan, ↩️ Easy 7-Day Exchange

### Modify
- All primary CTA buttons (Add to Cart, Checkout, Place Order): min-height 48px, full-width on mobile
- Cart slide panel: smooth `translate-x` transition (300ms ease), `backdrop-blur-sm` on overlay
- Cart subtotal: make visually prominent (larger font, bold)
- Cart "Proceed to Checkout" / "Checkout" button: bold, full-width
- Checkout form: increase spacing between fields (gap-6 instead of gap-4), ensure labels are above inputs (already done), highlight required asterisk in red
- Shipping method selection: add icons (🚚 for standard, ⚡ for express), highlight selected with colored border
- Place Order button: full-width, bold, shadow + hover scale effect
- Product page sections: increase spacing (py-6 dividers between sections), add <hr> divider lines
- ProductDetailPage "Why Choose This Product" section → rename/ensure "Why Customers Love This"
- Order summary on checkout: show "You saved Rs. X 🎉" row if discount applied (already shown as Discount row — make it celebratory)
- Mobile order summary: make sticky at bottom of viewport when scrolling (sticky positioning)

### Remove
- Nothing to remove

## Implementation Plan
1. **ProductDetailPage.tsx**: Add sticky mobile bottom bar with "Buy Now ⚡" (fixed bottom, z-50, only on mobile, hidden when sticky add-to-cart is visible). Ensure section dividers between major sections. Rename "Why Choose This Product" → "Why Customers Love This" if it exists, or add it. Increase inter-section spacing.
2. **Navbar.tsx** (cart panel): Add `backdrop-blur-sm bg-black/50` to overlay, ensure cart slide uses `transition-transform duration-300 ease-in-out`. Add trust line inside cart panel above checkout button. Make Subtotal row visually prominent. Make Checkout button full-width bold.
3. **CheckoutPage.tsx**: Add trust badges row just above Place Order button (3 badges: 🔒 Secure Payment, 🚚 Cash on Delivery Available, ↩️ 7 Days Exchange). Increase field spacing. Make Place Order button have `shadow-lg hover:shadow-xl hover:scale-[1.01]`. Add "Estimated Delivery: 3–5 Days" below payment methods. Show "You saved Rs. X 🎉" in summary when discount applied.
4. **CartPage.tsx**: Ensure Subtotal label/value is larger bold. Ensure Checkout button is full-width bold. Min-height 48px on buttons.
5. **Global mobile CSS**: All primary action buttons min-h-[48px], touch-action manipulation.
