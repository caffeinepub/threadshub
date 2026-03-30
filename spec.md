# ThreadsHub

## Current State
- Cart is a full page at `/cart` - clicking cart icon in Navbar navigates to cart page
- CartPage already has: free delivery progress, urgency badges, subtotal, trust line, checkout button
- ProductDetailPage has sticky Buy Now mobile bar and 'Why Customers Love This' section
- CheckoutPage has trust badges, labels, required fields, Place Order button styling, 'You saved' section
- Most of the prompt from V58 was already done

## Requested Changes (Diff)

### Add
- Cart slide-in drawer panel in Navbar: clicking cart icon opens a right-side drawer with backdrop blur instead of navigating to /cart page
- CartDrawer should have: smooth slide-in from right animation, backdrop blur overlay, item list with qty controls, highlighted Subtotal (bold, large), 'Proceed to Checkout' button (full width, bold, primary color), trust line '🔒 Secure Checkout | 🚚 Fast Delivery', free delivery progress bar
- CartContext: add `cartOpen` state and `openCart`/`closeCart` functions

### Modify
- Navbar cart button: change from `<Link to="/cart">` to `<button onClick={openCart}>`
- CartContext: expose cartOpen, openCart, closeCart
- CartPage: keep as-is (accessible via /cart URL for checkout flow)

### Remove
- Nothing removed

## Implementation Plan
1. Update CartContext to add cartOpen state + openCart/closeCart
2. Create CartDrawer component: fixed right panel, backdrop blur overlay, AnimatePresence slide animation, item list, subtotal highlight, trust line, Proceed to Checkout button
3. Update Navbar cart button to call openCart() instead of navigating
4. Add <CartDrawer /> to App.tsx or Navbar
