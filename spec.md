# ThreadsHub Product Page Optimization

## Current State
ProductDetailPage.tsx has a fully functional product page with:
- Full-bleed hero image with transparent navbar
- Image lightbox with zoom, fullscreen, pinch-to-zoom, autoplay
- Sticky Add to Cart bar
- Viewing count (dynamic, per-product)
- Only X left urgency (with pulse)
- Star rating display (compact)
- Qty + Add to Cart in same row
- Color/size selectors
- Size Chart modal (dialog)
- Description + key highlights
- Delivery & Return section with COD/Delivery/Returns icons
- Trust badges
- "Recommended For You" related products
- Customer reviews with initials avatars

## Requested Changes (Diff)

### Add
- **WhatsApp Quick Order button** below Add to Cart: "Order on WhatsApp" with auto-fill of product name + quantity
- **Delivery Countdown timer** below price: "Order within X hrs Y mins to get delivery by tomorrow"
- **UGC Section** "Real Customers, Real Style" — 2x2 grid of 4 generated lifestyle images with hover zoom
- **Profile images** on reviews — circular real avatar images (generated) instead of initials
- **"Complete Your Look" upsell** section with "Buy 2 & Save Rs. 300" badge (replacing "Recommended For You" label only)
- **Measurement guide hint** in size chart modal
- **Micro interactions**: glow effect on Add to Cart button, hover scale on WhatsApp button

### Modify
- Reviews section: swap initials div with circular `<img>` using generated avatar images
- "Recommended For You" section title → "Complete Your Look" with "Buy 2 & Save Rs. 300" badge
- Product description area: add emotional benefit-driven copy fallback for products without custom description
- Add to Cart button: add subtle box-shadow glow on hover

### Remove
- Nothing removed (user explicit: keep all existing features)

## Implementation Plan
1. Add DeliveryCountdown component (calculates hours until next day cutoff)
2. Add WhatsApp order button below ctaRef div
3. Update mockReviews to use avatar image paths
4. Replace initials div in review cards with circular img
5. Add UGC section "Real Customers, Real Style" between reviews and recommended
6. Update "Recommended For You" section label to "Complete Your Look" + Rs. 300 bundle badge
7. Add glow CSS to Add to Cart button via className
8. No backend changes needed
