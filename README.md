# WedPlan — Wedding Planning Platform (Frontend Client)

> **Assignment 9 — Category: 004**  
> Modern full-stack wedding planning platform built with **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4**, **shadcn/ui (`@base-ui/react`)**, **Better Auth**, **Framer Motion**, and **Stripe Checkout**.

---

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [Important Features](#important-features)
3. [Technology Stack](#technology-stack)
4. [Challenge Implementations](#challenge-implementations)
5. [Environment Variables](#environment-variables)
6. [Installation & Setup](#installation--setup)
7. [How to Run Locally](#how-to-run-locally)
8. [Evaluation & Testing Credentials](#evaluation--testing-credentials)
9. [Project Links](#project-links)

---

## 🌟 Project Overview
**WedPlan** connects couples planning their wedding with premier, verified vendors across photography, venues, floral decoration, catering, makeup, and bridal fashion. The application provides dedicated, role-tailored dashboards for Customers, Vendors, and Administrators, with automated subscription monetization powered by Stripe.

---

## ⚡ Important Features

### 1. 🔐 Robust Authentication & Role-Based Access Control (RBAC)
- **Better Auth Integration**: Email/password registration and Google OAuth.
- **Spec-Compliant Password Rules**: Minimum 6 characters, at least 1 uppercase letter (`A-Z`), and 1 lowercase letter (`a-z`).
- **ImgBB Profile Image Upload**: Direct client-to-server action file upload using the ImgBB API.
- **Public vs. Protected Registration**: Public sign-ups allow choosing `Customer` or `Vendor`; Admin registration is strictly prohibited and restricted to database promotion.
- **Route Protection**: Server-side redirection to `/login` for unauthenticated access to service details and dashboard routes.
- **Blocked User Guard**: Suspended accounts (`isBlocked: true`) are denied access to protected features and APIs.

### 2. 🎨 Luxury Design System & Dark Mode
- **Zero Hardcoded Colors**: 100% semantic OKLCH color tokens (`blush-pink`, `champagne`, `cream`, `charcoal`, `primary`, `card`, `border`) in `globals.css`.
- **System-Aware Theme Switching**: Hydration-safe dark and light mode toggle built with `next-themes` and React 19 `useSyncExternalStore`.
- **Framer Motion Animations**: Elegant editorial entrance animations, floating cards, and smooth modal transitions.

### 3. 🔍 Curated Services Directory & Discovery
- **Dynamic Homepage**:
  - Hero Section with interactive quick-search and category pills.
  - 6 Wedding Service Categories grid.
  - Featured Services grid loading approved, active services from MongoDB.
  - "Why Choose WedPlan?" and "How WedPlan Works" editorial sections.
- **Browse Services (`/services`)**:
  - Live keyword search across service name, category, location, and vendor name.
  - Multi-filtering by Category and City/Location.
  - Ascending and Descending price sorting.
  - Content-shaped skeletons and responsive empty states.

### 4. 💍 Service Details & Booking Engine (`/services/[id]`)
- Multi-image interactive gallery.
- Complete vendor profiles with direct contact channels.
- Booking form capturing event date, location, guest count, and notes.
- **Guards**: Unauthenticated visitors are redirected to `/login`; vendors are prevented from booking their own listings; duplicate active inquiries for the same service and date are blocked.

### 5. 💼 Vendor Portal (`/vendor/*`)
- **Vendor Overview**: 5 KPI stat cards (Total Services, Active Services, Pending Requests, Booked Events, Current Plan).
- **Add Service (`/vendor/add-service`)**: Multi-image ImgBB upload, pricing, description, and highlights builder. Initial status defaults to `pending`.
- **Free Plan Quota Limit**: Restricts free vendors to a maximum of 3 active services.
- **My Services**: View approval status (`pending`, `approved`, `rejected`), edit details, soft-delete, and toggle availability.
- **Booking Requests**: Accept or reject incoming customer inquiries (decisions are immutable once decided).
- **Subscription Management**: Compare Free vs. Premium tiers and upgrade with one click.

### 6. 💖 Customer Portal (`/dashboard`)
- **Customer Overview**: 4 KPI cards (Total Bookings, Pending, Booked, Rejected).
- **My Bookings (`/bookings`)**: Detailed booking tracker with request dates and status badges.
- **Cancellation Control**: Customers can cancel pending booking requests at any time.
- **Saved Services (`/saved`)**: Personal wishlist of favorite wedding vendors.
- **Profile Settings (`/profile`)**: Update display name and profile picture.

### 7. 🛡 Admin Panel (`/admin/*`)
- **Admin Overview**: 6 platform KPI metrics (Total Users, Vendors, Customers, Services, Pending Services, Total Transactions).
- **Manage Users (`/admin/users`)**: Search accounts, filter by role (`Customer`, `Vendor`, `Admin`), and toggle Block/Unblock status.
- **Manage Services (`/admin/services`)**: Search, filter, review pending listings, and Approve, Reject, or Delete services.
- **Platform Transactions (`/admin/transactions`)**: Read-only audit log of verified Stripe subscription receipts.

### 8. 💳 Stripe Monetization & Webhooks
- **Stripe Checkout (Test Mode)**: Seamless payment session redirect.
- **Zero-Client-Trust Architecture**: Tier upgrades occur exclusively through cryptographically verified server webhooks listening to `checkout.session.completed`.

---

## 🏆 Challenge Implementations
1. **Advanced Service Search**: Full multi-attribute search querying service name, category, city/location, and vendor identity.
2. **Price Sorting**: Dual-direction sorting enabling customers to sort by lowest price (`price-asc`) and highest price (`price-desc`).
3. **Backend JWT Verification**: Express 5 middleware verifying HS256 signed tokens with cryptographic timing safety, expiration checking, and live database revocation verification.

---

## 🛠 Technology Stack
- **Framework**: Next.js 16.4.6 (App Router, Turbopack)
- **UI & Components**: React 19.3.0, `@base-ui/react`, shadcn/ui (`base-nova`)
- **Styling**: Tailwind CSS 4.3.3, Lucide React Icons
- **Theming**: `next-themes` (OKLCH color system)
- **Animation**: `motion` / Framer Motion
- **Authentication**: Better Auth v1.7.25 + MongoDB Adapter
- **Image Hosting**: ImgBB API via server actions
- **Code Quality**: Biome 2.4.2 (Zero linter errors)

---

## 🔐 Environment Variables
Create a `.env` file in the `assignment_09_client/` directory:

```env
# Better Auth Configuration
BETTER_AUTH_SECRET=your_better_auth_secret_here
BETTER_AUTH_URL=http://localhost:3000

# Express Backend Base URL
API_BASE_URL=http://localhost:8000

# MongoDB Connection String (Atlas or Local)
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/?retryWrites=true&w=majority
DB_NAME=WedPlan

# Google OAuth Credentials
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here

# ImgBB API Key (Server-side image hosting)
IMGBB_API_KEY=your_imgbb_api_key_here

# Stripe Publishable Key (Client-side)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key_here
```

---

## 🚀 Installation & Setup

1. **Clone the repository**:
   ```bash
   git clone <CLIENT_REPO_URL>
   cd assignment_09_client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment variables**:
   ```bash
   cp .env.example .env
   # Update variables in .env with your credentials
   ```

---

## 💻 How to Run Locally

### Start Development Server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build & Start:
```bash
npm run build
npm start
```

---

## 🔑 Evaluation & Testing Credentials

| Role | Email | Password | Access / Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@wedplan.com` | `WedPlan@2026` | Full Admin Dashboard (`/admin`), Manage Users, Moderate Services, View Transactions |
| **Vendor** | `vendor@wedplan.com` | `WedPlan@2026` | Vendor Dashboard (`/vendor/dashboard`), Add Services, Manage Bookings, Stripe Upgrade |
| **Customer** | `customer@wedplan.com` | `WedPlan@2026` | Customer Dashboard (`/dashboard`), Browse & Filter, Submit Inquiries, Wishlist |

---

## 🔗 Project Links
- **Live Client Web App**: `https://wedplan-client.vercel.app` (or your deployment URL)
- **Live Server API**: `https://wedplan-server.onrender.com` (or your deployment URL)
- **Client GitHub Repository**: `https://github.com/<YOUR_GITHUB_USERNAME>/assignment_09_client`
- **Server GitHub Repository**: `https://github.com/<YOUR_GITHUB_USERNAME>/assignment_09_server`
