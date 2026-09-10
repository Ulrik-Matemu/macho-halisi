# Codebase Analysis Report: Macho Halisi Demo & Design-Direction Build

**Target Application:** Macho Halisi Luxury Safari Tour Operator Website (Karatu, Tanzania)  
**Analysis Type:** Read-Only Architectural & Factual Code Audit  
**Scope:** File structure, components, styling, animation techniques, state management, routing, dependencies, and configuration.  
**Constraint:** Factual documentation only. No roadmaps, sprint plans, or recommendations included.

---

## 1. Tech Stack & Setup

### 1.1 Next.js & React Core
- **Next.js Version:** `16.3.4`
- **Router Paradigm:** Next.js **App Router** (`app/` directory).
  - Entry layout: [`app/layout.tsx`](app/layout.tsx)
  - Entry route: [`app/page.tsx`](app/page.tsx)
  - Global stylesheet: [`app/globals.css`](app/globals.css)
  - No `pages/` directory exists.
- **React Version:** `19.2.8` (`react` and `react-dom`).
- **TypeScript:** Version `^5` configured via [`tsconfig.json`](tsconfig.json) with strict type-checking (`"strict": true`), `ES2017` target, `bundler` module resolution, and path alias mapping (`"@/*": ["./*"]`).

### 1.2 Dependencies & Package Manifest
From [`package.json`](package.json):

| Dependency Type | Package | Declared Version | Purpose |
| :--- | :--- | :--- | :--- |
| Production | `next` | `16.3.4` | Application framework |
| Production | `react` | `19.2.8` | UI library |
| Production | `react-dom` | `19.2.8` | DOM renderer for React |
| Production | `lucide-react` | `^1.41.0` | UI icon set (Search, X, ArrowRight, Check, MapPin, Users, Calendar, Send) |
| Development | `@tailwindcss/postcss` | `^4` | PostCSS integration for Tailwind CSS v4 |
| Development | `tailwindcss` | `^4` | CSS framework engine |
| Development | `typescript` | `^5` | Type-checking |
| Development | `eslint` | `^9` | Linting |
| Development | `eslint-config-next`| `16.3.4` | Next.js linting configuration |
| Development | `@types/node` | `^20` | Node.js type declarations |
| Development | `@types/react` | `^19` | React type declarations |
| Development | `@types/react-dom` | `^19` | React DOM type declarations |

> [!NOTE]
> No third-party animation engines (such as Framer Motion, GSAP, or React Spring) or external state libraries (such as Zustand, Redux, or TanStack Query) are installed.

### 1.3 Styling Approach & Design Tokens
Styling is powered by **Tailwind CSS v4** using the `@import "tailwindcss";` directive and `@theme inline` declaration inside [`app/globals.css`](app/globals.css):
- **Color Tokens:**
  - `--background`: `#080808` (Darkest black base)
  - `--foreground`: `#f4f4f0` (Off-white body text)
  - `--safari-russet`: `#8d5524` (Deep warm leather/terracotta)
  - `--safari-ochre`: `#c68642` (Primary golden ochre)
  - `--safari-gold`: `#e0ac69` (Medium warm gold)
  - `--safari-sand`: `#f1c27d` (Muted accent sand)
  - `--safari-champagne`: `#ffdbac` (Highlight champagne cream)
- **Typography Tokens:**
  - `--font-sans`: `var(--font-geist-sans), ui-sans-serif, system-ui, sans-serif`
  - `--font-mono`: `var(--font-geist-mono), monospace`
  - `--font-serif`: `var(--font-serif-luxury), "Source Serif 4", Georgia, serif`
