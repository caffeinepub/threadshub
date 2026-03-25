# ThreadsHub Checkout & Conversion Optimization

## Current State
- CartPage: Basic cart with items list, simple order summary, USD pricing (bug -- should be PKR), no urgency elements, no recommendations
- CheckoutPage: Form with Name/Phone/Address/City, COD + EasyPaisa/JazzCash payment options, discount code, sticky order summary on desktop, WhatsApp auto-message on order. Message format is basic.
- ProductDetailPage: Full product layout with gallery, colors, sizes, description, delivery countdown, reviews, UGC section, WhatsApp quick order button already exists.
- Order confirmation: Basic success screen with order number and WhatsApp send button.

## Requested Changes (Diff)

### Add
- **Product Page**: "Why Choose This Product" section with 4 bullet points (Premium fabric quality, Comfortable all-day wear, Perfect for occasions, Durable stitching). Increased spacing between all sections.
- **Cart Page**: Urgency text "🔥 Only {stock} items left" per item. Free delivery progress bar ("Add Rs. X more to get FREE delivery"). "You May Also Like" product recommendations section (3 random products). Improved card UI with PKR pricing fix.
- **Checkout Page**: Trust badges strip at top (🔒 Secure Checkout, 🚚 Delivery in 3–5 days, 💯 7-day return guarantee). Highlighted selected payment method visual. Sticky order summary on mobile too.
- **Order Confirmation**: Emotional headline "🎉 Your Order is Confirmed!". Message "Thank you for shopping with ThreadsHub. Your order is being processed.". Delivery timeline visual (Order Placed → Processing → Shipped → Delivered). "Track on WhatsApp" button. "Continue Shopping" button.
- **Global**: Button hover scale effects, subtle entry animations, consistent section spacing.

### Modify
- **WhatsApp message format** in CheckoutPage: Replace with new template:
  ```
  Hello ThreadsHub 👋\nI have placed an order.\n\nOrder ID: {id}\nName: {name}\nPhone: {phone}\nCity: {city}\nTotal: Rs. {total}\nPayment: {paymentMethod}\n\nPlease confirm my order. Thank you!
  ```
- **CartPage pricing**: Fix USD `$` to `Rs.` PKR format.
- **CartPage**: Improve card UI with shadow, rounded corners, better spacing.

### Remove
- Nothing -- preserve all existing features.

## Implementation Plan
1. Update `CartPage.tsx`: fix PKR pricing, add urgency stock text per item, add free delivery progress bar, add "You May Also Like" section using StoreContext products
2. Update `CheckoutPage.tsx`: add trust badges strip at top, update WhatsApp message template, update order confirmation screen with new headline/message/timeline/buttons
3. Update `ProductDetailPage.tsx`: add "Why Choose This Product" section after description, increase section spacing
4. Global: hover transitions and animations already mostly present via motion/react -- ensure consistency
