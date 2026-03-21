# ThreadsHub

## Current State
- Entire app runs on localStorage only — backend (main.mo) is empty actor {}
- Admin changes only persist in the browser where they are made — no cross-device sync
- No bulk product upload
- No GA purchase event tracking
- Images loaded from external URLs (slow)
- Shipping rules exist in StoreSettings but freeShippingThreshold may not be fully wired
- No abandoned cart reminder UI

## Requested Changes (Diff)

### Add
- Motoko backend: persistent storage for Products, Orders, StoreSettings, Discounts, Contacts, EmailSubscribers
- Backend CRUD: getProducts, addProduct, updateProduct, deleteProduct, bulkImportProducts
- Backend CRUD: getOrders, addOrder, updateOrderStatus
- Backend: getSettings, saveSettings
- Backend: getDiscounts, addDiscount, updateDiscount, deleteDiscount
- Backend: addContact, getContacts, deleteContact
- Backend: addSubscriber, getSubscribers, deleteSubscriber
- Admin panel: CSV bulk product import (upload CSV → parse → bulk save to backend)
- GA purchase event tracking (send purchase event on order confirmation)
- Image lazy loading with loading="lazy" on non-critical images
- Shipping rules: freeShippingThreshold editable in admin Settings and enforced at checkout

### Modify
- Frontend: all localStorage reads/writes replaced with backend canister calls
- CartContext: on order placement, save to backend via addOrder
- AdminPage: all product/order/settings/discounts/contacts/subscribers CRUD via backend
- CheckoutPage: on order confirm, fire GA purchase event
- AnnouncementBar: read settings from backend
- ExitIntentPopup: read popup discount code from backend settings

### Remove
- All localStorage usage for products, orders, settings, discounts, contacts, subscribers (keep cart in memory as before)

## Implementation Plan
1. Generate Motoko backend with all types and CRUD functions
2. Update frontend context and all pages to use backend bindings instead of localStorage
3. Add CSV bulk import UI in Admin > Products section
4. Add GA purchase event on order confirmation
5. Fix image lazy loading on homepage product cards and category images
6. Ensure freeShippingThreshold from settings is enforced in checkout fee calculation
