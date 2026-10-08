# Amb:STORAGE Storefront Structure Refactor

## Status

Design approved conversationally on 2026-10-08; implementation is pending spec review.

## Objective

Synchronize naming and file boundaries across the storefront after the recent homepage, shop, content-page, account, cart, and navigation work. The refactor must preserve route URLs, user-visible behavior, translation keys, cart persistence, and existing animation behavior.

## Current problems

- Homepage rail filenames and exports disagree: `HotSection.tsx` exports `SpecialVintageCarousel`, while the other rail files use different filename/export conventions.
- The four product rails duplicate carousel markup, arrow controls, scroll behavior, and hover reset wiring.
- `RecentlyViewed.tsx` owns both the section UI and the product-view tracking behavior.
- `/shop` is implemented by `ShopNowPage`, which describes the old navigation label rather than the route.
- Shared component folders mix PascalCase and lowercase/kebab-case names (`ProductCard`, `account`, `cart`, `content-pages`, and lowercase files).
- Hook filenames mix camelCase and kebab-case.
- `data/mock` is runtime data for the mock repository; `data/crawl` is reference data and is not imported by runtime code.

## Naming rules

- Next route conventions remain unchanged: `page.tsx`, `layout.tsx`, and URL segment names remain lowercase.
- Shared and route-local component folders use PascalCase.
- Component files use the component's PascalCase name and default-export the component.
- Hook files use camelCase names beginning with `use`, for example `useCarousel.ts` and `useHeaderAnimation.ts`.
- A component's filename, folder name, exported component name, and primary import name must describe the same role.
- Data modules remain lowercase because they are records/helpers rather than React components.

## Target structure

```text
app/[locale]/
  _components/
    BlogSection/BlogSection.tsx
    CustomerVoiceSection/CustomerVoiceSection.tsx
    Hero/Hero.tsx
    MostPopularSection/MostPopularSection.tsx
    NewArrivalsSection/NewArrivalsSection.tsx
    RecentlyViewedSection/
      RecentlyViewedSection.tsx
      RecentlyViewedTracker.tsx
    SpecialVintageSection/SpecialVintageSection.tsx
  shop/
    page.tsx
    _components/ShopCatalog/ShopCatalog.tsx

components/
  Account/AccountDialog.tsx
  Cart/
    AddToCartDialog.tsx
    CartPreview.tsx
    CartProvider.tsx
    CartState.ts
    useCart.ts
  ContentPages/
    AboutContent.tsx
    AboutUsHeader.tsx
    AboutUsTabs.tsx
    PolicyContent.tsx
  Layout/
    Footer/
    Header.tsx
    useHeaderAnimation.ts
  ProductCarousel/ProductCarousel.tsx
  ProductCard/ProductCard.tsx
  ProductBadge/ProductBadge.tsx

hooks/
  useCarousel.ts
  useControlledState.tsx
  useDataState.tsx
```

`data/mock`, `data/crawl`, `lib/storefront`, `i18n`, and route URLs are retained. `data/crawl` is not moved or deleted in this refactor because it is useful verified reference material even though it is not a runtime import.

## Component boundaries

`ProductCarousel` owns the shared horizontal rail mechanics: slider ref, arrow controls, scroll state, hover reset, and product-card mapping. Each homepage rail supplies its title, labels, products, surface class, and section-specific translation namespace.

Homepage section components remain route-local because they are only consumed by the homepage. `RecentlyViewedTracker` is separated from `RecentlyViewedSection` so product detail pages can import tracking without importing the rail UI.

Cart, account, content-page, layout, product-card, and product-carousel components are shared and live under `components/` with stable PascalCase names.

## Migration order

1. Add the shared `ProductCarousel` contract and migrate the four rails without changing rendered behavior.
2. Rename homepage section folders/files/exports and split recently-viewed tracking.
3. Rename the `/shop` page export and move `ShopCatalog` into its component folder.
4. Rename shared component folders/files and hook files; update imports using exact path search.
5. Refresh repository conventions in `CLAUDE.md` and `README.md` to match the resulting structure.
6. Search for old filenames, old exports, and old import paths; remove only references proven obsolete.

No route redirects, data-model changes, translation-key renames, dependency changes, or visual redesign are part of this refactor.

## Validation

- TypeScript compilation: `pnpm exec tsc --noEmit`.
- Lint: `pnpm lint`.
- Production build: `pnpm build`.
- Reference scan confirms no old import paths or exports remain.
- Manual smoke check covers `/`, `/en`, `/shop`, `/en/shop`, product detail, cart, account dialog, header navigation, and recently viewed behavior.

## Risks and mitigation

- Case-only path changes can fail on case-insensitive filesystems; use explicit path moves and verify imports with `rg`.
- Shared carousel extraction can accidentally change spacing or translation ownership; migrate one rail at a time and compare the existing class contract.
- Cart/account client boundaries must remain client components; keep server route pages and data loading unchanged.