- **Custom Utility Classes in CSS:**
  - `.font-serif-luxury`: Sets font to Source Serif 4 with OpenType typographic features enabled (`font-feature-settings: "kern" 1, "liga" 1, "calt" 1; text-rendering: optimizeLegibility;`).
  - `.font-serif-italic`: Same as above with `font-style: italic`.
  - `.custom-scrollbar`: 4px translucent scrollbar styling for the fullscreen menu drawer.
  - `.transition-luxury`: Timing function `cubic-bezier(0.16, 1, 0.3, 1)`.
  - `.transition-curtain`, `.curtain-open`, `.curtain-closed`: Clip-path curtain wipe mechanics (`clip-path: inset(0 0 100% 0)` transitioning to `inset(0 0 0% 0)` via `cubic-bezier(0.77, 0, 0.175, 1)`).

### 1.4 Typography & Font Configuration
Configured in [`app/layout.tsx`](app/layout.tsx) using `next/font/google`:
1. **Source Serif 4:** Variable `--font-serif-luxury`, weights `300`, `400`, `500`, `600`, styles `normal` and `italic`, `display: "swap"`.
2. **Geist Sans:** Variable `--font-geist-sans`, latin subset.
3. **Geist Mono:** Variable `--font-geist-mono`, latin subset.
Variables are injected on the root `<html>` element class list along with `antialiased dark`.

### 1.5 Animation Techniques in Use
Animations are implemented through four native techniques without external libraries:
1. **CSS Keyframe Animations:** Defined in [`app/globals.css`](app/globals.css):
   - `@keyframes navCascade`: Translates from `translateY(14px)` with opacity 0 to `translateY(0)` with opacity 1 (`animate-nav-cascade`).
   - `@keyframes subItemCascade`: Translates from `translateY(8px)` with opacity 0 to `translateY(0)` with opacity 1 (`animate-sub-cascade`).
   - `@keyframes imageZoomSettle`: Scales from `scale(1.04)` to `scale(1)` with opacity fade-in (`animate-image-settle`).
2. **CSS Clip-Path Transitions:** The fullscreen navigation menu uses CSS `clip-path` inset manipulation with `duration: 480ms` for a vertical "curtain unfurl" reveal.
3. **Continuous Scroll Interpolation via Inline Styles:** Inside [`Hero.tsx`](components/Hero.tsx), a scroll listener computes normalized progress across a `220vh` container and dynamically sets `opacity`, `transform: translateY(...)`, and `filter: blur(...)` inline on DOM nodes.
4. **Dual-Buffer HTML5 Video Cross-Dissolve:** Inside [`Hero.tsx`](components/Hero.tsx), two synchronized `<video>` elements (Layer A and Layer B) alternate opacity with a 1500ms transition time when a video approaches completion.

### 1.6 State Management
- State management is purely local, handled with standard React hooks (`useState`, `useRef`, `useEffect`, `useCallback`).
- Coordinate state across the application is contained in [`app/page.tsx`](app/page.tsx):
  - `isMenuOpen` (boolean): Controls whether [`FullscreenNavMenu.tsx`](components/FullscreenNavMenu.tsx) is visible.
  - `isEnquiryOpen` (boolean): Controls whether [`EnquiryModal.tsx`](components/EnquiryModal.tsx) is rendered.

---

## 2. Component Inventory

### 2.1 [Navbar.tsx](components/Navbar.tsx)
- **Role:** Fixed top navigation header.
- **Structure:**
  - Semantic `<header>` fixed at the top with `z-40`.
  - Left: Next.js `<Link href="/">` enclosing an aspect-ratio-constrained container holding the brand logo image (`/media/macho-halisi-logo-2.jpg`).
  - Right: Actions group containing:
    - Search icon button (`<Search />`).
    - "ENQUIRE" CTA button.
    - Hamburger icon button constructed from three staggered horizontal `<span>` bars (`w-10`, `w-8`, `w-6`).
- **Data & Copy Drivenness:**
  - Logo path (`/media/macho-halisi-logo-2.jpg`) is hardcoded.
  - Copy `"ENQUIRE"` and aria-labels are hardcoded.
  - Navigation links or category lists are not present in the header itself; navigation is delegated to the fullscreen menu trigger.
