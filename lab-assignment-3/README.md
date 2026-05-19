# Auth System — Integration Guide

Complete User Authentication & Role-Based Access Control for the Ralph Lauren PK project.

---

## What's Included

| File | Description |
|------|-------------|
| `models/User.js` | Mongoose schema with bcrypt password hashing |
| `middleware/authMiddleware.js` | `isLoggedIn` + `isAdmin` guards |
| `controllers/authController.js` | Register / Login / Logout logic |
| `routes/authRoutes.js` | `/auth/register`, `/auth/login`, `/auth/logout` |
| `routes/adminRoutes.js` | **Updated** — uses `isAdmin` instead of old `checkAdminAuth` |
| `controllers/adminController.js` | **Updated** — flash messages wired in |
| `server.js` | **Updated** — connect-mongo, connect-flash, `res.locals` middleware |
| `package.json` | **Updated** — adds `bcryptjs`, `connect-flash`, `connect-mongo` |
| `views/auth/login.ejs` | User sign-in page |
| `views/auth/register.ejs` | New account page |
| `views/partials/navbar.ejs` | **Updated** — dynamic auth links |
| `views/partials/flash.ejs` | **New** — reusable flash message partial |
| `views/admin/dashboard.ejs` | **Updated** — flash messages + currentUser in sidebar |
| `seed/seedAdmin.js` | One-time script to create the admin account |

---

## Step 1 — Install New Dependencies

```bash
npm install bcryptjs connect-flash connect-mongo
```

---

## Step 2 — Drop In the Files

Copy every file into your project, maintaining the existing folder structure:

```
your-project/
├── models/
│   ├── Product.js          (unchanged)
│   └── User.js             ← NEW
├── middleware/
│   ├── adminAuth.js        (can be deleted — no longer used)
│   └── authMiddleware.js   ← NEW (replaces adminAuth.js)
├── controllers/
│   ├── adminController.js  ← REPLACE
│   ├── authController.js   ← NEW
│   └── productController.js (unchanged)
├── routes/
│   ├── adminRoutes.js      ← REPLACE
│   ├── authRoutes.js       ← NEW
│   └── productRoutes.js    (unchanged)
├── views/
│   ├── auth/
│   │   ├── login.ejs       ← NEW  (user login — not admin-only)
│   │   └── register.ejs    ← NEW
│   ├── admin/
│   │   └── dashboard.ejs   ← REPLACE
│   └── partials/
│       ├── flash.ejs       ← NEW  (include this in every page)
│       └── navbar.ejs      ← REPLACE
├── seed/
│   ├── seed.js             (unchanged)
│   └── seedAdmin.js        ← NEW
├── package.json            ← REPLACE
└── server.js               ← REPLACE
```

---

## Step 3 — Update Your Existing Views

### Add flash messages to every page body

In every EJS page that already has `<%- include('../partials/head') %>`, add the flash partial
right after the navbar include:

```ejs
<%- include('../partials/head') %>
<%- include('../partials/navbar') %>
<%- include('../partials/flash') %>   ← ADD THIS LINE
```

### Replace the old admin login view

The old `views/admin/login.ejs` (password-only form) is now replaced by `views/auth/login.ejs`.
You can delete `views/admin/login.ejs` — the redirect in `adminRoutes.js` handles old bookmarks.

---

## Step 4 — Create the Admin User

```bash
node seed/seedAdmin.js
```

Default credentials created:
- **Email:** `admin@ralphlauren.pk`
- **Password:** `admin123`

To use custom credentials:

```bash
ADMIN_EMAIL=you@domain.com ADMIN_PASS=securepass node seed/seedAdmin.js
```

---

## Step 5 — Run the App

```bash
npm run dev
```

---

## How It Works

### User flows

| URL | What happens |
|-----|-------------|
| `GET /auth/register` | Registration form |
| `POST /auth/register` | Creates user, auto-logs in, redirects `/` |
| `GET /auth/login` | Login form |
| `POST /auth/login` | Verifies credentials, starts session, redirects |
| `GET /auth/logout` | Destroys session, redirects `/` |

### Role-Based Access

```
Customer  →  can browse /products, sees "My Account" in nav
Admin     →  can access /admin/* (all CRUD), sees "Admin Panel" in nav
Guest     →  sees "Sign In / Register" in nav
```

### Middleware chain for `/admin/*`

```
Request → isAdmin → (checks session.userId AND session.userRole === 'admin')
  ✓ admin     → next() → controller
  ✓ customer  → flash error → redirect /
  ✗ no session → flash error → redirect /auth/login
```

### Password Security

Passwords are hashed with **bcryptjs** (12 salt rounds) via a Mongoose `pre('save')` hook.
Plain-text passwords are **never** stored in the database.

### Session Storage

Sessions are stored in MongoDB via `connect-mongo`, so they survive server restarts.
The session stores: `userId`, `userName`, `userRole`.

### Flash Messages

All controllers use `req.flash('success', '...')` / `req.flash('error', '...')`.
The `res.locals` middleware in `server.js` exposes `flashSuccess` and `flashError` to every template.
Include `<%- include('../partials/flash') %>` in any view that should display them.

---

## Protecting Additional Routes

To protect any future route (e.g. a checkout page):

```js
const { isLoggedIn, isAdmin } = require('../middleware/authMiddleware');

// Customers + admins only
router.get('/checkout', isLoggedIn, checkoutController.getCheckout);

// Admins only
router.get('/admin/reports', isAdmin, reportsController.getReports);
```

---

## Environment Variables (Production)

```env
MONGO_URI=mongodb+srv://...
SESSION_SECRET=a-long-random-string-here
ADMIN_EMAIL=your-admin@domain.com
ADMIN_PASS=your-secure-password
```
