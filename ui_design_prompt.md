# 🎨 Sale Entry App — Complete Frontend UI Design Prompt

> **Purpose**: Use this prompt with any AI tool (or as a specification for a developer) to generate the complete frontend for the Sale Entry App. Every page, element, and interaction is mapped to a real backend API endpoint.

---

## 📋 Project Context

Build a **responsive web frontend** for a Sales & Order Management System. The app has **2 user roles** — `ADMIN` and `SALES_PERSON` — each with a separate dashboard and set of functionalities. The backend is a Spring Boot REST API with JWT authentication.

**Tech Stack for Frontend**: React (with Vite), Vanilla CSS (no Tailwind), responsive mobile-first design.

**Design Language**: Modern, premium, dark-mode-first with glassmorphism elements. Use `Inter` or `Outfit` font from Google Fonts. Color palette: deep navy (#0f172a) background, electric blue (#3b82f6) primary accent, emerald (#10b981) success, amber (#f59e0b) warning, rose (#f43f5e) danger. Use smooth gradients, subtle shadows, and micro-animations (hover lifts, skeleton loaders, slide-in transitions).

---

## 🔑 FLOW 1 — Authentication Pages (Public, No Login Required)

### Page 1.1: Login Page (`/login`)
> **API**: `POST /auth/login`

**Layout**: Centered card on a gradient background (deep navy to slate). The card has glassmorphism (semi-transparent, backdrop blur).

| Element | Type | Details |
|---------|------|---------|
| App Logo/Title | `<h1>` | "Sale Entry" with a subtle gradient text effect |
| Tagline | `<p>` | "Manage your sales, orders & inventory" |
| Name field | `<input type="text">` id=`login-name` | Placeholder: "Enter your username", required, maps to `LoginRequestDto.name` |
| Password field | `<input type="password">` id=`login-password` | Placeholder: "Enter your password", required, min 6 / max 20 chars, maps to `LoginRequestDto.password` |
| Show/Hide password | `<button>` icon toggle | 👁️ eye icon inside the password field |
| Login button | `<button>` id=`login-submit` | Primary filled button, full-width. Text: "Sign In". Loading spinner on click. |
| Register link | `<a>` | "Don't have an account? Register here" → navigates to `/register` |
| Error toast | Toast notification | Shows on 401/400 — "Invalid credentials" |

**Responsive**: Single column on mobile, same centered card on desktop (max-width: 420px).

**On Success**: Store JWT token in `localStorage`. Parse the token to extract `role` (`ADMIN` or `SALES_PERSON`). Redirect:
- `ADMIN` → `/admin/dashboard`
- `SALES_PERSON` → `/salesperson/dashboard`

---

### Page 1.2: Registration Page (`/register`)
> **APIs**: `POST /admin/register` OR `POST /salesperson/register`

**Layout**: Same centered glassmorphism card as Login.

| Element | Type | Details |
|---------|------|---------|
| Title | `<h1>` | "Create Account" |
| Role selector | `<div>` with 2 toggle buttons id=`role-toggle` | "Admin" / "Sales Person" — pill-shaped toggle, changes form fields below |
| Name field | `<input type="text">` id=`register-name` | Required. Maps to `AdminRequestDto.name` / `SalesPersonRequestDto.name` |
| Email field | `<input type="email">` id=`register-email` | Required. Maps to `email` |
| Password field | `<input type="password">` id=`register-password` | Required, 6-20 chars. Maps to `password` |
| Confirm password | `<input type="password">` id=`register-confirm` | Client-side match validation |
| Phone number field | `<input type="tel">` id=`register-phone` | **Only visible when role = SALES_PERSON**. 10 digits. Maps to `SalesPersonRequestDto.phoneno` |
| Register button | `<button>` id=`register-submit` | "Create Account". Loading state on submit. |
| Login link | `<a>` | "Already have an account? Sign In" → `/login` |
| Success toast | Toast | "Account created! Please sign in." → redirect to `/login` |
| Error toast | Toast | Shows validation errors (duplicate email, invalid phone, etc.) |

**Responsive**: Same as login — centered card, single column.

---

## 👔 FLOW 2 — Admin Dashboard (Role: ADMIN)

### Page 2.0: Admin Shell / Layout (`/admin/*`)

**Layout**: Sidebar + Main Content area.

| Element | Type | Details |
|---------|------|---------|
| Sidebar (Desktop) | `<nav>` id=`admin-sidebar` | Fixed left sidebar (width: 260px). Contains: App logo, nav links, logout button at bottom |
| Bottom Nav (Mobile) | `<nav>` id=`admin-bottom-nav` | Fixed bottom bar with icon + label for each section. **Replaces sidebar on mobile.** |
| Nav items | `<a>` links | 📊 Dashboard, 📦 Products, 👥 Salespersons, 📋 Orders. Active state = accent highlight + left border |
| User info | `<div>` id=`admin-user-info` | Show logged-in user name (from JWT `userName`), role badge "ADMIN" |
| Logout button | `<button>` id=`admin-logout` | Red tinted, clears JWT from localStorage, redirects to `/login` |
| Main content | `<main>` | Right side, fills remaining width. Has a top header bar showing page title + breadcrumbs |

**Responsive Behavior**:
- **Desktop (≥1024px)**: Fixed sidebar + scrollable main content
- **Tablet (768px–1023px)**: Collapsible sidebar (hamburger icon in header)
- **Mobile (<768px)**: No sidebar → bottom navigation bar with 4 icons

---

### Page 2.1: Admin Dashboard Home (`/admin/dashboard`)
> **APIs (Future)**: `GET /admin/dashboard` — For now, build the UI with placeholder/loading states

**Layout**: Stats cards at top, charts below.

| Element | Type | Details |
|---------|------|---------|
| Welcome banner | `<div>` | "Welcome back, {userName}" with date/time |
| Stat Card 1 | Card id=`stat-total-products` | Icon: 📦, Title: "Total Products", Value: count from `GET /products` (totalElements from pagination) |
| Stat Card 2 | Card id=`stat-total-orders` | Icon: 📋, Title: "Total Orders", Value: count from `GET /orders/viewOrders` (totalElements) |
| Stat Card 3 | Card id=`stat-total-salespersons` | Icon: 👥, Title: "Salespersons", Value: count from `GET /salesperson` (totalElements) |
| Stat Card 4 | Card id=`stat-total-revenue` | Icon: 💰, Title: "Total Revenue", Value: ₹XX,XXX (future API: `/admin/dashboard`) |
| Quick actions | `<div>` with buttons | "Add Product", "View Orders", "View Salespersons" — shortcut buttons |

**Stat Card Design**: Glassmorphism card, large number with animated count-up effect, icon with gradient background circle, subtle hover lift animation.

**Responsive**: 
- Desktop: 4 cards in a row
- Tablet: 2x2 grid
- Mobile: Single column stack

---

### Page 2.2: Product Management (`/admin/products`)
> **APIs**: `GET /products` (paginated), `GET /products/search?keyword=`, `POST /products/register`, `PUT /products/update/{id}`, `DELETE /products/{id}`

**Layout**: Search bar + Table/Grid + Add button.

| Element | Type | Details |
|---------|------|---------|
| Page title | `<h2>` | "Product Catalog" |
| Search bar | `<input type="search">` id=`product-search` | Placeholder: "Search products by name...", debounced (300ms), calls `GET /products/search?keyword=` |
| Add Product button | `<button>` id=`add-product-btn` | "+ Add Product" — top right, opens modal |
| Product table (Desktop) | `<table>` id=`product-table` | Columns: Name, Weight, Price (₹), Stock Qty, Status (Active/Inactive badge), Actions |
| Product cards (Mobile) | `<div>` card list | Same data as table but rendered as stacked cards on mobile |
| Stock badge | `<span>` | Green "In Stock" if stockQty > 10, Amber "Low Stock" if ≤ 10, Red "Out of Stock" if 0 |
| Action buttons | `<button>` per row | ✏️ Edit (opens edit modal), 🗑️ Delete (opens confirm dialog) |
| Pagination | `<div>` id=`product-pagination` | Page numbers + Previous/Next. Uses `?page=X&size=10` params |
| Empty state | `<div>` | Illustration + "No products found. Add your first product!" |

**Add/Edit Product Modal** (shared modal):

| Element | Type | Details |
|---------|------|---------|
| Modal overlay | `<div>` | Dark backdrop with blur. Slide-up animation on open. |
| Modal title | `<h3>` | "Add New Product" or "Edit Product" |
| Name field | `<input type="text">` id=`product-name` | Required. Maps to `ProductRequestDto.name` |
| Weight field | `<input type="text">` id=`product-weight` | Required. E.g., "5kg", "500g". Maps to `ProductRequestDto.itemWeight` |
| Price field | `<input type="number">` id=`product-price` | Required, positive. Prefix "₹". Maps to `ProductRequestDto.price` |
| Stock Quantity field | `<input type="number">` id=`product-stock` | Required, positive. Maps to `ProductRequestDto.stockQuantity` |
| Save button | `<button>` id=`product-save` | "Save Product" — calls POST (add) or PUT (edit) |
| Cancel button | `<button>` id=`product-cancel` | "Cancel" — closes modal |

**Delete Confirmation Dialog**:
| Element | Type | Details |
|---------|------|---------|
| Title | `<h3>` | "Delete Product?" |
| Message | `<p>` | "Are you sure you want to delete {productName}? This action cannot be undone." |
| Cancel button | `<button>` | "Cancel" |
| Delete button | `<button>` | "Delete" — red, calls `DELETE /products/{id}` |

---

### Page 2.3: Salesperson Management (`/admin/salespersons`)
> **APIs**: `GET /salesperson` (paginated), `GET /salesperson/search?keyword=`
> **Future APIs**: `PUT /admin/salespersons/{id}/deactivate`

**Layout**: Search + Table/Card list.

| Element | Type | Details |
|---------|------|---------|
| Page title | `<h2>` | "Salespersons" |
| Search bar | `<input type="search">` id=`sp-search` | Placeholder: "Search by name...", calls `GET /salesperson/search?keyword=` |
| Salesperson table | `<table>` id=`sp-table` | Columns: Name, Email, Phone, Status (Active badge), Actions |
| Salesperson cards (Mobile) | `<div>` card list | Avatar circle (initials), name, email, phone |
| Action buttons | `<button>` per row | 👁️ View details, 🚫 Deactivate (future) |
| Pagination | `<div>` id=`sp-pagination` | Standard pagination component |
| Empty state | `<div>` | "No salespersons registered yet." |

**Salesperson Detail View** (slide-in panel or modal):
| Element | Type | Details |
|---------|------|---------|
| Avatar | `<div>` | Large circle with initials, gradient background |
| Name | `<h3>` | Salesperson name |
| Email | `<p>` | Email with copy icon |
| Phone | `<p>` | Phone number |
| Performance stats (future) | Cards | Total orders, Total revenue, Active orders |

---

### Page 2.4: All Orders Management (`/admin/orders`)
> **APIs**: `GET /orders/viewOrders` (paginated), `GET /orders/search?customerName=`, `GET /orders/search-status?status=`, `PUT /orders/delete-order/{id}`

**Layout**: Filters bar + Orders table/list.

| Element | Type | Details |
|---------|------|---------|
| Page title | `<h2>` | "All Orders" |
| Search by customer | `<input type="search">` id=`order-search-customer` | Placeholder: "Search by customer name...", calls `GET /orders/search?customerName=` |
| Filter by status | `<select>` id=`order-filter-status` | Options: All, PENDING, CONFIRMED, PROCESSING, SHIPPED, DELIVERED, CANCELLED. Calls `GET /orders/search-status?status=` |
| Orders table | `<table>` id=`orders-table` | Columns: Order Date, Customer (from orderItems), Status (colored badge), Total (₹), Items Count, Actions |
| Status badges | `<span>` | Color-coded: PENDING=amber, CONFIRMED=blue, PROCESSING=purple, DELIVERED=green, CANCELLED=red |
| Action buttons | `<button>` per row | 👁️ View detail (expand), 🗑️ Delete |
| Order expand/detail | Accordion or slide panel | Shows full list of `OrderItem` entries: Item Name, Qty, Price, Subtotal |
| Pagination | `<div>` id=`orders-pagination` | Standard pagination |

**Order Detail Panel** (when clicking View):
| Element | Type | Details |
|---------|------|---------|
| Order header | `<div>` | Order date, status badge, total amount |
| Customer info | `<div>` | Customer name (derived from order data) |
| Items table | `<table>` | Name, Quantity, Unit Price, Subtotal — for each `OrderItemDTO` |
| Order total | `<div>` | Bold total with ₹ prefix |
| Delete button | `<button>` | "Delete Order" — calls `PUT /orders/delete-order/{id}` |

---

## 🧑‍💼 FLOW 3 — SalesPerson Dashboard (Role: SALES_PERSON)

### Page 3.0: SalesPerson Shell / Layout (`/salesperson/*`)

**Layout**: Same sidebar/bottom-nav pattern as Admin, different nav items.

| Element | Type | Details |
|---------|------|---------|
| Nav items | `<a>` links | 🏠 Dashboard, 👤 Customers, 🛒 New Order, 📋 My Orders, 👤 Profile |
| User info | `<div>` | Logged-in salesperson name, "SALES_PERSON" role badge |
| Logout | `<button>` | Same as admin |

---

### Page 3.1: SalesPerson Dashboard Home (`/salesperson/dashboard`)
> **APIs**: `GET /orders/my-orders`, `GET /orders/totalrev`

| Element | Type | Details |
|---------|------|---------|
| Welcome banner | `<div>` | "Welcome back, {userName}" |
| Stat Card 1 | Card id=`stat-my-orders` | Icon: 📋, "My Orders", count from my-orders list length |
| Stat Card 2 | Card id=`stat-my-revenue` | Icon: 💰, "My Revenue", value from `GET /orders/totalrev` (₹ formatted) |
| Stat Card 3 | Card id=`stat-pending-orders` | Icon: ⏳, "Pending Orders", count filtered from my-orders where status=PENDING |
| Quick actions | Buttons | "Create New Order", "View Customers", "My Profile" |
| Recent orders | `<div>` id=`recent-orders` | List of last 5 orders from `GET /orders/my-orders` — show date, customer, status, total |

**Responsive**: Same as admin dashboard — 3 stat cards become stacked on mobile.

---

### Page 3.2: Customer Management (`/salesperson/customers`)
> **APIs**: `GET /customers`, `POST /customers/register`
> **Future APIs**: `GET /customers/search?phone=`

**Layout**: Customer list + Add customer button.

| Element | Type | Details |
|---------|------|---------|
| Page title | `<h2>` | "My Customers" |
| Search bar (future) | `<input>` id=`customer-search` | Placeholder: "Search by phone number..." |
| Add Customer button | `<button>` id=`add-customer-btn` | "+ Add Customer" — opens modal |
| Customer list | `<div>` card grid / `<table>` | Shows: Name, Address (truncated), Phone. Click to select for order. |
| Customer card | `<div>` | Avatar (initials), name, phone, address preview. Hover: lift + shadow |
| Empty state | `<div>` | "No customers yet. Register your first customer!" |

**Add Customer Modal**:
| Element | Type | Details |
|---------|------|---------|
| Title | `<h3>` | "Register New Customer" |
| Name field | `<input type="text">` id=`customer-name` | Required. Maps to `CustomerRequestDto.name` |
| Address field | `<textarea>` id=`customer-address` | Required. Maps to `CustomerRequestDto.address` |
| Phone field | `<input type="tel">` id=`customer-phone` | Required, exactly 10 digits. Pattern validation. Maps to `CustomerRequestDto.phoneno` |
| Save button | `<button>` id=`customer-save` | "Register Customer" |
| Cancel button | `<button>` | "Cancel" |

---

### Page 3.3: New Order / Cart Flow (`/salesperson/new-order`)
> This is a **multi-step flow** — the core feature of the app.

#### Step 3.3.1: Select Customer
> **API**: `GET /customers` (to list), future: `GET /customers/search?phone=`

| Element | Type | Details |
|---------|------|---------|
| Step indicator | `<div>` id=`step-indicator` | Steps: ① Select Customer → ② Add Products → ③ Review Cart. Show progress bar. |
| Title | `<h2>` | "Step 1: Select Customer" |
| Customer search | `<input>` | Search/filter from loaded customer list |
| Customer list | `<div>` radio card list | Each customer as a selectable card: name, phone, address. Radio selection. |
| + Register New | `<button>` | Opens the Add Customer modal (same as Page 3.2) |
| Next button | `<button>` id=`step1-next` | "Next: Add Products →". Disabled until a customer is selected. |

#### Step 3.3.2: Browse & Add Products to Cart
> **APIs**: `POST /orders/{salespersonId}/createCart/{customerId}` (creates empty order), `GET /products` (browse catalog), `GET /products/search?keyword=`, `POST /orders/{productId}/addToCart/{orderId}`

**Flow**: On entering this step, auto-call `createCart` API to get an `orderId`. Then browse products.

| Element | Type | Details |
|---------|------|---------|
| Step indicator | `<div>` | Step 2 highlighted |
| Title | `<h2>` | "Step 2: Add Products" |
| Product search | `<input type="search">` id=`cart-product-search` | Search product catalog. Calls `GET /products/search?keyword=` |
| Product grid | `<div>` card grid id=`product-catalog` | Each product card shows: Name, Weight, Price (₹), Stock available. "Add to Cart" button. |
| Product card | `<div>` | Name, weight badge, ₹ price, stock indicator (green/amber/red), "+ Add" button |
| Add to Cart button | `<button>` per card | Calls `POST /orders/{productId}/addToCart/{orderId}`. Button changes to "✓ Added" with quantity indicator after adding. |
| Out of stock | visual state | Card is dimmed/greyed out if stockQuantity = 0. "Add" button disabled. |
| Cart preview (floating) | `<div>` id=`cart-preview` | **Fixed bottom bar (mobile) / right sidebar panel (desktop)**: Shows item count, running total. "View Cart →" button. |
| Pagination | `<div>` | Browse through product pages |
| Back button | `<button>` | "← Back to Customer Selection" |
| Next button | `<button>` id=`step2-next` | "Review Cart →". Disabled if cart is empty. |

#### Step 3.3.3: Review Cart & Checkout
> **APIs**: `PUT /orders/incrsQty/{orderItemId}`, `PUT /orders/dcrsQty/{orderItemId}`, `PUT /orders/updatestatus/{orderId}` (to CONFIRMED)
> **Future APIs**: `DELETE /orders/removeItem/{orderItemId}`, `PUT /orders/{id}/discount?percent=`

| Element | Type | Details |
|---------|------|---------|
| Step indicator | `<div>` | Step 3 highlighted |
| Title | `<h2>` | "Step 3: Review Order" |
| Customer summary | `<div>` | Selected customer: name, phone |
| Cart items list | `<div>` id=`cart-items` | Each item as a row/card: |
| → Item name | `<span>` | Product name + weight |
| → Unit price | `<span>` | ₹XX.XX |
| → Quantity controls | `<div>` | `−` button (`PUT /orders/dcrsQty/{itemId}`), quantity number, `+` button (`PUT /orders/incrsQty/{itemId}`) |
| → Subtotal | `<span>` | ₹XX.XX (quantity × price) |
| → Remove button (future) | `<button>` | 🗑️ Remove item — `DELETE /orders/removeItem/{itemId}` |
| Discount input (future) | `<input>` id=`discount-percent` | "Apply Discount %" — `PUT /orders/{id}/discount?percent=` |
| Order remarks (future) | `<textarea>` id=`order-remarks` | "Add notes..." |
| Subtotal line | `<div>` | Sum of all item subtotals |
| Discount line (future) | `<div>` | "-₹XX.XX (10%)" |
| **Order Total** | `<div>` id=`order-total` | Bold, large ₹ total |
| Back button | `<button>` | "← Back to Products" |
| Confirm Order button | `<button>` id=`confirm-order` | "Confirm Order ✓" — calls `PUT /orders/updatestatus/{orderId}` with body `{"status": "CONFIRMED"}` |
| Success state | Full-screen overlay | ✅ "Order Confirmed!" with confetti animation. Options: "Create Another Order" or "View My Orders" |

**Responsive Cart**:
- Desktop: Side-by-side layout (product catalog left, cart panel right in Step 2)
- Mobile: Full-screen product browse with floating cart bar at bottom; full-screen cart review in Step 3

---

### Page 3.4: My Orders (`/salesperson/my-orders`)
> **APIs**: `GET /orders/my-orders`, `GET /orders/search-my-orders?customerName=`, `GET /orders/search-my-orders-status?status=`, `PUT /orders/updatestatus/{orderId}`, `PUT /orders/delete-order/{id}`

| Element | Type | Details |
|---------|------|---------|
| Page title | `<h2>` | "My Orders" |
| Search by customer | `<input>` id=`my-orders-search` | Calls `GET /orders/search-my-orders?customerName=` |
| Filter by status | `<select>` / pill tabs id=`my-orders-status-filter` | Pill-shaped tabs: All, Pending, Confirmed, Processing, Delivered, Cancelled. Calls `GET /orders/search-my-orders-status?status=` |
| Orders list | `<div>` id=`my-orders-list` | Each order as a card: |
| → Order date | `<span>` | Formatted date |
| → Status badge | `<span>` | Color-coded status pill |
| → Total | `<span>` | ₹XX.XX |
| → Items count | `<span>` | "X items" |
| → Expand/View | `<button>` | Expands to show OrderItem details (name, qty, price, subtotal) |
| → Update Status | `<select>` or action button | Dropdown to change status: PENDING→CONFIRMED→PROCESSING→DELIVERED. Calls `PUT /orders/updatestatus/{orderId}` with `{"status": "NEW_STATUS"}`. Follows state machine rules. |
| → Delete | `<button>` | 🗑️ Calls `PUT /orders/delete-order/{id}` with confirmation dialog |
| Pagination | `<div>` | Page through orders |
| Empty state | `<div>` | "No orders yet. Create your first order!" with CTA button |

**Order Card Design**: 
- Collapsed: Date | Status badge | Total | Items count | Expand arrow
- Expanded: Full item table + status update + delete actions

---

### Page 3.5: My Profile (`/salesperson/profile`)
> **APIs**: `GET /salesperson/me`, `PATCH /salesperson/me`
> **Future**: `PUT /auth/change-password`

| Element | Type | Details |
|---------|------|---------|
| Page title | `<h2>` | "My Profile" |
| Avatar | `<div>` id=`profile-avatar` | Large circle with initials, gradient background |
| Name field | `<input>` id=`profile-name` | Pre-filled from `GET /salesperson/me`. Editable. Maps to `UpdateProfileRequestDto.name` |
| Email field | `<input>` id=`profile-email` | Pre-filled. **Read-only / disabled** (email can't be changed) |
| Phone field | `<input>` id=`profile-phone` | Pre-filled. Editable. Maps to `UpdateProfileRequestDto.phoneno` |
| Role badge | `<span>` | "SALES_PERSON" — read-only badge |
| Save button | `<button>` id=`profile-save` | "Save Changes" — calls `PATCH /salesperson/me`. Disabled until fields change. |
| Change password section (future) | `<div>` | Old password, new password, confirm new password fields. Calls `PUT /auth/change-password` |

---

## 🧩 FLOW 4 — Shared / Reusable Components

### 4.1: Navigation Guard / Auth Wrapper
| Element | Logic | Details |
|---------|-------|---------|
| Route guard | JS logic | Check for JWT in localStorage on every route. If missing → redirect to `/login`. If expired → redirect to `/login` with "Session expired" message. |
| Role guard | JS logic | Admin routes (`/admin/*`) only accessible to ADMIN role. SalesPerson routes (`/salesperson/*`) only accessible to SALES_PERSON role. Wrong role → redirect to correct dashboard. |

### 4.2: Toast / Notification System
| Element | Type | Details |
|---------|------|---------|
| Toast container | `<div>` id=`toast-container` | Fixed top-right (desktop) / top-center (mobile). Stacks multiple toasts. |
| Success toast | `<div>` | Green accent, ✅ icon, auto-dismiss 3s |
| Error toast | `<div>` | Red accent, ❌ icon, auto-dismiss 5s |
| Warning toast | `<div>` | Amber accent, ⚠️ icon |
| Animation | CSS | Slide-in from right, fade-out |

### 4.3: Loading States
| Element | Type | Details |
|---------|------|---------|
| Full page loader | `<div>` | Centered spinner with app logo pulse animation. Used on initial load / route transitions. |
| Skeleton loaders | `<div>` | Placeholder shimmer rectangles matching table rows / cards. Used while API data loads. |
| Button loading | `<button>` state | Replace text with spinner icon, disable button during API calls |

### 4.4: Pagination Component (Reusable)
| Element | Type | Details |
|---------|------|---------|
| Previous button | `<button>` | "← Prev", disabled on first page |
| Page numbers | `<button>` list | Show current page highlighted. Show max 5 page buttons with ellipsis. |
| Next button | `<button>` | "Next →", disabled on last page |
| Page info | `<span>` | "Showing 1-10 of 57 results" |

### 4.5: Confirmation Dialog (Reusable)
| Element | Type | Details |
|---------|------|---------|
| Backdrop | `<div>` | Semi-transparent dark overlay |
| Dialog card | `<div>` | Centered card with icon, title, message |
| Cancel button | `<button>` | Secondary style |
| Confirm button | `<button>` | Primary or Danger style depending on action |

### 4.6: Empty State Component (Reusable)
| Element | Type | Details |
|---------|------|---------|
| Illustration | `<img>` or SVG | Contextual empty state illustration |
| Title | `<h3>` | E.g., "No products found" |
| Description | `<p>` | E.g., "Add your first product to get started" |
| CTA button | `<button>` | Contextual action button |

---

## 📐 Responsive Design Specification

### Breakpoints
```
Mobile:    < 768px    → Single column, bottom nav, card layouts, full-width modals
Tablet:    768-1023px → 2-column grids, collapsible sidebar, side modals
Desktop:   ≥ 1024px   → Sidebar visible, multi-column grids, table views, side panels
```

### Mobile-Specific Adaptations
| Desktop Element | Mobile Adaptation |
|----------------|-------------------|
| Sidebar navigation | Bottom tab bar (4-5 icons) |
| Data tables | Stacked cards with key info visible |
| Side panels | Full-screen overlays with back button |
| Multi-column forms | Single column, full-width inputs |
| Pagination numbers | Simplified: Prev / Page X of Y / Next |
| Modals (420px card) | Full-screen bottom sheet (slide up) |
| Floating cart panel | Sticky bottom bar with "View Cart (3)" |
| Search + Filter row | Stacked: search on top, filter dropdown below |

### Touch Optimizations (Mobile)
- All tappable elements: minimum 44×44px touch target
- Swipe-to-delete on order/cart items
- Pull-to-refresh on list pages
- Larger quantity +/- buttons in cart (48×48px)

---

## 🔗 Complete API ↔ UI Mapping Reference

### Currently Implemented APIs

| API Endpoint | Method | Role | UI Location |
|-------------|--------|------|-------------|
| `POST /auth/login` | POST | Public | Login page |
| `POST /admin/register` | POST | Public | Register page (Admin tab) |
| `POST /salesperson/register` | POST | Public | Register page (SalesPerson tab) |
| `GET /products` | GET | Both | Admin: Product page / SP: Cart Step 2 |
| `GET /products/search?keyword=` | GET | Both | Product search bar |
| `POST /products/register` | POST | Admin | Add Product modal |
| `PUT /products/update/{id}` | PUT | Admin | Edit Product modal |
| `DELETE /products/{id}` | DELETE | Admin | Delete product dialog |
| `GET /salesperson` | GET | Admin | Salesperson list page |
| `GET /salesperson/search?keyword=` | GET | Admin | Salesperson search |
| `GET /salesperson/me` | GET | SP | My Profile page |
| `PATCH /salesperson/me` | PATCH | SP | My Profile edit |
| `GET /customers` | GET | SP | Customer list + Order Step 1 |
| `POST /customers/register` | POST | SP | Add Customer modal |
| `GET /orders/viewOrders` | GET | Admin | Admin orders page |
| `GET /orders/search?customerName=` | GET | Admin | Admin order search |
| `GET /orders/search-status?status=` | GET | Admin | Admin order status filter |
| `GET /orders/my-orders` | GET | SP | My Orders page + Dashboard |
| `GET /orders/search-my-orders?customerName=` | GET | SP | My Orders search |
| `GET /orders/search-my-orders-status?status=` | GET | SP | My Orders status filter |
| `POST /orders/{spId}/createCart/{custId}` | POST | SP | Cart Step 2 (auto on entry) |
| `POST /orders/{prodId}/addToCart/{orderId}` | POST | SP | Cart Step 2 (Add button) |
| `PUT /orders/incrsQty/{itemId}` | PUT | SP | Cart Step 3 (+ button) |
| `PUT /orders/dcrsQty/{itemId}` | PUT | SP | Cart Step 3 (- button) |
| `PUT /orders/updatestatus/{orderId}` | PUT | SP | Cart Step 3 (Confirm) + My Orders |
| `GET /orders/totalrev` | GET | SP | SP Dashboard stat card |
| `PUT /orders/delete-order/{id}` | PUT | Both | Admin Orders / My Orders |

### Future APIs (Build UI placeholders)

| API Endpoint | Method | Role | UI Location |
|-------------|--------|------|-------------|
| `GET /admin/dashboard` | GET | Admin | Dashboard stat cards |
| `GET /admin/reports/sales?from=&to=` | GET | Admin | Reports page (future) |
| `GET /admin/reports/top-products?limit=` | GET | Admin | Dashboard chart (future) |
| `GET /admin/reports/salesperson-ranking` | GET | Admin | SP page ranking (future) |
| `GET /customers/search?phone=` | GET | SP | Customer search by phone |
| `DELETE /orders/removeItem/{itemId}` | DELETE | SP | Cart remove item button |
| `PUT /orders/{id}/discount?percent=` | PUT | SP | Cart discount input |
| `PUT /auth/change-password` | PUT | Both | Profile change password |
| `PUT /admin/salespersons/{id}/deactivate` | PUT | Admin | SP deactivate button |
| `GET /orders/{id}/invoice` | GET | SP | Order detail invoice |
| `POST /payments` | POST | SP | Payment modal (future) |

---

## 🎨 Design Tokens Quick Reference

```css
/* Colors */
--bg-primary: #0f172a;        /* Deep navy */
--bg-secondary: #1e293b;      /* Slate */
--bg-card: rgba(30, 41, 59, 0.7); /* Glass card */
--accent-primary: #3b82f6;    /* Electric blue */
--accent-success: #10b981;    /* Emerald */
--accent-warning: #f59e0b;    /* Amber */
--accent-danger: #f43f5e;     /* Rose */
--text-primary: #f1f5f9;      /* Near white */
--text-secondary: #94a3b8;    /* Muted slate */
--border: rgba(148, 163, 184, 0.1);

/* Typography */
--font-family: 'Inter', 'Outfit', sans-serif;
--font-size-xs: 0.75rem;
--font-size-sm: 0.875rem;
--font-size-base: 1rem;
--font-size-lg: 1.125rem;
--font-size-xl: 1.25rem;
--font-size-2xl: 1.5rem;
--font-size-3xl: 1.875rem;

/* Spacing */
--space-1: 0.25rem;
--space-2: 0.5rem;
--space-3: 0.75rem;
--space-4: 1rem;
--space-6: 1.5rem;
--space-8: 2rem;

/* Border Radius */
--radius-sm: 0.375rem;
--radius-md: 0.5rem;
--radius-lg: 0.75rem;
--radius-xl: 1rem;
--radius-full: 9999px;

/* Shadows */
--shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
--shadow-md: 0 4px 6px rgba(0,0,0,0.3);
--shadow-lg: 0 10px 15px rgba(0,0,0,0.3);
--shadow-glow: 0 0 20px rgba(59, 130, 246, 0.15);

/* Glass effect */
--glass-bg: rgba(30, 41, 59, 0.6);
--glass-blur: blur(12px);
--glass-border: 1px solid rgba(148, 163, 184, 0.1);

/* Transitions */
--transition-fast: 150ms ease;
--transition-base: 250ms ease;
--transition-slow: 350ms ease;
```

---

## 📱 Page Count Summary

| # | Page | Route | Role |
|---|------|-------|------|
| 1 | Login | `/login` | Public |
| 2 | Register | `/register` | Public |
| 3 | Admin Dashboard | `/admin/dashboard` | Admin |
| 4 | Product Management | `/admin/products` | Admin |
| 5 | Salesperson Management | `/admin/salespersons` | Admin |
| 6 | All Orders (Admin) | `/admin/orders` | Admin |
| 7 | SP Dashboard | `/salesperson/dashboard` | SalesPerson |
| 8 | Customer Management | `/salesperson/customers` | SalesPerson |
| 9 | New Order (Multi-step) | `/salesperson/new-order` | SalesPerson |
| 10 | My Orders | `/salesperson/my-orders` | SalesPerson |
| 11 | My Profile | `/salesperson/profile` | SalesPerson |

**Total: 11 pages + 5 modals + 6 reusable components**
