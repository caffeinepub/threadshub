# ThreadsHub

## Current State
Navbar has hamburger button on right side, mobile menu opens as dropdown from top. No search bar. No email capture. Menu has: Home, Men, Women, Boys, Girls, Baby, New Arrivals, Best Sellers, Contact. Admin panel has 9 sections (no email subscribers).

## Requested Changes (Diff)

### Add
- Search icon in navbar right side (between email capture and cart)
- Email capture icon/button in navbar right side (between search and cart), opens a modal with CTA "Unlock 10% OFF Instantly" -- user enters email, gets FIRST10 code, email saved to localStorage
- Admin Panel: new "Subscribers" section (10th section) showing list of captured emails with timestamp
- Menu item: "Contact Us" (below categories) -- opens a modal with Name, Email, Phone, Comment fields + WhatsApp link to notify 03174933882
- Menu item: "Help" (below Contact Us) -- opens Help Center modal with clickable cards: FAQs, Privacy Policy, Shipping, Return and Exchange, Item Availability, Gift Cards, Terms & Conditions, Clothing Care -- each card opens its detailed info
- Menu item: "Track Your Order" (last item) -- opens modal with Order ID + Email/Phone fields to look up order status from localStorage orders

### Modify
- Hamburger button moves from RIGHT side to LEFT side of navbar (before the logo)
- Mobile menu changes from top-dropdown to LEFT-SIDE sliding drawer (slide from left, full height)
- Cart icon stays on right side -- no change
- Admin Section type and NAV_ITEMS updated to include "subscribers" section

### Remove
- Nothing removed

## Implementation Plan
1. Rewrite Navbar.tsx: hamburger LEFT, logo center or right of hamburger, left-side slide drawer, add search icon (magnifier, opens search overlay or navigates to /shop with query), add email capture icon between search and cart
2. Create EmailCaptureModal component -- stores emails in localStorage key 'th_subscribers'
3. Add Contact Us modal triggered from menu item
4. Add Help Center modal triggered from menu item -- 8 clickable cards, each expands to show full content
5. Add Track Order modal -- queries localStorage orders by orderId + email/phone match
6. Update AdminPage: add 'subscribers' to Section type and NAV_ITEMS, add renderSubscribers() section
