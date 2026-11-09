# KrishiConnect: Stakeholder Login Gateway & KYC Verification

Comprehensive dedicated login gateway for KrishiConnect that acts as the front door for all 5 agricultural marketplace stakeholders, featuring role selection tabs, Indian mobile OTP verification, email/password access, and dedicated KYC verification flows with live document validation.

> [!IMPORTANT]
> **Confirmed Choices from Clarification**:
> - **Primary Presentation**: Dedicated landing gateway with role tabs, OTP, and KYC verification (`currentView === 'login'` or initial access).
> - **Verification Modules**:
>   1. **Farmers**: Aadhaar Number & Land Records (Khasra / Khatauni) verification with Sehore/Vidisha/Raisen land parcel details.
>   2. **Retailers / Bulk Buyers**: GSTIN (15-digit) and FSSAI Food Safety License verification.
>   3. **Delivery Partners**: Driving License (DL) & Vehicle Registration Certificate (RC) verification.
>   4. **Consumers**: Instant Mobile OTP verification and address verification.
> - **Authentication Mechanics**: Both Indian Phone OTP (with realistic 6-digit mock SMS verification) and Email/Password with 1-click Demo credentials for all 5 authentic Indian personas.

---

## 1. Overview & Core Concept

- **What It Does**: Provides an authentic, secure, and intuitive onboarding and login experience tailored specifically for Indian agricultural trade. Users can either sign in with existing credentials, request a fast 6-digit OTP to their Indian mobile number, or complete mandatory KYC onboarding depending on their stakeholder role.
- **Target Audience**:
  - **Farmers (Kisan)**: Simple language (Hindi/English), phone-first or Aadhaar/Khasra verification, low-bandwidth optimized.
  - **Consumers**: Quick OTP login, delivery address setup, immediate marketplace access.
  - **Retailers & Kiranas**: GSTIN & FSSAI validation for wholesale tax invoices and credit lines.
  - **AgriFleet Delivery Drivers**: Driving license, commercial two-wheeler/tempo RC, live route readiness.
  - **Platform Admins**: Secure administrative login with audit controls.
- **Key Value**: Establishes transparent trust and food traceability at the very entry point of the marketplace, guaranteeing verified growers and legitimate buyers.

---

## 2. User Experience & Visual Design

### Key User Flows

```
┌────────────────────────────────────────────────────────────────────────┐
│                   KRISHICONNECT GATEWAY SCREEN                         │
├────────────────────────────────────────────────────────────────────────┤
│ [ Brand Insignia & Direct Agri Marketplace Wordmark ]                  │
│                                                                        │
│ ┌────────────────────────────────────────────────────────────────────┐ │
│ │  ROLE SELECTOR TABS:                                               │ │
│ │  [ Farmer (किसान) ]  [ Consumer ]  [ Retailer ]  [ Delivery ] [Admin]│ │
│ └────────────────────────────────────────────────────────────────────┘ │
│                                                                        │
│ ┌───────────────────────────────┐  ┌─────────────────────────────────┐ │
│ │ 1. AUTHENTICATION PANEL       │  │ 2. STAKEHOLDER KYC AUDIT CARD   │ │
│ │                               │  │                                 │ │
│ │ Mode: [ Mobile OTP ] [ Password│  │ Role: Verified Farmer           │ │
│ │                               │  │ • Aadhaar: Verified (UIDAI)     │ │
│ │ Phone: +91 [ 98261 45890    ] │  │ • Land Record: Khasra #142/2    │ │
│ │ [ Send Verification OTP ]     │  │ • Mandi Registration: Sehore    │ │
│ │                               │  │                                 │ │
│ │ OTP Code: [ 4 ] [ 8 ] [ 2 ]...│  │ "Direct farm-gate payouts with  │ │
│ │                               │  │  90% revenue pass-through."     │ │
│ │ ── OR Quick Demo Personas ─── │  │                                 │ │
│ │ [ Rameshwar Patidar (Farmer) ]│  │ ── KYC Verification Steps ────── │ │
│ │ [ Pooja Sharma (Consumer)    ]│  │ 1. Identity Document Check      │ │
│ │ [ Rajesh Agrawal (Retailer)  ]│  │ 2. Agricultural/Business Reg    │ │
│ │ [ Vikram Singh (Delivery)    ]│  │ 3. Bank Account / UPI Linking   │ │
│ └───────────────────────────────┘  └─────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────────────┘
```

1. **Role Selection**: User toggles between Farmer, Consumer, Retailer, Delivery Partner, and Admin. The screen contextually adapts with role-specific trust metrics, color accents, and KYC requirements.
2. **Dual Auth Modes**:
   - **Indian Mobile OTP**: Enter 10-digit mobile number, receive a simulated SMS OTP notification toast with 1-click autofill, and verify.
   - **Email & Password**: Standard password login with "Remember me" and forgot password modal.
   - **Instant Demo Switcher Bar**: 1-click instant login button for each stakeholder with authentic Indian portraits (Rameshwar Patidar, Pooja Sharma, Rajesh Agrawal, Vikram Singh, Ananya Deshmukh).
