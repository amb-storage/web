---
name: amp-web
description: Conventions for the amp-web vintage-clothing storefront (Next.js 16 + next-intl ja/en + Tailwind v4 + shadcn/Base UI + GSAP). Use whenever adding or changing a page, section, component, translation, route, or animation in this repo — e.g. "thêm section mới", "tạo trang shop-now", "add a product grid", "dịch sang tiếng Anh", "add hover animation".
---

# amp-web conventions

A Japanese-first vintage clothing shop (military / denim jackets). Match the patterns below so new code looks like the existing code.

## Stack (check before using an API)

- **Next.js 16.3** App Router, React 19.2, TypeScript strict. APIs differ from older Next — read `node_modules/next/dist/docs/` before using anything you are unsure of.
- **pnpm** only (`pnpm add`, `pnpm dlx`). Never npm/yarn.
- **next-intl 4** for i18n, **Tailwind v4** (CSS-first config in `app/[locale]/globals.css`, no `tailwind.config`).
- **shadcn** style `base-nova` built on **Base UI** (`@base-ui/react`), icons from `lucide-react`. Extra registries: `@animate-ui`, `@react-bits` → `pnpm dlx shadcn@latest add @animate-ui/<name>`.
- Animation: **gsap** (primary), `motion` and `ogl` also installed.
- Path alias `@/*` → repo root.

## Where files go

| What | Where |
|---|---|
| Route pages | `app/[locale]/<route>/page.tsx` |
| Components used by one route only | `app/[locale]/<route>/_components/` |
| Shared components | `components/` ; site chrome in `components/layout/` ; shadcn output in `components/ui/` |
| Mock data | `fake.ts` next to the section that uses it (e.g. `_components/fake.ts`) |
| Images | `assets/` (static import), not `public/` |
| Cross-cutting hooks / utils | `hooks/`, `lib/` (`cn` from `@/lib/utils`, `getStrictContext` from `@/lib/get-strict-context`) |

**Every component gets its own folder**, named after the component (PascalCase), e.g. `components/CategoryCard/` or `_components/HotSection/`. Inside: `ComponentName.tsx` (JSX only) + `useComponentNameAnimation.ts` (or `useComponentNameCarousel.ts`, etc. — name it after what it does) holding every `useRef`/`useEffect`/GSAP tween/DOM-event handler *specific to that component*. The component file never calls `gsap.to`, `useRef`, or defines a mouse/scroll handler inline — it destructures refs and handler functions from the hook and wires them onto JSX. A section with no animation of its own beyond what a shared child component + shared hook already provide (e.g. `MostPopular.tsx`, which just renders `ProductCard` inside `useCarousel`) doesn't need its own hook file — the folder still exists for consistency, it's just JSX. Import the component with its explicit filename, not a folder/index import: `from "@/components/CategoryCard/CategoryCard"`, `from "./_components/HotSection/HotSection"`.

