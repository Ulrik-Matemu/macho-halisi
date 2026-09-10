# Macho Halisi Frontend

Next.js frontend application for **Macho Halisi** (Luxury Tanzanian Safari Operator).
Contains:
1. **Public Marketing Site:** High-performance App Router demo with multi-video storytelling hero, fullscreen drawer navigation, and enquiry modal.
2. **Operations Dashboard:** Authenticated internal dashboard shell (`/dashboard`) wired to the Express API with two-factor authentication (MFA).

---

## Environment Configuration

Create a `.env.local` file in the project root (see `.env.example`):

```env
# Express API Backend Base URL (server-side only, never exposed to client bundle)
EXPRESS_API_URL=http://localhost:4000
```

---

## Authentication Architecture & Proxy Pattern

Authentication tokens are **never stored in localStorage, sessionStorage, or JavaScript-accessible cookies**. Instead, this frontend implements a server-side **Route Handler Proxy**:

```
[Browser Client] 
      │
      ▼  (same-origin fetch with httpOnly cookies)
[Next.js Route Handlers: app/api/auth/*]
      │
      ▼  (server-to-server HTTP with Bearer tokens)
[Express API: http://localhost:4000]
```

- **Login (`POST /api/auth/login`):** Proxies credentials to Express. Returns `{ status: "mfa_required" | "mfa_enrollment_required", challengeToken }`. No session cookies issued yet.
- **MFA Challenge (`POST /api/auth/mfa/verify`):** Proxies challenge token + 6-digit TOTP code to Express. On success, sets `mh_access_token` (15-min) and `mh_refresh_token` (7-day) as `httpOnly`, `sameSite=lax` cookies.
- **MFA Enrollment (`POST /api/auth/mfa/enroll` & `POST /api/auth/mfa/enroll/confirm`):** Generates QR code/secret and verifies confirmation TOTP code. Sets httpOnly session cookies upon successful verification.
- **Session Check (`GET /api/auth/me`):** Reads the `httpOnly` access token cookie, calls Express `GET /auth/me`. If expired, automatically refreshes via the refresh token cookie before returning `{ status: "ok", user: { id, email, role } }`.
- **Logout (`POST /api/auth/logout`):** Revokes refresh token in Express database and clears both session cookies (`maxAge: 0`).
- **Route Guard (`proxy.ts`):** Next.js 16 Proxy layer protecting `/dashboard/*` routes. Redirects unauthenticated requests to `/dashboard/login?from=...`, and redirects logged-in users away from the login page.

---

## Safari Itinerary Management (Step 7)

The operations dashboard includes a multi-tab itinerary management system for curating luxury safari journeys:

- **List View (`/dashboard/itineraries`):** Paginated table showing live drafts, review requests, published itineraries, and archives with status filtering.
- **Draft Creation (`/dashboard/itineraries/new`):** Validated initial setup card (Title, Nights, Pricing model) that generates a verified `DRAFT` in the database and routes immediately into the multi-tab editor.
- **Autosave Multi-Tab Editor (`/dashboard/itineraries/[id]`):**
  - **Debounced Autosave (1.5s):** Automatically persists changes to `/api/itineraries/[id]` as you type with sticky save-state feedback (`All changes saved`, `Saving...`, `Unsaved changes`, `Save failed`). Prevents accidental data loss on navigation (`beforeunload`).
  - **Tab 1: Overview:** Title, auto-slug generator, narrative overview, nights, booking availability (`AVAILABLE`, `LIMITED`, `FULLY_BOOKED`), and pricing mode (USD starting price vs. "Price on Request").
  - **Tab 2: Days:** Sequential day-by-day builder (Day number, title, accommodation, activities tags, detailed description) with Move Up / Move Down reordering controls.
  - **Tab 3: Destinations:** Multi-select destination pills with inline `+ Add Destination` quick-creation modal.
  - **Tab 4: Inclusions & Notes:** Interactive pill tag inputs for inclusions and exclusions, safari travel notes, and route map embed URLs.
  - **Tab 5: Gallery:** Drag-and-drop / file selector with direct Cloudinary upload proxy (`POST /api/uploads/image`) and attachment (`POST /api/itineraries/[id]/images`), drag-free left/right reordering, alt text editing, and deletion.
- **Role-Based Permissions:**
  - `ADMIN`: Full create, edit, reorder, upload, publish (`PATCH /publish`), archive (`PATCH /archive`), and delete (`DELETE`).
  - `AUTHOR` / `EDITOR`: Full create, edit, reorder, upload, and toggle review status (`DRAFT` / `IN_REVIEW`). Cannot publish, archive, or delete.
  - `VIEWER`: Read-only viewing mode with all action controls disabled.

---

## Running Full-Stack Locally

### 1. Start the Express API Backend
In the sibling repository `../macho-halisi-backend`:

```bash
cd ../macho-halisi-backend

# Ensure database container is running
npm run db:up

# Start Express server with tsx watch (default port: 4000)
npm run dev
```

Verify backend health:
```bash
curl http://localhost:4000/health
# {"status":"ok", ...}
```

### 2. Start this Next.js Frontend
In this repository:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- Marketing Site: [http://localhost:3000/](http://localhost:3000/)
- Operations Dashboard: [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
- Login Page: [http://localhost:3000/dashboard/login](http://localhost:3000/dashboard/login)

---

## Test Accounts

The following seeded accounts are available in the local database:

| Email | Password | Role | MFA Status |
| :--- | :--- | :--- | :--- |
| `admin@machohalisi.com` | `AdminPassword123!` | `ADMIN` | Already enrolled (prompts for 6-digit code) |
| `editor@machohalisi.com` | `EditorPassword123!` | `EDITOR` | First-time setup (displays QR code + secret) |

---

## Build & Lint

```bash
# Type check and build production bundle
npm run build

# Start production server
npm run start

# Run ESLint
npm run lint
```
