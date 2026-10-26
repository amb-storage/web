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
| Navigation | `GET /api/v1/navigation/header`, `/api/v1/navigation/footer` |
| Settings | `GET /api/v1/settings` |
| About and policies | `GET /api/v1/content/about`, `/api/v1/content/policies`, `/api/v1/content/policies/:slug` |
| Pages | `GET /api/v1/pages/:slug` |
| Media | `GET /api/v1/media/:id` |
| Guest/customer Cart | `GET /api/v1/cart`, `/api/v1/cart/items`, `/api/v1/cart/merge`, and related item routes |
| Customer OTP | `/api/v1/customer/auth/*` |
| Checkout | `POST /api/v1/checkout/sessions`, `POST /api/v1/checkout/webhook` (Stripe only) |

Cart and Customer Auth requests use `credentials: "include"`, the existing
CSRF and Origin protections, and the existing idempotency behavior. Guest and
Customer cookies use the `/api/v1` path. Public localized responses set
`Content-Language` and vary on `Accept-Language`.

Cart changes only validate current availability. Checkout reserves requested
stock through its pending Order before creating a Stripe Session; payment
confirmation consumes that reservation and decrements physical Product
quantity. Browser success/cancel redirects do not change payment or stock.

Product responses use `price`, `size`, `quantity`, and Category projections;
they do not expose Period, Variants, or legacy price fields. Story is the sole
backend content resource; `/blog` is only a Web display route.
