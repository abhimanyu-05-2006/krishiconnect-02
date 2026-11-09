# KrishiConnect – AI-Powered Direct Farmer-to-Consumer Marketplace

> **"Fresh From Farms. Fair For Everyone."**
> KrishiConnect is a modern, full-stack AgriTech SaaS marketplace that connects independent growers in Madhya Pradesh directly with consumers, local vendors, supermarkets, and restaurants. By eliminating 4–5 tiers of speculative middleman commissions, KrishiConnect delivers up to **90% direct payouts** into farmers' accounts while providing consumers with pesticide-tested, naturally ripened produce within **18 hours of harvest**.

---

## 1. Key Value Propositions & Differentiators

- **Radical Price Transparency**: Side-by-side cost audit showing exactly where every rupee goes (100% direct produce payout to the farmer, transparent cold-chain logistics, and nominal platform verification fee).
- **5 Multi-Role Dashboards**:
  1. **Farmer Portal**: Crop catalog management, morning harvest staging, order acceptance workflow, earnings analytics with Recharts, and AI advisory tools.
  2. **Consumer Marketplace**: Real-time harvest catalog with district filtering, freshness timestamps, sliding cart, and multi-step GPS order tracking.
  3. **Retailer / B2B Purchasing**: Wholesale produce discovery, minimum order quantities, RFQ tendering with farmer bids, and automated commercial tax invoices.
  4. **AgriFleet Delivery Partner**: Route optimization, cold-chain temperature monitoring (14°C cargo bays), farm-gate pickup confirmation, and 4-digit OTP delivery verification.
  5. **Platform Operations Admin**: Macro GMV tracking, NPOP organic KYC farmer verification, product moderation, dispute resolution, and AI market gap intelligence.
- **AI-Powered Core with Google Gemini**:
  - **Smart Mandi Pricing**: Contextual pricing recommendations analyzing arrivals in Sehore, Bhopal, and Vidisha mandis.
  - **Demand Forecasting**: 30-day upcoming consumption projections across wedding seasons, winter crops, and urban demand shifts.
  - **KrishiMitra Conversational AI**: Bilingual (Hindi & English) agricultural assistant for organic pest control (Neem, Trichoderma), harvesting windows, and fair selling advice.
  - **Admin Supply-Demand Matrix**: Identifies regional shortages and recommends acreage incentives.
- **Sandboxed Test Payment Flow**: Dual checkout supporting Cash on Delivery (COD) and Razorpay test mode (UPI QR, cards, netbanking) with failure simulation.

---

## 2. Technology Stack

- **Frontend**:
  - React 19 (TypeScript)
  - Vite 8
  - Tailwind CSS v4 (with `@import "tailwindcss";`)
  - Framer Motion / CSS Transitions
  - Lucide React Icons
  - Recharts (Area charts for farmer revenue, bar and pie charts for admin GMV)
  - Three.js (Lightweight interactive low-poly organic harvest visual)
  - Canvas Confetti (Celebratory order placement feedback)
- **Backend**:
  - Node.js & Express.js
  - `@google/genai` TypeScript SDK (server-side Gemini 3.8 Flash)
  - RESTful API endpoints for products, orders, farmers, reviews, bulk tenders, disputes, and payments
  - In-memory database with realistic Indian agricultural seed data (Bhopal, Sehore, Raisen, Vidisha, Hoshangabad)
  - Vite dev server mounted via `vite.middlewares`

---

## 3. Demo Persona Accounts

Click **"Switch Role"** in the top navigation bar to test any persona instantly:

| Role | Demo Persona | Location | Key Workflows |
|---|---|---|---|
| **Farmer** | Rameshwar Patidar | Village Ashta, Sehore | List crops, accept orders, test Gemini Smart Pricing, view monthly revenue |
| **Consumer** | Pooja Sharma | Arera Colony, Bhopal | Browse fresh produce, add to basket, checkout with Razorpay demo, track order |
| **Retailer** | Rajesh Agrawal | GreenLeaf Supermart, Bhopal | Browse wholesale catalog, post bulk RFQ tenders, generate tax invoices |
| **Delivery** | Vikram Singh | AgriFleet MP-04 Hub | View assigned pickup route, stage farm crates, complete delivery with OTP `4289` |
| **Admin** | Ananya Deshmukh | KrishiConnect HQ, Bhopal | Review GMV metrics, approve farmer NPOP KYC, moderate listings, resolve disputes |

---

## 4. API Endpoints

### Agricultural Commerce
- `GET /api/products`: Filter products by category, district, organic certification, search terms.
- `GET /api/products/:id`: Get full product provenance with farmer details.
- `POST /api/products`: Farmer adds new harvest produce listing.
- `DELETE /api/products/:id`: Farmer removes listing.
- `GET /api/farmers`: List verified farmers with acreage, ratings, and specialties.
- `GET /api/orders`: Query orders by buyer or farmer ID.
- `POST /api/orders`: Create new order and adjust stock levels.
- `PATCH /api/orders/:id/status`: Update order lifecycle status (`Confirmed` ➔ `Accepted` ➔ `Preparing` ➔ `Ready for Pickup` ➔ `Picked Up` ➔ `Out for Delivery` ➔ `Delivered`).
- `GET /api/bulk-requests`: Query wholesale RFQ tenders.
- `POST /api/bulk-requests`: Retailer posts bulk procurement request.

### Google Gemini AI Endpoints (Server-Side)
- `POST /api/ai/smart-pricing`: Crop, location, and volume pricing analysis.
- `POST /api/ai/demand-forecast`: 30-day regional demand trends.
- `POST /api/ai/chat`: Bilingual KrishiMitra agricultural assistant.
- `GET /api/ai/insights`: Admin macro supply-demand gap analysis.

### Payments
- `POST /api/payments/create-order`: Razorpay test order creation.
- `POST /api/payments/verify`: Sandboxed payment authorization.

---

## 5. Environment Configuration

Define the following in `.env`:

```env
# Required for Gemini AI functionality (injected automatically in AI Studio)
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"

# Application hosting URL
APP_URL="https://ais-dev-52dyvkphmzdfmixd6vqdtt-149949012691.asia-southeast1.run.app"
PORT=3000
```

---

## 6. Local Development & Deployment

```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server (Express + Vite on Port 3000)
npm run dev

# 3. Production build
npm run build
npm start
```

---

© 2026 KrishiConnect AgriTech Private Limited. All rights reserved.
