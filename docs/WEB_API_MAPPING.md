# AMB:STORAGE Web API Mapping

The Web uses the single canonical backend namespace `/api/v1`. Public
localization is selected with `Accept-Language` (`ja` or `en`, default `ja`),
not with a locale path segment. The Web UI routes `/ja` and `/en` remain
unchanged.

| Web use | Backend route |
| --- | --- |
| Homepage | `GET /api/v1/home` |
| Product list/detail/facets | `GET /api/v1/products`, `/api/v1/products/:slug`, `/api/v1/products/facets` |
| Stories (Web label: Mili Talks) | `GET /api/v1/stories`, `/api/v1/stories/:slug` |
| Mili Talks landing (`/blog`) | `GET /api/v1/content/stories` |
| Navigation | `GET /api/v1/navigation/header`, `/api/v1/navigation/footer` |
| Settings | `GET /api/v1/settings` |
| About and policies | `GET /api/v1/content/about`, `/api/v1/content/policies`, `/api/v1/content/policies/:slug` |
| Pages | `GET /api/v1/pages/:slug` |
| Media | `GET /api/v1/media/:id` |
| Guest/customer Cart | `GET /api/v1/cart`, `/api/v1/cart/items`, `/api/v1/cart/merge`, and related item routes |
| Customer OTP | `/api/v1/customer/auth/*` |
| Checkout | `POST /api/v1/checkout/sessions`, `POST /api/v1/checkout/webhook` (Stripe only) |
| View counting | `POST /api/v1/views` |
| Admin financial dashboard | `GET /api/v1/admin/orders/financial-dashboard?from=YYYY-MM-DD&to=YYYY-MM-DD` (requires `orders.read`) |

Cart and Customer Auth requests use `credentials: "include"`, the existing
CSRF and Origin protections, and the existing idempotency behavior. Guest and
Customer cookies use the `/api/v1` path. Public localized responses set
`Content-Language` and vary on `Accept-Language`.

Cart changes only validate current availability. Checkout reserves requested
stock through its pending Order before creating a Stripe Session; payment
confirmation consumes that reservation and decrements physical Product
quantity. Browser success/cancel redirects do not change payment or stock.

Checkout tax is stored on the Order snapshot (`tax_amount`, `tax_rate_percent`,
`tax_calculation_mode`). `tax_display_mode` remains a storefront display
setting; it does not silently change payment amounts. The separate tax
calculation setting defaults to `NONE`, preserving current production behavior.
Receipts, Stripe Checkout line items, Admin order responses, and the financial
dashboard read the same persisted snapshot.

Successful Stripe settlement enqueues a durable shop notification only when
`SHOP_NOTIFICATION_EMAIL` is configured. Admin fulfillment transitions enqueue
durable customer notifications; no-op updates do not. Both use unique dedupe
keys and Resend idempotency keys.

## Product Mili Talks link and Home blog image

`GET /api/v1/products/:slug` includes `miliTalk`: the Story card (`id`, `slug`,
`title`, `excerpt`, `coverMedia`, `publishedAt`) linked to the Product in the
Admin, or `null` when none is linked or the Story is not published. Link it to
`/blog/<slug>`.

`GET /api/v1/home` returns `miliTalksIntro.media` (a media summary or `null`):
the image chosen for the Home Mili Talks block. It links to `/blog`.

## View counting and popular products

Call `POST /api/v1/views` once on every page navigation, including client-side
route changes. Send `productSlug` on product detail pages and an empty body
elsewhere:

```js
fetch(`${API_ORIGIN}/api/v1/views`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(productSlug ? { productSlug } : {}),
  keepalive: true,
}).catch(() => {});
```

- A valid call returns `204` with no body; repeats within the same 12-hour
  window, bots and unknown slugs are ignored silently, so the Web does not need
  to deduplicate.
- No cookies or CSRF token are needed. Do not use `navigator.sendBeacon`: it
  sends `text/plain`, which the API does not parse.
- Unknown body fields return `400`; more than 60 calls per minute from one IP
  return `429`. Never block rendering on this call.
- Call it from the browser only, not during server-side rendering, or every
  view is attributed to the Web server's IP.

`GET /api/v1/products?sort=popular` orders products by product-page views in
the last 30 days, newest first among ties; it combines with the usual filters
and pagination. For a homepage "Most popular" block use
`GET /api/v1/products?sort=popular&limit=8`. Other `sort` values remain
`newest` (default), `price_asc` and `price_desc`.

Product responses use `price`, `size`, `quantity`, and Category projections;
they do not expose Period, Variants, or legacy price fields. Story is the sole
backend content resource; `/blog` is only a Web display route.
