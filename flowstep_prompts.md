# FlowStep AI Prompts — Sale Entry App (Copy-Paste Ready)

> **How to use**: Copy each prompt below one at a time into [FlowStep AI](https://app.flowstep.ai/welcome). Generate the design, review it, then move to the next prompt. They are ordered by user flow.

---

## 🔖 Design System Context (Include this at the START of every prompt)

> Copy the block below and paste it **before** each page-specific prompt so FlowStep keeps the design consistent across all pages.

```
DESIGN SYSTEM:
App name: "SaleEntry". 
Style: Modern, premium, dark-mode with glassmorphism. 
Background: Deep navy (#0f172a) with subtle gradient to (#1e293b). 
Primary accent: Electric blue (#3b82f6). 
Success: Emerald (#10b981). Warning: Amber (#f59e0b). Danger: Rose (#f43f5e). 
Text: Near-white (#f1f5f9) primary, muted slate (#94a3b8) secondary. 
Font: Inter or Outfit. 
Cards: Semi-transparent background rgba(30,41,59,0.7) with backdrop-blur and subtle border rgba(148,163,184,0.1). 
Buttons: Rounded (8px radius), filled primary buttons with blue gradient, ghost/outlined secondary buttons. 
Inputs: Dark filled inputs with subtle border, focus state glows blue. 
Micro-animations: Hover lift on cards, smooth transitions. 
Design BOTH desktop (1440px) and mobile (390px) versions side by side.
```

---

## Prompt 1 of 13 — Login Page

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: Login Page

Design a login page for "SaleEntry" — a sales and order management app.

LAYOUT: Centered vertically and horizontally on the page. Single glassmorphism card (max-width 420px) floating on the gradient background.

ELEMENTS inside the card (top to bottom):
1. App logo/icon at the top — a simple shopping bag or receipt icon with blue gradient
2. Title: "SaleEntry" in large bold text with subtle gradient text effect
3. Tagline below: "Manage your sales, orders & inventory" in muted text
4. Spacer
5. Input field: "Enter your username" — text input with user icon on left
6. Input field: "Enter your password" — password input with lock icon on left, eye toggle icon on right to show/hide password
7. "Sign In" button — full-width, filled blue gradient, rounded, bold text
8. Divider line with "or" text
9. Link text: "Don't have an account? Register here" — blue accent color link

STATES to show:
- Default state (empty form)
- Optional: Error state with red border on inputs and toast notification "Invalid credentials" at top-right

Show BOTH desktop (centered on large screen) and mobile (card takes full width with padding) versions.
```

---

## Prompt 2 of 13 — Registration Page

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: Registration Page

Design a registration page for "SaleEntry" app. Same card style as the login page.

LAYOUT: Centered glassmorphism card (max-width 460px) on gradient background.

ELEMENTS inside the card (top to bottom):
1. Title: "Create Account" — large bold heading
2. Subtitle: "Join SaleEntry to start managing sales" — muted text
3. Role toggle selector — two pill-shaped toggle buttons side by side: "Admin" and "Sales Person". The active one is filled blue, inactive is ghost/outlined. This toggle changes which form fields appear below.
4. Input: "Full Name" — text input with person icon
5. Input: "Email Address" — email input with mail icon
6. Input: "Password" — password input with lock icon, eye toggle
7. Input: "Confirm Password" — password input with lock icon
8. Input: "Phone Number" — ONLY visible when "Sales Person" role is selected. Phone icon, placeholder "10-digit phone number"
9. "Create Account" button — full-width filled blue gradient button
10. Link: "Already have an account? Sign In" — blue link

Show TWO VARIATIONS:
- Variation A: "Admin" role selected (no phone field visible)
- Variation B: "Sales Person" role selected (phone field visible)

Show both desktop and mobile layouts.
```

---

## Prompt 3 of 13 — Admin Sidebar Layout Shell

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: Admin Dashboard Layout Shell (empty content area)

Design the main layout shell/frame for the Admin panel of "SaleEntry" app. This layout wraps all admin pages.

DESKTOP LAYOUT (1440px):
- Left sidebar (width 260px), dark background slightly lighter than page (#1e293b), full height
- Sidebar contents (top to bottom):
  1. App logo + "SaleEntry" title at top with padding
  2. "ADMIN PANEL" label in small uppercase muted text
  3. Navigation links (vertically stacked, full-width):
     - 📊 Dashboard (active state: blue left border, blue background tint, white text)
     - 📦 Products
     - 👥 Salespersons
     - 📋 Orders
     Each nav link has icon + label, hover: subtle blue tint
  4. Spacer (push logout to bottom)
  5. User info section at bottom: Avatar circle with initials "AD", name "Admin User", role badge "ADMIN" in small blue pill
  6. "Logout" button — red tinted ghost button with logout icon
- Right main content area: Takes remaining width. Has a top header bar with page title "Dashboard" and breadcrumbs. Content area below is scrollable with padding.

MOBILE LAYOUT (390px):
- No sidebar. Instead, show a fixed bottom navigation bar with 4 icons:
  📊 Dashboard | 📦 Products | 👥 Salespersons | 📋 Orders
  Active icon is blue, others are muted. Each has icon + small label below.
- Top: Simple header bar with hamburger menu icon, "SaleEntry" title center, user avatar right.
- Content area fills the screen between header and bottom nav.

Show both layouts side by side.
```

---

## Prompt 4 of 13 — Admin Dashboard Home

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: Admin Dashboard Home (inside the admin sidebar layout)

Design the dashboard home page for the Admin. This is the first page admin sees after login.

ELEMENTS (top to bottom):
1. Welcome banner: "Welcome back, Admin 👋" with today's date below in muted text. Subtle gradient background strip.

2. Stats cards row — 4 glassmorphism cards in a horizontal row:
   - Card 1: Blue gradient icon circle with 📦 icon, label "Total Products", large bold number "156", small "+12 this week" in green text
   - Card 2: Purple gradient icon circle with 📋 icon, label "Total Orders", number "1,247"
   - Card 3: Emerald gradient icon circle with 👥 icon, label "Salespersons", number "24"
   - Card 4: Amber gradient icon circle with 💰 icon, label "Total Revenue", number "₹4,52,300"
   Each card: hover lift effect, subtle glow shadow

3. Quick Actions section: Row of 3 action buttons/cards:
   - "+ Add Product" (blue outline)
   - "View Orders" (blue outline)
   - "View Salespersons" (blue outline)

4. (Optional) Placeholder chart area: A simple empty state card saying "Sales Analytics — Coming Soon" with a chart illustration placeholder.

RESPONSIVE:
- Desktop: 4 stat cards in one row, quick actions in one row
- Tablet: Stat cards in 2x2 grid
- Mobile: Stat cards stacked vertically (single column), quick actions stacked
```

---

## Prompt 5 of 13 — Admin Product Management Page

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: Admin — Product Management (inside admin sidebar layout)

Design the product catalog management page for the admin.

LAYOUT (top to bottom):
1. Page header row:
   - Left: Title "Product Catalog" with subtitle "Manage your inventory"
   - Right: "+ Add Product" button (filled blue, with plus icon)

2. Search and filter bar:
   - Search input (full width on mobile, 400px on desktop): "Search products by name..." with search icon
   
3. Product data table (DESKTOP):
   - Table with columns: Product Name | Weight | Price (₹) | Stock | Status | Actions
   - Sample rows:
     Row 1: "Basmati Rice" | "5 kg" | "₹450.00" | "85" | Green badge "In Stock" | Edit pencil icon + Delete trash icon
     Row 2: "Toor Dal" | "1 kg" | "₹180.00" | "8" | Amber badge "Low Stock" | Edit + Delete
     Row 3: "Sugar" | "2 kg" | "₹90.00" | "0" | Red badge "Out of Stock" | Edit + Delete
     Row 4: "Wheat Flour" | "10 kg" | "₹520.00" | "42" | Green badge "In Stock" | Edit + Delete
   - Table rows have subtle hover highlight
   - Alternating subtle row backgrounds

4. Product cards (MOBILE):
   - Same data but as stacked cards. Each card shows: Product name (bold), weight badge, price, stock with colored indicator, edit/delete icons in a row at bottom

5. Pagination bar at bottom: "Showing 1-10 of 57" | Previous | 1 | 2 | 3 | ... | 6 | Next

6. Also design the "Add/Edit Product" MODAL overlay:
   - Dark backdrop with blur
   - Centered card (max-width 480px), slides up on mobile
   - Title: "Add New Product" 
   - Input: "Product Name" (text)
   - Input: "Weight" (text, placeholder "e.g., 5 kg")
   - Input: "Price (₹)" (number, with ₹ prefix icon)
   - Input: "Stock Quantity" (number)
   - Two buttons at bottom: "Cancel" (ghost) and "Save Product" (filled blue)

Show desktop table view AND mobile card view AND the modal.
```

---

## Prompt 6 of 13 — Admin Salesperson Management Page

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: Admin — Salesperson Management (inside admin sidebar layout)

Design the salesperson listing page for the admin.

LAYOUT:
1. Page header:
   - Title: "Salespersons" with subtitle "View and manage your sales team"

2. Search bar: "Search by name..." with search icon (same style as products page)

3. Salesperson table (DESKTOP):
   - Columns: Avatar | Name | Email | Phone | Status | Actions
   - Sample rows:
     Row 1: Circle avatar "NK" (blue gradient) | "Nidhi Kumar" | "nidhi@email.com" | "9876543210" | Green badge "Active" | View eye icon
     Row 2: Circle avatar "RS" (purple gradient) | "Raj Sharma" | "raj@email.com" | "9123456780" | Green badge "Active" | View eye icon
     Row 3: Circle avatar "UP" (emerald gradient) | "Urva Patel" | "urva@email.com" | "9988776655" | Green badge "Active" | View eye icon

4. Salesperson cards (MOBILE):
   - Each card: Large initial avatar circle, name bold, email below in muted, phone with phone icon, "Active" badge, tap to view

5. Pagination at bottom

6. Also design a "Salesperson Detail" SLIDE-IN PANEL (from right on desktop, full screen on mobile):
   - Large avatar circle with initials and gradient
   - Name (large heading)
   - Email with copy icon
   - Phone number
   - Status badge
   - Stats section (placeholder): "Total Orders: 47" | "Revenue: ₹1,23,400" | "Active Orders: 5"
   - "Deactivate" button (red outline, future feature) at bottom

Show desktop, mobile, and the detail panel.
```

---

## Prompt 7 of 13 — Admin All Orders Page

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: Admin — All Orders Management (inside admin sidebar layout)

Design the orders management page where admin can view ALL orders in the system.

LAYOUT:
1. Page header: Title "All Orders" with subtitle "Monitor all sales orders"

2. Filter bar (horizontal on desktop, stacked on mobile):
   - Search input: "Search by customer name..." with search icon
   - Status filter dropdown/pill tabs: All | Pending | Confirmed | Processing | Delivered | Cancelled
     - "All" is active by default (filled blue pill)
     - Others are ghost pills, clicking switches the active one

3. Orders table (DESKTOP):
   - Columns: Order Date | Customer | Items | Status | Total (₹) | Actions
   - Sample rows:
     Row 1: "12 Jun 2026" | "Rahul Mehta" | "3 items" | Amber pill "PENDING" | "₹1,250.00" | View eye icon + Delete trash icon
     Row 2: "11 Jun 2026" | "Priya Singh" | "5 items" | Green pill "DELIVERED" | "₹3,780.00" | View + Delete
     Row 3: "10 Jun 2026" | "Amit Patel" | "2 items" | Blue pill "CONFIRMED" | "₹890.00" | View + Delete
     Row 4: "09 Jun 2026" | "Sneha Reddy" | "1 item" | Red pill "CANCELLED" | "₹450.00" | View + Delete
   - Status badge colors: PENDING=amber, CONFIRMED=blue, PROCESSING=purple, DELIVERED=green, CANCELLED=red

4. Orders cards (MOBILE):
   - Each card: Date at top-right muted, Customer name bold, status badge, total ₹ amount large, "X items" tag, expand arrow

5. Order detail EXPANDED VIEW (accordion expand or side panel):
   - Order info: Date, Status, Customer name
   - Items table: Product Name | Qty | Unit Price | Subtotal
     - "Basmati Rice 5kg" | 2 | ₹450.00 | ₹900.00
     - "Toor Dal 1kg" | 3 | ₹180.00 | ₹540.00
   - Total line bold: "Order Total: ₹1,440.00"
   - "Delete Order" button (red outline)

6. Pagination at bottom

Show desktop with table, mobile with cards, and the expanded order detail view.
```

---

## Prompt 8 of 13 — SalesPerson Layout Shell + Dashboard

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: SalesPerson Dashboard (with layout shell)

Design the SalesPerson's main layout and dashboard home page.

LAYOUT SHELL (same concept as admin but different nav items):
DESKTOP: Left sidebar (260px):
  - Logo + "SaleEntry" 
  - "SALES PANEL" label
  - Nav links: 🏠 Dashboard (active) | 👤 Customers | 🛒 New Order | 📋 My Orders | 👤 Profile
  - User info: Avatar "NK", "Nidhi Kumar", badge "SALESPERSON"
  - Logout button

MOBILE: Bottom nav with 5 icons: 🏠 | 👤 | 🛒 | 📋 | 👤

DASHBOARD CONTENT:
1. Welcome banner: "Welcome back, Nidhi 👋" with date

2. Stats cards row — 3 cards:
   - Card 1: 📋 "My Orders" — "23" with blue gradient icon
   - Card 2: 💰 "My Revenue" — "₹1,85,400" with emerald gradient icon
   - Card 3: ⏳ "Pending Orders" — "5" with amber gradient icon

3. Quick Actions: "Create New Order" (large filled blue button with cart icon) | "View Customers" | "My Profile"

4. Recent Orders section:
   - Section title: "Recent Orders" with "View All →" link
   - List of 3-4 recent order cards (compact):
     - "Rahul Mehta — 3 items — ₹1,250 — PENDING (amber badge) — 12 Jun"
     - "Priya Singh — 5 items — ₹3,780 — DELIVERED (green badge) — 11 Jun"
     - "Amit Patel — 2 items — ₹890 — CONFIRMED (blue badge) — 10 Jun"

RESPONSIVE:
- Desktop: 3 stat cards in row, recent orders as list
- Mobile: Stat cards stacked, recent orders as compact cards

Show both desktop and mobile.
```

---

## Prompt 9 of 13 — SalesPerson Customer Management

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: SalesPerson — Customer Management (inside salesperson layout)

Design the customer list and registration page for the salesperson.

LAYOUT:
1. Page header:
   - Left: "My Customers" title + subtitle "Manage your customer base"
   - Right: "+ Add Customer" button (filled blue)

2. Search bar: "Search customers..." with search icon

3. Customer card grid:
   - Desktop: 3 cards per row
   - Tablet: 2 per row
   - Mobile: 1 per row (stacked)
   
   Each customer card (glassmorphism):
   - Large avatar circle with initials and random gradient (blue, purple, emerald, amber)
   - Customer name (bold, large)
   - Phone number with phone icon 📱
   - Address (truncated to 1 line with "..." overflow) with location pin icon 📍
   - Subtle hover: lift + blue border glow

   Sample cards:
   - "Rahul Mehta" | "9876543210" | "45, MG Road, Mumbai..."
   - "Priya Singh" | "9123456780" | "12, Nehru Nagar, Delhi..."
   - "Amit Patel" | "9988776655" | "78, SG Highway, Ahmedabad..."
   - "Sneha Reddy" | "8877665544" | "23, Jubilee Hills, Hyderabad..."

4. Empty state (when no customers): Illustration of a person with a plus icon, title "No customers yet", subtitle "Register your first customer to get started", button "Register Customer"

5. "Register Customer" MODAL:
   - Title: "Register New Customer"
   - Input: "Customer Name" (text, required)
   - Input: "Address" (textarea, 3 rows, required)
   - Input: "Phone Number" (tel, placeholder "10-digit phone number", required)
   - Buttons: "Cancel" (ghost) | "Register Customer" (filled blue)

Show desktop card grid, mobile stacked cards, and the modal.
```

---

## Prompt 10 of 13 — New Order: Step 1 (Select Customer)

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: SalesPerson — New Order Step 1: Select Customer (inside salesperson layout)

Design the first step of the multi-step order creation flow.

LAYOUT:
1. Step progress indicator at top:
   - 3 connected steps in a horizontal line:
     ● Step 1: "Select Customer" (ACTIVE — blue filled circle, blue text, blue connecting line to left)
     ○ Step 2: "Add Products" (UPCOMING — muted circle, muted text)
     ○ Step 3: "Review Order" (UPCOMING — muted circle, muted text)
   - Steps connected by a line/track. Active step has filled circle, upcoming has empty circle.

2. Title: "Select a Customer" with subtitle "Choose a customer for this order"

3. Search input: "Search customers by name..." to filter the list below

4. Customer selection list — radio-style selectable cards:
   - Each card has a radio circle on the left edge
   - When selected: Blue border, blue radio filled, subtle blue background tint
   - When unselected: Default border, empty radio circle
   - Card content: Avatar (initials), Name (bold), Phone, Address (truncated)
   
   Sample:
   - ○ "Rahul Mehta" | 📱 9876543210 | 📍 45, MG Road, Mumbai
   - ● "Priya Singh" (SELECTED — blue border, filled radio) | 📱 9123456780 | 📍 12, Nehru Nagar, Delhi
   - ○ "Amit Patel" | 📱 9988776655 | 📍 78, SG Highway, Ahmedabad

5. "+ Register New Customer" button — ghost blue button with plus icon. Opens the customer registration modal.

6. Bottom action bar (sticky at bottom):
   - Left: "Cancel" ghost button
   - Right: "Next: Add Products →" filled blue button (DISABLED/greyed out if no customer selected, ACTIVE blue when selected)

RESPONSIVE:
- Desktop: Cards in a single column (max-width 700px centered)
- Mobile: Full-width cards, sticky bottom button bar

Show both desktop and mobile with one customer selected.
```

---

## Prompt 11 of 13 — New Order: Step 2 (Add Products to Cart)

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: SalesPerson — New Order Step 2: Add Products to Cart (inside salesperson layout)

Design the product browsing and cart-adding step.

LAYOUT:
1. Step indicator: Step 2 "Add Products" is ACTIVE (blue), Step 1 is COMPLETED (green checkmark), Step 3 is UPCOMING (muted)

2. Selected customer info banner: Small info bar showing "Customer: Priya Singh — 📱 9123456780" with "Change" link

DESKTOP LAYOUT (split view):
- LEFT SIDE (60% width): Product catalog
  - Search input: "Search products..."
  - Product grid (2 columns):
    Each product card:
    - Product name bold (e.g., "Basmati Rice")
    - Weight badge pill (e.g., "5 kg" in small muted pill)
    - Price: "₹450.00" in large text
    - Stock indicator: Green dot + "85 in stock" OR Amber dot + "8 left" OR Red dot + "Out of stock"
    - "Add to Cart" button (blue outline). After adding → button changes to "✓ Added" (green filled) with a small "x1" quantity badge
    - If out of stock: Card is slightly dimmed/opacity, button is disabled grey "Out of Stock"
  - Pagination at bottom of product grid

- RIGHT SIDE (40% width): Cart preview panel (sticky)
  - Panel title: "Cart" with item count badge "3 items"
  - List of added items (compact):
    - "Basmati Rice 5kg — ₹450 × 1"
    - "Toor Dal 1kg — ₹180 × 2"
    - "Sugar 2kg — ₹90 × 1"
  - Running total: "Total: ₹900.00" bold
  - "Review Order →" button (filled blue, full width of panel)

MOBILE LAYOUT:
- Full screen product grid (single column cards)
- Floating bottom bar (sticky): "🛒 Cart (3 items) — ₹900 | View Cart →" — tapping opens full-screen cart overlay
- No side panel on mobile

Show both desktop split-view and mobile with floating cart bar.
```

---

## Prompt 12 of 13 — New Order: Step 3 (Review & Confirm)

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: SalesPerson — New Order Step 3: Review & Confirm Order (inside salesperson layout)

Design the cart review page where the salesperson adjusts quantities and confirms the order.

LAYOUT:
1. Step indicator: Step 1 ✓ (green), Step 2 ✓ (green), Step 3 "Review Order" ACTIVE (blue)

2. Customer info card: "Priya Singh — 📱 9123456780 — 📍 12, Nehru Nagar, Delhi"

3. Cart items list — each item as a row/card:
   For each item:
   - Left: Product name + weight (e.g., "Basmati Rice — 5 kg")
   - Center: Quantity controls — circular "−" button, quantity number "2" in the middle, circular "+" button. Buttons are 44px touch targets.
   - Right side: 
     - Unit price muted: "₹450.00 each"
     - Subtotal bold: "₹900.00"
   - Far right: 🗑️ Remove icon button (red on hover)
   
   Sample items:
   - "Basmati Rice — 5 kg" | [-] 2 [+] | ₹450 each | ₹900.00 | 🗑️
   - "Toor Dal — 1 kg" | [-] 3 [+] | ₹180 each | ₹540.00 | 🗑️
   - "Sugar — 2 kg" | [-] 1 [+] | ₹90 each | ₹90.00 | 🗑️

4. Order summary section (card at bottom):
   - Line: "Subtotal (6 items)" → "₹1,530.00"
   - Line: "Discount" → "₹0.00" with "Apply Discount" blue link (future feature)
   - Divider line
   - Line: "Order Total" → "₹1,530.00" (large, bold, blue-tinted)

5. Order remarks (future): Muted textarea placeholder "Add notes or special instructions..."

6. Bottom action bar:
   - Left: "← Back to Products" ghost button
   - Right: "Confirm Order ✓" large filled green/emerald button

7. ALSO design a SUCCESS overlay (shown after confirming):
   - Full-screen overlay with backdrop blur
   - Centered card with:
     - Large green checkmark icon with pulse animation
     - "Order Confirmed!" heading
     - "Order total: ₹1,530.00" subtitle
     - Two buttons: "Create Another Order" (blue outline) | "View My Orders" (filled blue)

RESPONSIVE:
- Desktop: Items as horizontal rows, summary on right or below
- Mobile: Items as stacked cards, quantity controls full-width, bottom bar sticky

Show desktop, mobile, AND the success overlay.
```

---

## Prompt 13 of 13 — SalesPerson My Orders + Profile

```
[PASTE DESIGN SYSTEM BLOCK ABOVE HERE]

PAGE: Two screens — SalesPerson "My Orders" page AND "My Profile" page

--- SCREEN A: MY ORDERS PAGE ---

1. Page header: "My Orders" + subtitle "Track and manage your sales orders"

2. Filter bar:
   - Search input: "Search by customer name..."
   - Status filter pills (horizontal scrollable on mobile): All (active blue) | Pending | Confirmed | Processing | Delivered | Cancelled

3. Order cards list (each order is a card):
   Each card:
   - Top row: Order date left ("12 Jun 2026"), Status badge right (colored pill)
   - Middle: Customer name bold, "3 items" tag
   - Bottom row: Total "₹1,250.00" bold left, Action buttons right: "View" eye icon, "Update Status" dropdown icon, "Delete" trash icon
   - Expanded state (when View clicked): Shows items table — Product | Qty | Price | Subtotal
   - Status update: Small dropdown/select that shows valid next statuses (e.g., PENDING → CONFIRMED or CANCELLED)

   Sample cards:
   - "12 Jun" | PENDING (amber) | "Rahul Mehta — 3 items" | ₹1,250
   - "11 Jun" | DELIVERED (green) | "Priya Singh — 5 items" | ₹3,780
   - "10 Jun" | CONFIRMED (blue) | "Amit Patel — 2 items" | ₹890

4. Pagination at bottom
5. Empty state: "No orders yet. Create your first order!" with "Create Order" button

--- SCREEN B: MY PROFILE PAGE ---

1. Page header: "My Profile"

2. Profile card (large, centered, max-width 500px):
   - Large avatar circle (80px) with initials "NK" and blue-to-purple gradient background
   - Name: "Nidhi Kumar" large heading
   - Role badge: "SALESPERSON" small blue pill

3. Editable form fields below:
   - "Full Name" — text input, pre-filled "Nidhi Kumar", editable
   - "Email" — email input, pre-filled "nidhi@email.com", DISABLED/read-only with lock icon and tooltip "Email cannot be changed"
   - "Phone Number" — tel input, pre-filled "9876543210", editable

4. "Save Changes" button (filled blue, disabled/greyed when no changes detected, active blue when fields modified)

5. Change Password section (future feature):
   - Divider with "Security" label
   - Muted card: "Change Password" with a "Coming Soon" badge

Show My Orders (desktop + mobile) and My Profile (desktop + mobile) — 4 screens total.
```

---

## ✅ Prompt Execution Order Checklist

Use this to track your progress:

| # | Prompt | Page | Status |
|---|--------|------|--------|
| 1 | Login Page | `/login` | ⬜ |
| 2 | Registration Page | `/register` | ⬜ |
| 3 | Admin Layout Shell | `/admin/*` sidebar | ⬜ |
| 4 | Admin Dashboard | `/admin/dashboard` | ⬜ |
| 5 | Admin Products | `/admin/products` | ⬜ |
| 6 | Admin Salespersons | `/admin/salespersons` | ⬜ |
| 7 | Admin Orders | `/admin/orders` | ⬜ |
| 8 | SP Layout + Dashboard | `/salesperson/dashboard` | ⬜ |
| 9 | SP Customers | `/salesperson/customers` | ⬜ |
| 10 | New Order: Step 1 | `/salesperson/new-order` (customer) | ⬜ |
| 11 | New Order: Step 2 | `/salesperson/new-order` (products) | ⬜ |
| 12 | New Order: Step 3 | `/salesperson/new-order` (review) | ⬜ |
| 13 | My Orders + Profile | `/salesperson/my-orders` + `/profile` | ⬜ |

> [!TIP]
> **Always paste the Design System block at the top of each prompt** to keep colors, fonts, and styling consistent across all generated designs.

> [!IMPORTANT]
> After generating all designs in FlowStep, you can export them and share them with me. I'll use them as reference to build the actual React + CSS frontend that connects to your Spring Boot backend APIs.
