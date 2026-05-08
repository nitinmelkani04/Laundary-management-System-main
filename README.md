# 🧺 CleanPress — Mini Laundry Order Management System

A full-stack, AI-assisted laundry order management system for dry cleaning stores. Built with Node.js + Express + MongoDB on the backend and React + Vite + TailwindCSS on the frontend.

---

## 📁 Project Structure

```
laundry-system/
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection
│   ├── middleware/
│   │   ├── auth.js                # JWT protect + adminOnly
│   │   └── errorHandler.js        # Global error handler
│   ├── models/
│   │   ├── User.js                # User schema (auth)
│   │   └── Order.js               # Order schema (core)
│   ├── routes/
│   │   ├── auth.js                # /api/auth/*
│   │   └── orders.js              # /api/orders/*
│   ├── .env.example
│   ├── package.json
│   └── server.js                  # Express app entry
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── common/            # Button, Input, Card, Modal, Navbar...
    │   │   ├── dashboard/         # StatCard, StatusChart, GarmentsChart
    │   │   └── orders/            # OrderCard, OrderFilters, CreateOrderForm, UpdateStatusModal
    │   ├── hooks/
    │   │   └── useAuth.jsx        # Auth context + hook
    │   ├── pages/
    │   │   ├── HomePage.jsx       # 5-section landing page
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── OrdersPage.jsx
    │   │   ├── OrderDetailPage.jsx
    │   │   └── CreateOrderPage.jsx
    │   ├── styles/
    │   │   └── globals.css        # Design tokens + utility classes
    │   ├── utils/
    │   │   └── api.js             # Axios instance + API methods
    │   ├── App.jsx                # Routes + auth guards
    │   └── main.jsx               # React root
    ├── index.html
    ├── tailwind.config.js
    └── vite.config.js
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/YOUR_USERNAME/laundry-system.git
cd laundry-system
```

### 2. Backend setup
```bash
cd backend
npm install

# Copy env template and fill in your values
cp .env.example .env
```

Edit `.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://YOUR_USER:YOUR_PASS@YOUR_CLUSTER.mongodb.net/laundry_db
JWT_SECRET=any_long_random_string_here
NODE_ENV=development
CLIENT_URL=http://localhost:3000
```

```bash
npm run dev        # starts with nodemon on port 5000
```

### 3. Frontend setup
```bash
cd ../frontend
npm install
npm run dev        # starts Vite on port 3000
```

Open **http://localhost:3000** in your browser.

> The Vite dev server proxies `/api` requests to `http://localhost:5000` — no CORS issues.

---

## ✅ Features Implemented

### Core
| Feature | Status |
|---|---|
| Create order (customer + garments + qty) | ✅ |
| Auto-calculate total bill | ✅ |
| Unique Order ID (ORD-XXXXXXXX) | ✅ |
| Order status: RECEIVED → PROCESSING → READY → DELIVERED | ✅ |
| Status history / audit trail | ✅ |
| List all orders | ✅ |
| Filter by status, customer name/phone, garment type | ✅ |
| Dashboard: total orders, revenue, orders per status | ✅ |
| Pagination (10 per page) | ✅ |

### Bonus
| Feature | Status |
|---|---|
| React frontend with beautiful dark UI | ✅ |
| JWT authentication (register/login) | ✅ |
| Role support (admin/staff) | ✅ |
| MongoDB storage | ✅ |
| Search by garment type | ✅ |
| Estimated delivery date (auto: +3 days) | ✅ |
| Recharts dashboard visualizations | ✅ |
| Fully responsive (mobile + desktop) | ✅ |

---

## 🤖 AI Usage Report

### Tools Used
- **Claude (Anthropic)** — primary AI used for scaffolding, architecture, and code generation

### Sample Prompts Used

**Prompt 1 — Backend scaffold:**
> "Build a Node.js + Express + MongoDB backend for a laundry order management system. Include: User model with bcrypt auth, Order model with garment schema and auto-calculated billing, JWT middleware, CRUD routes with filtering/pagination, and a dashboard aggregate query."

*What AI got right:* Mongoose schema structure, aggregate queries for dashboard stats, error handler middleware pattern.

