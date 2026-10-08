# Storefront Structure Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Normalize storefront naming and component boundaries while preserving all route URLs, UI behavior, translations, cart persistence, and animations.

**Architecture:** Extract the repeated product-rail mechanics into one shared `ProductCarousel` component. Keep homepage sections and page-specific UI route-local, move shared account/cart/content/layout components to consistently named PascalCase folders, and rename hooks to camelCase filenames. Runtime data remains in `data/mock`; crawl data remains reference-only in `data/crawl`.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript strict, next-intl, Tailwind v4, GSAP, Lenis, pnpm.

**Spec:** `.superpowers/sdd/2026-10-08-storefront-structure-design.md`

## Global Constraints

- Next route conventions remain unchanged: `page.tsx`, `layout.tsx`, and URL segment names remain lowercase.
- Shared and route-local component folders use PascalCase.
- Component files use the component's PascalCase name and default-export the component.
- Hook files use camelCase names beginning with `use`.
- A component's filename, folder name, exported component name, and primary import name must describe the same role.
- No route redirects, data-model changes, translation-key renames, dependency changes, or visual redesign.
- Preserve client/server boundaries, cart persistence, and existing animation behavior.

## Review Focus

- Product rail extraction must preserve section-specific surfaces, titles, arrow labels, card labels, and hover reset behavior.
- Case-sensitive import paths must resolve on both case-sensitive and case-insensitive filesystems.
- Recently viewed tracking must remain usable from product detail pages without importing the homepage rail.
- Client-only cart/account/header behavior must not move into server route modules.
- No stale old filenames, exports, or import paths may remain after the moves.

### Task 1: Extract the shared product carousel

**Files:**
- Create: `components/ProductCarousel/ProductCarousel.tsx`
- Modify: `app/[locale]/_components/HotSection/HotSection.tsx`
- Modify: `app/[locale]/_components/NewArrivals/NewArrivals.tsx`
- Modify: `app/[locale]/_components/MostPopular/MostPopular.tsx`
- Modify: `app/[locale]/_components/RecentlyViewed/RecentlyViewed.tsx`

**Interfaces:**
- Consumes: `Product[]` and section labels from each route-local section.
- Produces: `ProductCarouselProps` with `products: Product[]`, `title: string`, `previousLabel: string`, `nextLabel: string`, and `surfaceClassName?: string`.
- `ProductCarousel` owns `useCarousel`, arrow controls, shared product-card translations, section shell, slider classes, `onScroll={resetAllHovers}`, and `onMouseLeave={resetAllHovers}`.

- [ ] **Step 1: Record the current rail contract**

  Compare the four existing rail components and list the shared class names and behavior that must remain unchanged: product card props, `useCarousel(products.length)`, disabled arrow states, smooth horizontal scrolling, and hover reset handlers.

- [ ] **Step 2: Create `ProductCarousel` with the exact shared interface**

  Keep section-specific text outside the component. Resolve `homepage.productCard` labels inside `ProductCarousel`, and use `surfaceClassName` only for the section background so `bg-white` and `bg-[var(--surface-muted)]` remain unchanged.

- [ ] **Step 3: Migrate one rail at a time**

  Replace duplicated markup in Hot, New Arrivals, Most Popular, and Recently Viewed with `ProductCarousel`. Each section must continue to own only its namespace title/previous/next translations and product selection.

- [ ] **Step 4: Verify the shared rail migration**

  Run `pnpm exec tsc --noEmit` and `pnpm lint`. Expected: no type or lint errors, and all four section modules compile against the same `ProductCarouselProps`.

- [ ] **Step 5: Commit the isolated extraction**

  ```bash
  git add components/ProductCarousel app/[locale]/_components
  git commit -m "refactor: share product carousel layout"
  ```

### Task 2: Normalize homepage section names and split recently viewed tracking