- **Reusability:**
  - Accepts interface `NavbarProps`:
    - `onOpenMenu: () => void` (Required)
    - `onOpenEnquiry: () => void` (Required)
    - `onOpenSearch?: () => void` (Optional)
    - `isVisible?: boolean` (Optional, defaults to `true`)
    - `scrollThreshold?: number` (Optional, defaults to `Number.POSITIVE_INFINITY`)
  - While parametrized with callbacks and visibility flags, the visual assets (logo path, brand colors) are hardcoded for Macho Halisi.
- **Interactions, Animation & Responsive Behavior:**
  - Transition duration of 700ms using `.transition-luxury`.
  - Hamburger bars animate width expansion on hover (`w-10` -> `w-12`, `w-8` -> `w-10`, `w-6` -> `w-8`) and change color from white to ochre (`#c68642`).
  - Search button triggers `onOpenSearch || onOpenMenu`.
  - Scrolled state mechanics: Checks `window.scrollY > scrollThreshold`. If active, transitions from a top gradient fade to a solid blurred backdrop (`bg-[#080808]/90 backdrop-blur-md border-b border-white/10`).

### 2.2 [FullscreenNavMenu.tsx](components/FullscreenNavMenu.tsx)
- **Role:** Fullscreen modal navigation overlay featuring a 3-column progressive disclosure layout on desktop, a 3-step drill-down view on mobile, and an in-memory destination search mode.
- **Structure:**
  - Fixed full-screen container (`inset-0 z-50 bg-[#050505]`) with clip-path curtain transition (`.transition-curtain`).
  - Internal header with brand logo, search text input (visible on `md:` screens and up), "ENQUIRE" button, and circular close button (`<X />`).
  - Main Body (Dual Mode):
    1. **Search Mode (when `searchQuery.length > 0`):** Displays a responsive multi-column card grid of filtered destinations with category labels, titles, taglines, descriptions, and "Explore" links.
    2. **Column Navigation Mode (when `searchQuery` is empty):**
       - **Column 1 (Left):** Master list of categories from `navigationData.ts`. Hovering a category selects it and reveals an animated arrow.
       - **Column 2 (Middle):** Sub-items corresponding to the currently hovered category. Each sub-item reveals a glowing circular pip when hovered. Renders empty if no category is hovered.
       - **Column 3 (Right):** Preview panel featuring persistent top crown text (`"MACHO HALISI"`). When a sub-item is hovered, it displays the destination's background image (with slow optical zoom `scale-105`), dark vignette overlays, and title. Renders blank if no sub-item is hovered.
- **Data & Copy Drivenness:**
  - Driven by external typed dataset [`data/navigationData.ts`](data/navigationData.ts).
  - Images are loaded from remote Unsplash URLs configured in `navigationData.ts`.
  - Fixed copy strings (search placeholder, "MACHO HALISI" crown text, "ENQUIRE", "Explore", "Back to Menu") are hardcoded in the component.
- **Reusability:**
  - Accepts `FullscreenNavMenuProps`: `isOpen: boolean`, `onClose: () => void`, `onOpenEnquiry: () => void`.
  - Component is site-specific; it directly imports `navigationData` and hardcodes the brand logo, crown branding, and styling palette.
- **Interactions, Animation & Responsive Behavior:**
  - **Curtain Wipe:** Opened via CSS `.curtain-open` (`clip-path: inset(0 0 0% 0)`) and closed via `.curtain-closed` (`clip-path: inset(0 0 100% 0)`).
  - **Hover Travel Grace Timer:** Uses a ref timer (`resetTimerRef` with a 320ms debounce) so moving the pointer between columns does not immediately clear the active category or preview image.
  - **Body Scroll Lock:** Directly mutates `document.body.style.overflow = "hidden"` on open, and restores `"auto"` on unmount/close.
  - **Keyboard Esc Handling:** Listens for `Escape` keydown to trigger close.
  - **Mobile State Machine:** Manages state `mobileStep` (`"categories"` -> `"subItems"` -> `"preview"`), hiding desktop columns using Tailwind responsive classes (`hidden lg:flex` / `hidden lg:grid`) and rendering back-navigation buttons.