*What I fixed:* AI initially put garment prices inline in the route handler — I moved them to `Order.statics.GARMENT_PRICES` so they're accessible from both routes and the frontend's price-fetch endpoint without duplication.

**Prompt 2 — React component architecture:**
> "Create a reusable React component library for a dark-themed laundry management dashboard. Components: Button (variants: primary/secondary/danger/ghost), Input (with icon support), Select (custom styled), Card, StatusBadge (with animated dot per status), Modal."

*What AI got right:* Variant pattern for Button, CSS variable theming, prop interface design.

*What I fixed:* The Select component AI generated used native `<select>` which didn't inherit the dark background properly on Chrome. Fixed with explicit `bg-[#1a1a2e]` fallback and custom SVG arrow via background-image.

**Prompt 3 — Dashboard aggregations:**
> "Write MongoDB aggregate pipelines for: total revenue sum, order count per status, top 5 garment types by quantity cleaned, and recent 5 orders."

*What AI got right:* `$unwind` + `$group` pattern for garments, `$sort` + `$limit`.

*What I fixed:* AI returned `ordersPerStatus` as an array `[{_id: "RECEIVED", count: 3}]` — I converted it to an object map `{ RECEIVED: 3, ... }` in the route so the frontend could access it as `data.RECEIVED` instead of `.find()`.

**Prompt 4 — Frontend auth context:**
> "Create a React auth context with localStorage persistence for JWT token, login/register/logout functions, and a custom useAuth hook."

*What AI got right:* Context + Provider pattern, localStorage read on init.

*What I fixed:* AI wrapped the initial localStorage read in `useState(() => {...})` without a try/catch — added one to handle malformed JSON gracefully.

### Overall Assessment
AI was most valuable for: boilerplate code, repetitive component variants, Mongoose schema syntax, and aggregate pipeline structure. Human judgment was needed for: architectural decisions (where does pricing logic live?), UX edge cases (what happens on 401?), and making sure all the pieces connected correctly end-to-end.

---

## ⚖️ Tradeoffs

### What I skipped
- Unit tests (would add Jest + Supertest for routes)
- Email/SMS notifications on status change
- Image upload per garment
- Print/PDF bill generation

### What I'd improve with more time
- WebSocket real-time status updates instead of polling
- Role-based UI differences (staff can't delete orders)
- Customer-facing order tracking page (public, no auth)
- Deployment via Railway (backend) + Vercel (frontend)
- Rate limiting on auth routes

---

## 📮 API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login, get JWT |
| GET | `/api/auth/me` | Get current user |

### Orders (all require `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | List orders (supports `?status=RECEIVED&search=rahul&garmentType=Shirt&page=1&limit=10`) |
| POST | `/api/orders` | Create order |
| GET | `/api/orders/:id` | Get single order |
| PATCH | `/api/orders/:id/status` | Update status |
| DELETE | `/api/orders/:id` | Delete order |
| GET | `/api/orders/dashboard` | Dashboard stats |
| GET | `/api/orders/garment-prices` | Get configured prices |

### Sample Create Order Body
```json
{
  "customerName": "Rahul Sharma",
  "phoneNumber": "9876543210",
  "garments": [
    { "type": "Shirt", "quantity": 3 },
    { "type": "Pants", "quantity": 2 },
    { "type": "Saree", "quantity": 1 }
  ],
  "specialInstructions": "Handle saree with care"
}
```

### Sample Response
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "order": {
      "orderId": "ORD-A3F7B2C1",
      "customerName": "Rahul Sharma",
      "phoneNumber": "9876543210",
      "totalAmount": 430,
      "status": "RECEIVED",
      "estimatedDelivery": "2024-01-18T00:00:00.000Z"
    }
  }
}
```

---

## 🎨 Design Decisions

- **Dark luxury theme** — charcoal + gold palette feels premium without being flashy. Suits a service business that wants to look professional.
- **Playfair Display** for headings (editorial, trustworthy), **DM Sans** for body (clean, readable), **JetBrains Mono** for IDs and numbers (technical precision).
- **Glass morphism cards** with subtle gold borders — depth without heavy drop shadows.
- **Recharts** for dashboard charts — lightweight, composable, SSR-safe.
- **React Query** for server state — handles caching, refetching, and loading states so I didn't have to write useEffect boilerplate.