**Files:**
- Rename: `app/[locale]/_components/HotSection/HotSection.tsx` → `SpecialVintageSection/SpecialVintageSection.tsx`
- Rename: `app/[locale]/_components/NewArrivals/NewArrivals.tsx` → `NewArrivalsSection/NewArrivalsSection.tsx`
- Rename: `app/[locale]/_components/MostPopular/MostPopular.tsx` → `MostPopularSection/MostPopularSection.tsx`
- Rename: `app/[locale]/_components/RecentlyViewed/RecentlyViewed.tsx` → `RecentlyViewedSection/RecentlyViewedSection.tsx`
- Create: `app/[locale]/_components/RecentlyViewedSection/RecentlyViewedTracker.tsx`
- Rename: `app/[locale]/_components/Blog/Blog.tsx` → `BlogSection/BlogSection.tsx`
- Rename: `app/[locale]/_components/CustomerVoice/CustomerVoice.tsx` → `CustomerVoiceSection/CustomerVoiceSection.tsx`
- Modify: `app/[locale]/page.tsx`
- Modify: `app/[locale]/shop/[slug]/page.tsx`
- Modify: child imports under the renamed Blog and CustomerVoice folders.

**Interfaces:**
- Consumes: `ProductCarousel` from Task 1.
- Produces: `SpecialVintageSection`, `NewArrivalsSection`, `MostPopularSection`, `RecentlyViewedSection`, `RecentlyViewedTracker`, `BlogSection`, and `CustomerVoiceSection` exports whose names match their paths.

- [ ] **Step 1: Move files with explicit case-aware paths**

  Use `git mv`-equivalent case-aware moves so Git records the intended path changes instead of leaving stale case variants.

- [ ] **Step 2: Rename exports and local imports**

  Rename `SpecialVintageCarousel` to `SpecialVintageSection`; keep the other section exports aligned with their new filenames. Update homepage imports and Blog/CustomerVoice child imports without changing props.

- [ ] **Step 3: Extract `RecentlyViewedTracker`**

  Move `RECENTLY_VIEWED_STORAGE_KEY`, `RECENTLY_VIEWED_EVENT`, `readRecentlyViewedIds`, and `RecentlyViewedTracker` into the tracker file. The section file keeps only the rail state/rendering and imports the tracker only where needed; the product detail page imports the tracker directly.

- [ ] **Step 4: Verify old homepage names are gone**

  Run `rg -n "HotSection|NewArrivals/|MostPopular/|RecentlyViewed/|SpecialVintageCarousel|from .*Blog/Blog|from .*CustomerVoice/CustomerVoice" app components` and confirm there are no stale references. Run `pnpm exec tsc --noEmit`.

- [ ] **Step 5: Commit the homepage naming migration**

  ```bash
  git add app/[locale]/page.tsx app/[locale]/_components app/[locale]/shop/[slug]/page.tsx
  git commit -m "refactor: normalize homepage section names"
  ```

### Task 3: Normalize shop route-local boundaries

**Files:**
- Modify: `app/[locale]/shop/page.tsx`
- Rename: `app/[locale]/shop/_components/ShopCatalog.tsx` → `app/[locale]/shop/_components/ShopCatalog/ShopCatalog.tsx`
- Modify: imports of `ShopCatalog`.

**Interfaces:**
- `ShopPage` remains the default export of `app/[locale]/shop/page.tsx`.
- `ShopCatalog` remains the default export of its new component file with the existing props: `products`, `initialSearch`, and `initialCategory`.

- [ ] **Step 1: Rename the page export**

  Change `ShopNowPage` to `ShopPage`; do not change the `/shop` route, query parameters, translations, or server data loading.

- [ ] **Step 2: Move `ShopCatalog` into its own component folder**

  Preserve the client boundary and all filtering/search/sort behavior. Update the page import to `./_components/ShopCatalog/ShopCatalog`.

- [ ] **Step 3: Verify the shop boundary**

  Run `pnpm exec tsc --noEmit`, `pnpm lint`, and a reference scan for `ShopNowPage` and `_components/ShopCatalog.tsx`.