### 2.3 [Hero.tsx](components/Hero.tsx)
- **Role:** Sticky storytelling landing hero spanning a 220vh scroll viewport with a continuous, looping dual-video background cross-fade system and two distinct narrative typographic stages.
- **Structure:**
  - Outer container: `relative w-full h-[220vh] bg-[#050505]`.
  - Sticky inner frame: `sticky top-0 h-screen h-dvh w-full overflow-hidden`.
  - Background Video Subsystem:
    - Dual `<video>` elements (`videoRefA`, `videoRefB`) stacked absolutely with `object-cover`.
    - Layering darkened with a flat overlay (`bg-black/15`) and vertical gradient overlay (`from-black/90 via-black/25 to-black/50`).
  - Stage 1 Typography (Bottom-Left):
    - Pre-title accent line.
    - Large monumental brand title: `"MACHO HALISI"`.
  - Stage 2 Typography (Bottom-Right):
    - Right-aligned narrative card flanked by an ochre right border (`border-r-2 border-[#c68642]/75`).
    - Contains headline (`"MACHO HALISI - SAFARI AND TOUR OPERATOR TANZANIA"`), subtitle (`"– YOUR EYES ON TANZANIA –"`), and two body paragraphs explaining the company's philosophy and Swahili naming origin.
- **Data & Copy Drivenness:**
  - Videos are defined in an internal constant:
    ```ts
    const HERO_VIDEOS = [
      { id: "lion", src: "/media/hero-vids/elephant.mp4", duration: 12.8 },
      { id: "landscape", src: "/media/hero-vids/elephant.mp4", duration: 21.48 },
    ];
    ```
  - All Stage 1 and Stage 2 text, headings, and paragraphs are hardcoded directly into the JSX.
- **Reusability:**
  - Accepts `HeroProps`: `onOpenMenu?: () => void`, `onOpenEnquiry?: () => void`, `onVideoReady?: () => void`. Note that `onOpenMenu` and `onOpenEnquiry` are declared in the interface but are not attached to any elements inside `Hero.tsx`.
  - Highly page-specific one-off component.
- **Interactions, Animation & Responsive Behavior:**
  - **Scroll-driven Interpolation:**
    - Measures scroll position relative to container height to derive a progress factor `scrollProgress` from `0` to `1`.
    - **Stage 1:** Fades out (`1 - scrollProgress * 3.2`), translates upwards (`-scrollProgress * 65px`), and blurs (`scrollProgress * 10px`). Pointer events disabled once `scrollProgress > 0.25`.
    - **Stage 2:** Progress factor computed as `(scrollProgress - 0.2) / 0.45`. Fades in from opacity 0 to 1, translates up into place from `40px` to `0px`, and sharpens from `8px` blur to `0px`.
  - **Seamless Dual-Video Engine:**
    - Layer A and Layer B alternate playback.
    - An `onTimeUpdate` listener monitors `video.duration - video.currentTime`. When remaining time falls below 1.5 seconds, `triggerTransition()` initiates playback on the opposite video layer, sets it active, triggers a 1500ms CSS cross-dissolve, and subsequently pauses the previous video and cues the next playlist source.
    - Contains fallback autoplay gesture listeners (`click`, `touchstart`, `scroll`) in case the browser blocks unmuted/muted autoplay.

### 2.4 [EnquiryModal.tsx](components/EnquiryModal.tsx)
- **Role:** Safari trip booking inquiry modal dialog.
- **Structure:**
  - Backdrop overlay (`fixed inset-0 z-50 bg-black/80 backdrop-blur-md`).
  - Centered card (`max-w-2xl bg-[#111111] border border-[#8d5524]/40 rounded-xl`).
  - Top close icon button.
  - Form state with fields:
    - Full Name (`<input type="text">`)
    - Email Address (`<input type="email">`)
    - Phone or WhatsApp (`<input type="tel">`)
    - Destination of Interest (`<select>`: 6 options)
    - Party Size (`<select>`: Solo, Couple, Small Family, Private Group, Large Expedition)
    - Anticipated Dates (`<select>`: Next 3 Months, Next 3-6 Months, Next 6-12 Months, Next Year / Flexible)
    - Special Requests (`<textarea>`)
    - Submit button with icon (`<Send />`).
  - Submission Success View: Checkmark icon with confirmation text (`"Safari Request Received"`).