Logic genuinely **shared by more than one section** (not just one component's own animation) belongs in a top-level `hooks/` file instead of being duplicated per component-folder — e.g. `hooks/use-carousel.ts` is used by `HotSection`, `MostPopularSection` and `NewArrivalsSection` alike.

Component files are PascalCase (`HotSection.tsx`), except `components/layout/header.tsx`. Default-export the component; define a `XxxProps` interface above it with defaults in the destructuring.

## Server vs client

- `page.tsx` and pure layout sections (e.g. `Hero.tsx`) stay **server components** — no `"use client"`.
- Anything with GSAP, refs, event handlers or state gets `"use client"` at the top and is imported by the server parent. Keep the client boundary as low as possible.
- `params` is a Promise: `const { locale } = await params;`. Type props with the generated helpers `PageProps<"/[locale]/...">` / `LayoutProps<"/[locale]">`.
- `app/layout.tsx` is the root layout: it must render `<html lang={await getLocale()}>` + `<body>`, fonts and the `app/[locale]/globals.css` import (Next 16 errors with "Missing <html> and <body> tags" otherwise). `app/[locale]/layout.tsx` only validates the locale and wraps `NextIntlClientProvider` + `Header` — never put `<html>` there.
- Every new `page.tsx` / `layout.tsx` under `[locale]` must call `setRequestLocale(locale)` (from `next-intl/server`) before using translations, or static rendering breaks. It shows a deprecation hint — see the gotcha below.

## i18n (next-intl)

- Locales `ja` (default) and `en`, `localePrefix: "as-needed"` → Japanese URLs have no prefix, English is `/en/...`. Config: `i18n/routing.ts`.
- **Always** import `Link`, `redirect`, `useRouter`, `usePathname` from `@/i18n/navigation` — never from `next/link` / `next/navigation` (except `notFound`).
- Every user-visible string goes in **both** `messages/ja.json` and `messages/en.json` with identical key structure. Namespaces follow `<page>.<section>.<key>`, e.g. `homepage.header.shopnow.label`, `homepage.hero.title`.
- `const t = useTranslations("homepage.hotSection")` works in both server and client components (the layout wraps everything in `NextIntlClientProvider`). In async server code use `getTranslations`.
- Aria-labels and `alt` text are user-visible too — translate them. Component-specific strings go in a `homepage.<section>` namespace (e.g. `homepage.hotSection.soldOut`); client components call `useTranslations` themselves instead of taking hardcoded default props.

## Styling

- Tailwind utility classes inline; combine conditionals with `cn(...)`.
- Brand palette: dark green `#1B3B2B` / `#1B4D3E` (hover `#12271d` / `#14382c`), white backgrounds, text `text-gray-700` → `hover:text-black`, borders `border-gray-100/200`, sold-out badge `bg-red-600`.
- Section shell: `<section className="w-full py-12 bg-white">` → `<div className="max-w-7xl mx-auto px-4">`. Section heading: `text-2xl md:text-3xl font-bold text-[#1B3B2B] tracking-tight`.
- Header is `fixed h-20 z-50`; full-bleed content must account for it. Use `svh` units for viewport heights (`h-[95svh]`).
- Responsive mobile-first: `grid-cols-1 md:grid-cols-2`, `min-w-[260px] md:min-w-[280px]`.
- Icon buttons: `p-2.5 rounded-full` with an `aria-label`.

## Images

```tsx
import jacket1 from "@/assets/jacket-1.jpeg";
<div className="relative w-full h-full">
  <Image src={jacket1} alt={title} fill className="object-contain" />
</div>
```

Type image props as `string | StaticImageData`. Use `fill` inside a `relative` sized parent; `object-cover` for hero/background, `object-contain` for product cut-outs. Add `priority` only for above-the-fold images.

## Product carousels (HotSection / MostPopular / NewArrivals)

All three horizontal product-carousel sections share the same two building blocks — **never** re-implement per-card markup or carousel-button logic inside a section:

- `components/ProductCard/ProductCard.tsx` — the one card used everywhere: image, title, price, sold-out badge, and on hover a two-button row (`viewDetailsLabel` — a styled `<span>` that just rides the parent `<Link>`, no click handler needed — and `addToCartLabel` — a real `<button>` whose `onClick` calls `e.preventDefault()`/`e.stopPropagation()` before `onAddToCart?.()` so it doesn't navigate). Its own `useProductCardAnimation.ts` hook owns the per-instance `imgRef`/`actionsRef`/`infoRef` tweens.
- `hooks/use-carousel.ts` — `useCarousel(itemCount)` gives every section `sliderRef`, `canScrollLeft`/`canScrollRight` (to disable the arrow buttons at either end), `scroll(direction)`, and `resetAllHovers`.

A new section (another product rail) is just: `useTranslations` for its own `title`/`previous`/`next` + `homepage.productCard` for the shared button labels, `useCarousel(products.length)`, and a `.map()` over `<ProductCard>` inside the `sliderRef` div with `onScroll={resetAllHovers}` and `onMouseLeave={resetAllHovers}`. Copy `MostPopular/MostPopular.tsx` as the template.

Wire `resetAllHovers` on **both** `onScroll` and `onMouseLeave` of the slider div: scrolling the carousel (buttons, drag, wheel) moves a card out from under a stationary cursor without ever firing that card's `onMouseLeave`, which otherwise leaves its hover state (zoomed image, visible action buttons) stuck.

`CategoryCard` (`components/CategoryCard/`) is separate and only for the Hero banner (`variant`-free, full-bleed `h-[95svh]`) — it is not a product-carousel card, don't reach for it for a new product grid/rail.

## GSAP hover animations (house style)

All of this lives in the component's `use<ComponentName>Animation.ts` hook (see "Where files go" above), never inline in the `.tsx` file. Hover effects are done with GSAP in `onMouseEnter` / `onMouseLeave`, not CSS keyframes:

- Single element → `useRef` + `gsap.to(ref.current, ...)` (see `CategoryCard/useCategoryCardAnimation.ts`).
- Repeated items that are their own component (e.g. `ProductCard`) → per-instance `useRef`s in that component's own hook, not `e.currentTarget` + `querySelector`. Mark the same elements with a stable class (`.product-card-img`, `.product-card-actions`, `.product-card-info`) anyway, so a parent carousel can still reset them from outside via `querySelectorAll` in `resetAllHovers` (see `hooks/use-carousel.ts`).
- Always null-check the target before tweening.
- Eases/durations used: enter `power3.out` / `power2.out` 0.3–0.6s, pop-in `back.out(1.5)`, leave `power2.in` / `power3.in` 0.2–0.3s. Typical moves: image `scale: 1.08`, lift `y: -2…-10`, underline `scaleX 0→1` with `origin-left`.
- For show/hide: `gsap.killTweensOf(el)` first, `gsap.set(el, { display: "block" })`, then a `timeline` (stagger children ~0.05); on leave tween out and `display: "none"` in `onComplete`.
- Set the initial hidden state with Tailwind classes (`opacity-0 translate-y-6`, `scale-x-0`, `hidden`) so there is no flash before JS runs.
- Comments in this codebase are written in Vietnamese; keep that style.

## Data shape (mock products)

```ts
{ id: 1, title: "40s USAAF B-15A Flight Jacket 36", price: "110.000 ¥",
  image: jacket1, href: "/shop-now/40s-usaaf-b15a", isSoldOut: false }
```

Every product-carousel list (`specialVintageProducts`, `mostPopularProducts`, `newArrivalProducts` in `_components/fake.ts`) uses this exact shape — `price` is required since `ProductCard` always renders it. Price is a preformatted string with `.` thousands separator and `¥`. Shop links live under `/shop-now/...`, categories `/shop-now/vintage`, `/shop-now/modern`.

## Known gotchas

- **middleware vs proxy:** Next 16 renamed `middleware.ts` → `proxy.ts`, and `next build` fails if both exist. `proxy.ts` is the one to keep; never add or recreate `middleware.ts`.
- **setRequestLocale deprecation:** next-intl 4.14 wants `next/root-params` instead. That only works once `app/[locale]/layout.tsx` is the real root layout (i.e. `app/layout.tsx` removed). Until the user has done that migration, keep using `setRequestLocale`.
- Page metadata comes from the `metadata` namespace via `generateMetadata` in `app/[locale]/layout.tsx`.

## Before finishing

1. `pnpm lint`
2. `pnpm build` (catches type errors and server/client boundary mistakes)
3. If a new string was added, confirm the key exists in both `ja.json` and `en.json`.
4. For UI changes, check `/` (ja) and `/en` in `pnpm dev`.
