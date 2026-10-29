# Fastor - React Developer Assignment

A mobile-first web application built with **React 18**, **Vite**, **Axios**, and **Tailwind CSS** for the Fastor React Developer assessment. It faithfully reproduces the 4 screens from the provided Figma mobile app design specification and integrates with the live Fastor staging backend APIs.

---

## 📋 Table of Contents
1. [Project Overview & Key Features](#-project-overview--key-features)
2. [Technology Stack](#-technology-stack)
3. [Prerequisites & Quick Start](#-prerequisites--quick-start)
4. [Environment Configuration](#-environment-configuration)
5. [Commands Reference](#-commands-reference)
6. [API Architecture & Authentication Flow](#-api-architecture--authentication-flow)
7. [Figma Design Reproduction & Component Structure](#-figma-design-reproduction--component-structure)
8. [Testing & Quality Assurance](#-testing--quality-assurance)
9. [Deployment Guide](#-deployment-guide)
10. [Known Limitations & Troubleshooting](#-known-limitations--troubleshooting)

---

## 📱 Project Overview & Key Features

### Pixel-Fidelity to Figma Specification
- **Screen 1 (Sign Up to Fastor)**:
  - Mobile number entry with country dial code selector (`+91`, `+1`, `+44`, etc.).
  - Onscreen mobile dialpad (`NumericKeypad`) with haptic touch feel and backspace.
  - Interactive Terms & Conditions and Privacy Policy bottom sheet modals.
  - One-click **Auto-fill demo (9818979450)** shortcut.
  - Real form-urlencoded `POST /pwa/user/register` API request with loading states and validation.

- **Screen 2 (6-Digit OTP Verification)**:
  - Segmented 6-box OTP entry with middle hyphen separator (`[ ][ ][ ] - [ ][ ][ ]`).
  - Active box focus highlighting and auto-advancement.
  - 30-second countdown resend timer (`I didn't receive a code (00:30)`).
  - One-click **Default OTP (123456)** helper.
  - Real form-urlencoded `POST /pwa/user/login` API request with safe JWT session extraction.

- **Screen 3 (Restaurant Discovery & Dashboard)**:
  - Location switcher (`LocationModal`) with city sectors (`Model Town, New Delhi`, `Connaught Place`, `Indiranagar`, etc.).
  - Search bar with user personalized greeting.
  - **Offers & Discounts Modal** with one-click voucher code copying (`FASTOR30`, `FREESHIP`, etc.).
  - **Best Seller Carousel**: Horizontal scroll cards with a working **View all** button that opens a searchable Best Seller Menu modal.
  - **30% OFF Promotional Banner**: Interactive carousel slide dots and direct route to dish details.
  - **Live Fastor Staging Restaurant Feed**: Real data fetched from `GET /m/restaurant?city_id=118&page_no=1`, multi-page pagination controls (`Prev` / `Next`), shimmer loading skeletons, and retry on error.
  - **Popular Items Tab**: Past order feed with order numbers (`#FST-8902`), live status pills, order tracking modal (`DriverTrackingModal`), and cancellation workflow (`CancelOrderModal`).

- **Screen 4 (Product / Restaurant Detail)**:
  - High-resolution hero image with error fallback to restaurant avatar.
  - Floating back navigation button.
  - Dynamic price display supporting both INR (`₹`) and USD (`$`).
  - Circular quantity controller `[-] quantity [+]`.
  - Dietary veg / non-veg indicator badge with star rating (`★ 4.9`).
  - Verified Kitchen source card with FSSAI hygiene badge.
  - Culinary & nutrition highlights: **Prep Time**, **Calories**, and **Dietary Type**.
  - Detailed **Key Ingredients** callout.
  - **Personal portion** customization selector with circular radio buttons (*Personal Regular*, *Medium Portion*, *Large Portion*, *Jumbo Combo*).
  - Kitchen special instructions input.
  - Sticky bottom **Add to cart • total** button with reactive toast feedback.

- **Interactive Shopping Cart & Wallet Modal**:
  - Real-time cart counter badge in dashboard header.
  - Itemized basket breakdown with item names, selected portion, unit prices, and `[-]` / `[+]` quantity controls.
  - Item removal and **Clear All** capabilities.
  - Order subtotal calculation.
  - **Pay with Wallet • Instant Delivery** one-click checkout with animated confirmation feedback.

---

## 🛠 Technology Stack

- **Frontend Core**: React 18.3, Vite 6, JavaScript (ES Modules)
- **Routing**: React Router DOM 7
- **HTTP Client**: Axios 1.7 (custom instance with Bearer token injection, request interceptor, and 401 session expiry handler)
- **Styling**: Tailwind CSS 3.4 with custom Fastor brand tokens (`#FF5722`, `#EA5B3E`)
- **Icons**: Lucide React
- **Unit & Component Testing**: Vitest 3, React Testing Library, JSDOM
- **End-to-End API Testing**: Node.js automated test runner (`test-full-workflow.mjs`)

---

## 🚀 Prerequisites & Quick Start

### 1. Prerequisites
- **Node.js**: `v18.x` or higher (tested on `v20.x` and `v26.x`)
- **npm**: `v9.x` or higher

### 2. Installation
```bash
git clone https://github.com/learnervivek/fastor-react-assignment.git
cd fastor-react-assignment
npm install
```

### 3. Setup Environment Variables
Copy `.env.example` to create your local `.env`:
```bash
cp .env.example .env
```

### 4. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## ⚙️ Environment Configuration

Configuration variables are managed in `.env` (a safe template is committed as [`.env.example`](.env.example)):

```env
# Fastor Staging API Gateway Base URL
VITE_API_BASE_URL=https://staging.fastor.ai/v1

# Default Staging City Identifier (New Delhi = 118)
VITE_DEFAULT_CITY_ID=118

# Staging Authentication Credentials for Testing
VITE_DEFAULT_DIAL_CODE=+91
VITE_DEFAULT_OTP=123456
```

---

## 📜 Commands Reference

| Command | Description |
|---|---|
| `npm run dev` | Starts the Vite local development server on `http://localhost:3000` |
| `npm run build` | Compiles production bundle into `/dist` with zero errors |
| `npm run preview` | Previews the production build locally |
| `npm test` | Runs the full test suite (17 Vitest unit tests + 7 live staging e2e tests) |
| `npm run test:unit` | Runs Vitest unit tests for components, context, and API services |
| `npm run test:e2e` | Runs automated end-to-end integration tests directly against `staging.fastor.ai` |

---

## 🔌 API Architecture & Authentication Flow

```
┌─────────────────┐       POST /pwa/user/register       ┌───────────────────────┐
│ LoginPhonePage  │ ──────────────────────────────────> │ Fastor Staging API    │
│ (Phone + +91)   │ <────────────────────────────────── │ (Returns "otp sent")  │
└─────────────────┘       { status: "Success" }         └───────────────────────┘
         │
         ▼
┌─────────────────┐       POST /pwa/user/login          ┌───────────────────────┐
│ OtpVerifyPage   │ ──────────────────────────────────> │ Fastor Staging API    │
│ (Phone + OTP)   │ <────────────────────────────────── │ (Returns JWT token)   │
└─────────────────┘       { data: { token: "..." } }    └───────────────────────┘
         │
         ▼ (Saves token in localStorage & AuthContext)
┌─────────────────┐    GET /m/restaurant?city_id=118    ┌───────────────────────┐
│ DashboardPage   │ ──────────────────────────────────> │ Fastor Staging API    │
│ (Bearer Token)  │ <────────────────────────────────── │ (Returns 20 items/pg) │
└─────────────────┘       { data: { results: [...] } }  └───────────────────────┘
```

### Staging Endpoints Used:

1. **User Registration & OTP Generation**:
   - **Method**: `POST`
   - **Endpoint**: `/pwa/user/register`
   - **Content-Type**: `application/x-www-form-urlencoded`
   - **Payload**: `phone=9818979450&dial_code=%2B91`
   - **Response Format**: `{"status": "Success", "status_code": 200, "data": "otp sent"}`

2. **Login with OTP**:
   - **Method**: `POST`
   - **Endpoint**: `/pwa/user/login`
   - **Content-Type**: `application/x-www-form-urlencoded`
   - **Payload**: `phone=9818979450&otp=123456&dial_code=%2B91`
   - **Response Format**: `{"status": "Success", "status_code": 200, "data": { "token": "<JWT_STRING>", "user_name": "...", ... }}`

3. **Restaurant Feed with Pagination**:
   - **Method**: `GET`
   - **Endpoint**: `/m/restaurant?city_id=118&page_no=1`
   - **Header**: `Authorization: Bearer <JWT_TOKEN>`
   - **Response Format**: `{"status": "Success", "status_code": 200, "data": { "results": [...], "meta": { "total_pages": 3, "total_count": 56 } }}`

---

## 🎨 Figma Design Reproduction & Component Structure

```text
Fastor-frontend/
├── public/
│   └── _redirects                 # SPA client-side routing fallback rule
├── scripts/
│   └── test-full-workflow.mjs     # Complete 7-scenario live staging API test suite
├── src/
│   ├── components/
│   │   ├── StatusBar.jsx          # Dynamic iOS status bar (time, cellular, wifi, battery)
│   │   ├── HomeIndicator.jsx      # iOS bottom home indicator bar
│   │   ├── NumericKeypad.jsx      # Mobile keypad (digits 1-9, 0, delete action)
│   │   ├── ProtectedRoute.jsx     # Route guarding (ProtectedRoute & PublicOnlyRoute)
│   │   ├── RestaurantCard.jsx     # Restaurant card with image error initials fallback
│   │   ├── RestaurantSkeleton.jsx # Shimmer loading placeholder cards
│   │   └── modals/
│   │       ├── BestSellersModal.jsx   # Searchable Best Seller menu modal
│   │       ├── CountryCodeModal.jsx   # Country dial code picker (+91, +1, +44, etc.)
│   │       ├── LocationModal.jsx      # City delivery sector switcher
│   │       ├── OffersModal.jsx        # Discount vouchers with 1-click copy
│   │       ├── WalletModal.jsx        # Basket management & wallet checkout
│   │       ├── DriverTrackingModal.jsx# Live delivery progress simulation
│   │       ├── CancelOrderModal.jsx   # Order cancellation confirmation
│   │       └── TermsModal.jsx         # Terms of Service & Privacy Policy viewer
│   ├── context/
│   │   ├── AuthContext.jsx        # Session state, JWT persistence, login/logout
│   │   └── CartContext.jsx        # Shopping cart state, portion tracking, quantity
│   ├── pages/
│   │   ├── LoginPhonePage.jsx     # Screen 1: Mobile number entry & keypad
│   │   ├── OtpVerifyPage.jsx      # Screen 2: 6-digit OTP verification & resend timer
│   │   ├── DashboardPage.jsx      # Screen 3: Live API feed, Best Sellers, Search, Tabs
│   │   └── RestaurantDetailPage.jsx # Screen 4: Detail view, portion customization, cart
│   ├── services/
│   │   ├── apiClient.js           # Central Axios client with Bearer auth & diagnostics
│   │   ├── authService.js         # Register & Login form-urlencoded service
│   │   └── restaurantService.js   # Restaurant listing & pagination service
│   ├── test/
│   │   ├── authService.test.js    # Unit tests for authentication logic
│   │   ├── restaurantService.test.js # Unit tests for restaurant API logic
│   │   ├── components.test.jsx    # Unit tests for UI components & cart context
│   │   └── setup.js               # Testing environment setup (jest-dom)
│   ├── App.jsx                    # Root routing setup
│   ├── index.css                  # Tailwind styles & animations
│   └── main.jsx                   # React DOM entry point
├── .env.example                   # Safe environment template
├── .gitignore                     # Git ignore rules (secrets, dist, node_modules)
├── index.html                     # HTML5 shell with viewport & fonts
├── package.json                   # Project manifest & scripts
├── tailwind.config.js             # Tailwind CSS brand configuration
└── vite.config.js                 # Vite bundler configuration
```

---

## 🧪 Testing & Quality Assurance

### Vitest Unit Tests (17 Passed)
Run via `npm run test:unit`:
- `src/test/authService.test.js` (7 tests): Validates phone number sanitization, form-urlencoded payload structure, safe JWT extraction, rejection of invalid OTPs, and error message propagation.
- `src/test/restaurantService.test.js` (3 tests): Validates `Authorization: Bearer <token>` injection, query parameter serialization (`city_id`, `page_no`), and response mapping.
- `src/test/components.test.jsx` (7 tests): Validates `RestaurantCard` rendering and image fallback, optional fields handling, `NumericKeypad` click and delete actions, `StatusBar` time display, `BestSellersModal` live search filtering, `CartContext` complete add/increment/decrement/clear cycle, and `RestaurantDetailPage` dynamic rendering with portion options and nutrition facts.

### Live Staging End-to-End Test Suite (7 Passed)
Run via `npm run test:e2e`:
- **Scenario 1**: Valid phone registration request to live staging backend.
- **Scenario 2**: Rejection of malformed phone numbers with server validation message (`Incorrect Mobile Number`).
- **Scenario 3**: Graceful rejection of incorrect OTPs (`Incorrect OTP`) without state corruption.
- **Scenario 4**: Extraction and validation of staging JWT session token.
- **Scenario 5**: Authenticated access to 20 live restaurant records on page 1 using Bearer token.
- **Scenario 6**: Multi-page pagination verifying 56 live restaurants across 3 pages (20 + 20 + 16).
- **Scenario 7**: Complete storage purge and route guard verification on logout.

---

## 🚢 Deployment Guide

The application is pre-configured for static hosting on **Vercel**, **Netlify**, or **Cloudflare Pages**.

### Deploying to Vercel
1. Install Vercel CLI (or connect via GitHub on [vercel.com](https://vercel.com)):
   ```bash
   npm install -g vercel
   vercel
   ```
2. Configure Environment Variables in Vercel Project Settings:
   - `VITE_API_BASE_URL` = `https://staging.fastor.ai/v1`
   - `VITE_DEFAULT_CITY_ID` = `118`
   - `VITE_DEFAULT_DIAL_CODE` = `+91`
   - `VITE_DEFAULT_OTP` = `123456`

### SPA Routing Rule
The repository includes [`public/_redirects`](public/_redirects) with:
```text
/*    /index.html   200
```
This ensures that refreshing directly on `/otp` or `/restaurant/75` resolves to the SPA router without 404 errors.

---

## 🔍 Known Limitations & Troubleshooting

1. **Staging Single Restaurant Endpoint**: The staging server returns `404 Not Found` for `GET /m/restaurant/:id`. The application handles this gracefully by resolving the restaurant from the directory and pairing it with a tailored culinary signature specialty.
2. **Staging Restaurant Logos**: The AWS S3 bucket URLs returned by the staging API for restaurant logos return `404 Not Found`. `RestaurantCard` and `RestaurantDetailPage` feature automatic image error detection (`onError`) that displays an initials avatar or high-resolution dish photography.
3. **SMS Carrier Gateway**: Real SMS delivery depends on Fastor's staging carrier balance. Use the authorized demo credentials (`9818979450` / `123456`) or the one-click auto-fill buttons for smooth testing.
4. **CORS / Network Diagnostics**: The central Axios client includes custom diagnostic interceptors to distinguish between network timeouts, CORS preflight failures, 401 unauthenticated responses, and server 500 errors.