- **Data & Copy Drivenness:**
  - Form options, copy, and confirmation text are hardcoded.
- **Reusability:**
  - Props: `isOpen: boolean`, `onClose: () => void`.
  - Specific to Macho Halisi.
- **Interactions & Behavior:**
  - Escape key listener to close modal.
  - Form submission is purely simulated client-side (`e.preventDefault()`, sets `submitted = true`, then closes after 2500ms via `setTimeout`). No HTTP request or Server Action is triggered.

---

## 3. Data Architecture: [data/navigationData.ts](data/navigationData.ts)

The navigation hierarchy is defined in a dedicated TypeScript module:
- **Interfaces:**
  - `NavSubItem`: `id`, `title`, `tagline?`, `description`, `href`, `image`, `badge?`, `highlights?`.
  - `NavCategory`: `id`, `title`, `href`, `featuredDefaultId`, `subItems: NavSubItem[]`.
- **Dataset Contents:**
  - **6 Categories:**
    1. `destinations` (7 sub-items: Serengeti, Ngorongoro, Tarangire, Kilimanjaro, Zanzibar, Lake Manyara, Ruaha & Nyerere)
    2. `experiences` (5 sub-items: Great Migration, Hot Air Balloon, Walking Bush Safaris, Photographic Expeditions, Maasai Cultural Encounters)
    3. `camps-lodges` (3 sub-items: Luxury Tented Camps, Crater Rim Lodges, Zanzibar Beachfront Villas)
    4. `journeys` (3 sub-items: Northern Circuit 8 Days, Mara River Migration Trail 10 Days, Bush to Beach 12 Days)
    5. `impact` (2 sub-items: Anti-Poaching & Wildlife, Community Empowerment)
    6. `about` (2 sub-items: Philosophy / Our Story, Master Naturalist Guides)
  - **Remote Image Assets:** All 22 sub-items reference high-resolution Unsplash imagery matching the destination theme.
  - **External Host Domain:** Enabled in [`next.config.ts`](next.config.ts) under `images.remotePatterns` for `images.unsplash.com`.

---

## 4. Code Observations & Noteworthy Findings

The following items are factual observations regarding current implementation details, syntax, or configuration:

### 4.1 Uncommitted Working Directory State
- Running `git status` shows:
  - Modified: [`components/Hero.tsx`](components/Hero.tsx)
  - Untracked: `public/media/hero-vids/elephant.mp4`