- [ ] **Step 4: Commit the shop route cleanup**

  ```bash
  git add app/[locale]/shop
  git commit -m "refactor: align shop route component boundaries"
  ```

### Task 4: Normalize shared component and hook paths

**Files:**
- Rename folder: `components/account` → `components/Account`
- Rename folder: `components/cart` → `components/Cart`
- Rename folder: `components/content-pages` → `components/ContentPages`
- Rename folder: `components/layout` → `components/Layout`
- Rename files inside those folders to PascalCase component names.
- Rename: `hooks/use-carousel.ts` → `hooks/useCarousel.ts`
- Rename: `hooks/use-controlled-state.tsx` → `hooks/useControlledState.tsx`
- Rename: `hooks/use-data-state.tsx` → `hooks/useDataState.tsx`
- Modify: every affected import path.

**Interfaces:**
- Component exports and props remain unchanged; only paths and names are normalized.
- Hook signatures remain unchanged; only filenames/import paths change.

- [ ] **Step 1: Build a complete old-path reference list**

  Use `rg` for every old folder/file path before moving anything. Include imports in route pages, components, hooks, and generated `.next` output only as read-only evidence; do not edit generated output.

- [ ] **Step 2: Perform case-aware moves**

  Move `account-dialog.tsx` → `AccountDialog.tsx`, `add-to-cart-dialog.tsx` → `AddToCartDialog.tsx`, `cart-preview.tsx` → `CartPreview.tsx`, `cart-state.ts` → `CartState.ts`, `useCart.ts` unchanged, and content-page files to matching PascalCase names. Rename `header.tsx` → `Header.tsx`; preserve the existing Footer subfolder and its already-correct component filenames.

- [ ] **Step 3: Update imports without changing runtime behavior**

  Update aliases and relative imports, preserving the server/client boundaries and all public component signatures.

- [ ] **Step 4: Normalize hook imports**

  Update all imports for `useCarousel`, `useControlledState`, and `useDataState`; leave component-specific `use<Name>Animation.ts` files unchanged because they already follow the target rule.

- [ ] **Step 5: Verify no stale paths remain**

  Run `rg -n "components/(account|cart|content-pages|layout)|hooks/use-(carousel|controlled-state|data-state)|account-dialog|cart-preview|add-to-cart-dialog|about-us-header|about-us-tabs|about-content|policy-content|header\.tsx" app components hooks lib i18n data` and expect no old runtime references.

- [ ] **Step 6: Commit the shared path migration**

  ```bash
  git add components hooks app lib
  git commit -m "refactor: normalize shared component paths"
  ```

### Task 5: Synchronize repository conventions and run full validation

**Files:**
- Modify: `CLAUDE.md`
- Modify: `README.md`
- No runtime source changes unless the reference scan finds a missed import.

- [ ] **Step 1: Update conventions**

  Replace outdated examples such as `fake.ts`, `/shop-now`, kebab-case shared components, and duplicated rail implementation guidance with the final structure and `ProductCarousel` boundary.

- [ ] **Step 2: Run the full reference scan**

  Confirm old exports, old paths, `ShopNowPage`, `SpecialVintageCarousel`, and direct duplicated rail markup do not remain. Confirm route URLs remain `/`, `/shop`, `/shop/[slug]`, `/about`, `/policy`, `/cart`, and `/blog`.

- [ ] **Step 3: Run validation**

  ```bash
  pnpm exec tsc --noEmit
  pnpm lint
  pnpm build
  git diff --check
  ```

  Expected: all commands exit successfully and the build lists the existing localized routes.

- [ ] **Step 4: Perform manual smoke checks**

  In `pnpm dev`, verify `/`, `/en`, `/shop`, `/en/shop`, a product detail page, cart quantity behavior, account dialog, header navigation/search, and recently viewed tracking. Confirm carousel arrows, drag/scroll hover reset, translations, and mobile layout remain unchanged.

- [ ] **Step 5: Commit convention updates and final refactor state**

  ```bash
  git add CLAUDE.md README.md
  git commit -m "docs: synchronize storefront conventions"
  ```