3. **Interactive KYC Verification Modal / Drawer**:
   - Farmers can input Aadhaar & Khasra land record number with mock instant validation.
   - Retailers can validate GSTIN and FSSAI number with live status badge.
   - Delivery partners can submit DL & Vehicle RC with instant route clearance check.
4. **Post-Login Routing**: Directs the user immediately to their tailored dashboard (`farmer-dashboard`, `marketplace`, `retailer-dashboard`, `delivery-dashboard`, or `admin-dashboard`).

### Visual Identity & Theme
- **Color Discipline**:
  - Dominant Neutral: Creamy agro-white background (`#F7F8F2`) and white cards (`#FFFFFF`).
  - Forest Green Core: `#174D35` for primary brand trust, buttons, and headers.
  - Agricultural Accent: Golden harvest amber (`#E6A23C`) for grain/verification markers and leaf green (`#3C8D5A`, `#B7D96B`) for active states.
  - Text & Dividers: Slate black `#17251C` with hairline borders (`border-[#174D35]/15`).
- **Typography**: Display headlines in `Plus Jakarta Sans`, metadata in unboxed clean typography with `·` separators, tabular figures for phone numbers and OTP digits.
- **Micro-Interactions**: Smooth 150ms tab transitions, numeric OTP input with auto-advance, success toasts with realistic verification badge animations.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Full-Screen Gateway with Direct Return to Marketplace**
  - *Chosen Approach*: Implement a dedicated `LoginPage` view that can be launched directly from the Navbar ("Sign In / Register") or as an initial gatekeeper, with a 1-click "Browse Marketplace as Guest" option so shopping is never blocked.
  - *Why*: Balances stringent KYC compliance with seamless e-commerce browsing.
- **Decision 2: Realistic Mock SMS OTP & Document Verification Engine**
  - *Chosen Approach*: Simulate Indian SMS gateway OTP (e.g. generating a 6-digit code displayed in a simulated SMS push banner for easy testing) and algorithmic verification for Aadhaar (Verhoeff/12-digit format), GSTIN (15-character alphanumeric state code format), and FSSAI (14-digit format).
  - *Why*: Allows zero-friction sandbox evaluation while demonstrating realistic Indian regulatory workflows without requiring expensive third-party SMS/KYC API credits.
- **Decision 3: Seamless Integration with AuthContext**
  - *Chosen Approach*: Update `AuthContext` with `loginWithOtp`, `verifyOtp`, and `submitKycVerification` methods, preserving current session in `localStorage`.
  - *Why*: All components, dashboards, and role switchers automatically stay in sync.

---

## 4. Technical Architecture & Data Strategy

### System Architecture Diagram

```
┌────────────────────────────────────────────────────────────────────────┐
│                          src/App.tsx                                   │
│            (Manages currentView: 'login' | 'landing' | ...)             │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
       ┌────────────────────────────┼────────────────────────────┐
       ▼                            ▼                            ▼
┌──────────────┐             ┌──────────────┐             ┌──────────────┐
│  AuthContext │             │  LoginPage   │             │   Navbar     │
│  - user      │◄────────────┤  - Role Tabs ├────────────►│  "Sign In"   │
│  - loginOtp  │             │  - OTP State │             │  "Switch"    │
│  - verifyKYC │             │  - KYC Modal │             └──────────────┘
└──────┬───────┘             └──────┬───────┘
       │                            │
       ▼                            ▼
┌────────────────────────────────────────────────────────────────────────┐
│                           server/db.ts                                 │
│  - USERS (Farmer, Consumer, Retailer, Delivery, Admin with KYC status) │
│  - POST /api/auth/otp/send & POST /api/auth/otp/verify                 │
│  - POST /api/auth/kyc/verify                                           │
└────────────────────────────────────────────────────────────────────────┘
```

### Data Schema Extensions
- **User KYC Entity**:
  - `kycStatus`: `'verified' | 'pending' | 'unverified'`
  - `kycData`:
    - `aadhaarNumber?: string` (Farmer / Consumer)
    - `khasraNumber?: string` (Farmer land parcel)
    - `gstin?: string` (Retailer)
    - `fssaiLicense?: string` (Retailer)
    - `drivingLicense?: string` (Delivery)
    - `vehicleRc?: string` (Delivery)
    - `verifiedAt?: string`

### Verification Test Plan
- Compile and Lint verification via `compile_applet` & `lint_applet`.
- Verify role switching across all 5 roles on the login page.
- Test OTP send and autofill verification.
- Test KYC form submission for Farmer (Aadhaar/Khasra), Retailer (GSTIN), and Delivery (DL).
- Verify successful redirection to each stakeholder's corresponding dashboard.