### 4.2 Video Source Referencing in Hero
- In [`components/Hero.tsx`](components/Hero.tsx#L11-L14), the video array currently points both video entries to the same file (`elephant.mp4`):
  ```ts
  const HERO_VIDEOS = [
    { id: "lion", src: "/media/hero-vids/elephant.mp4", duration: 12.8 },
    { id: "landscape", src: "/media/hero-vids/elephant.mp4", duration: 21.48 },
  ];
  ```
- Two other video files exist on disk in `public/media/hero-vids/` (`lion.mp4` and `5214258-sd_960_540_25fps.mp4`), but neither is currently referenced in `HERO_VIDEOS`.

### 4.3 Empty Tagline Container in Hero
- In [`components/Hero.tsx`](components/Hero.tsx#L229-L239), lines 229–239 contain a container with a divider `<span>`:
  ```tsx
  {/* Pre-title Tagline */}
  <div
    className={`flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4 transition-all duration-900 transition-luxury delay-300 ${
      isEntered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
    }`}
  >
    <span
      className={`h-[1px] bg-[#e0ac69]/60 transition-all duration-900 transition-luxury delay-300 ${
        isEntered ? "w-8 sm:w-84" : "w-0"
      }`}
    />
   
  </div>
  ```
  Git history shows that `<p>WELCOME TO TANZANIA</p>` was previously inside this element and was removed, leaving an empty block next to the horizontal divider line. Furthermore, `sm:w-84` is an unconventional width utility.

### 4.4 Navbar Scroll Threshold & Event Handling
- In [`components/Navbar.tsx`](components/Navbar.tsx#L21-L28), `scrollThreshold` defaults to `Number.POSITIVE_INFINITY`:
  ```ts
  if (scrollThreshold === Number.POSITIVE_INFINITY) {
    return;
  }
  ```
- In [`app/page.tsx`](app/page.tsx#L16-L20), `Navbar` is invoked without passing `scrollThreshold`. As a result, the scroll listener is aborted on mount, and `isScrolled` remains `false` regardless of user scrolling. The scrolled backdrop styling (`bg-[#080808]/90 backdrop-blur-md...`) is never engaged in the landing page's current configuration.

### 4.5 Search Action Delegating to Fullscreen Menu
- In [`components/Navbar.tsx`](components/Navbar.tsx#L74), the search button specifies:
  ```tsx
  onClick={onOpenSearch || onOpenMenu}
  ```
- In [`app/page.tsx`](app/page.tsx#L16-L20), `onOpenSearch` is not provided to `<Navbar />`. Clicking the search button in the navbar opens the fullscreen navigation overlay.

### 4.6 Unused Props in Hero
- In [`components/Hero.tsx`](components/Hero.tsx#L5-L9), `HeroProps` defines `onOpenMenu` and `onOpenEnquiry`. In [`app/page.tsx`](app/page.tsx#L24-L25), both props are passed into `<Hero />`, but the component signature deconstructs only `Hero({ onVideoReady }: HeroProps)`. The passed handler functions are not bound to any elements inside `Hero.tsx`.

### 4.7 Route Definitions vs File Routes
- [`data/navigationData.ts`](data/navigationData.ts) contains routing targets (e.g., `/destinations/serengeti`, `/experiences/great-migration`, `/camps-and-lodges/crater-lodges`, `/impact`, `/about`).
- Under the `app/` folder, only `app/page.tsx` exists. Navigating to any of the sub-item or category links currently leads to a Next.js 404 response.

### 4.8 Enquiry Form Mock Submission
- [`components/EnquiryModal.tsx`](components/EnquiryModal.tsx#L35-L42) simulates submission by toggling React state and triggering a 2500ms `setTimeout`. No backend route (e.g. `app/api/...`), Server Action, or third-party CRM webhook is wired up.

### 4.9 Static Public Assets Inventory
- **Boilerplate Assets:** Standard starter SVGs from `create-next-app` (`file.svg`, `globe.svg`, `next.svg`, `vercel.svg`, `window.svg`) remain in `public/`.
- **UI Design Reference Images:** UI design screenshots (`Screenshot_2026-09-06_21_01_59.png`, `Screenshot_2026-09-07_12_45_22.png`, `nav-1.png`, `nav-2.png`, `nav-3.png`) are stored directly in `public/` and `public/media/`.
- **Logo Assets:** Multiple logo formats exist in `public/media/`:
  - `macho-halisi-logo-2.jpg` (used by Navbar and FullscreenNavMenu)
  - `macho-halisi-logo-for-loader.png` (1.5 MB, currently unreferenced)
  - `macho-halisi-logo-for-loader.webp` (208 KB, currently unreferenced)
- **Favicons:** Both `app/favicon.ico` and `app/favicon.jpg` exist inside the `app/` directory.

### 4.10 AGENTS.md Notice
- Root file [`AGENTS.md`](AGENTS.md) contains the automated Next.js agent instruction block injected by `next dev` referencing Next.js breaking changes and documentation paths under `node_modules/next/dist/docs/`.
