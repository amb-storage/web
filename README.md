# amp-web

Vintage-clothing storefront built with Next.js. Includes a localized (ja/en) home page, shop, product detail, and blog, with GSAP-driven animations and smooth scrolling.

## Tech stack

- [Next.js](https://nextjs.org) 16 (App Router)
- [next-intl](https://next-intl.dev) for i18n (`ja` default, `en`)
- [Tailwind CSS v4](https://tailwindcss.com)
- [shadcn/ui](https://ui.shadcn.com) + [Base UI](https://base-ui.com) components
- [GSAP](https://gsap.com) + [Lenis](https://lenis.darkroom.engineering) for animation and smooth scroll
- TypeScript

## Getting started

This project uses [pnpm](https://pnpm.io) as its package manager.

Data comes from the Amb:STORAGE backend (`amb/api`, see `docs/WEB_API_MAPPING.md`). Start it first (default `http://localhost:3000`), then:

```bash
cp .env.example .env.local   # API_BASE_URL=http://localhost:3000
pnpm install
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result. Port 3001 matches the backend's default `CORS_ORIGINS`, which Cart / Customer Auth mutations check via the `Origin` header.

The browser calls the API same-origin through the `/api/v1/*` rewrite in `next.config.ts`, so the Guest Cart / Customer cookies (path `/api/v1`) and CSRF tokens work without cross-site cookies.

> **Note for AI agents:** this is a customized Next.js setup with breaking changes from stock Next.js. Read `node_modules/next/dist/docs/` before making changes — see `AGENTS.md` for details.

## Scripts

| Command      | Description                     |
| ------------ | -------------------------------- |
| `pnpm dev`   | Start the development server     |
| `pnpm build` | Build for production             |
| `pnpm start` | Start the production server      |
| `pnpm lint`  | Run ESLint                       |

## Project structure

```
app/[locale]/                    Localized routes (home, shop, blog, product/post detail)
app/[locale]/_components/       Homepage sections (Hero, SpecialVintage, NewArrivals, MostPopular, RecentlyViewed, Blog, CustomerVoice)
components/                      Shared UI (ProductCarousel, ProductCard, CategoryCard, Account, Cart, ContentPages, Layout)
components/ProductCarousel/      Shared product-rail shell and controls
hooks/                           Shared React hooks (`useCarousel`, `useControlledState`, `useDataState`)
lib/api/                         Backend `/api/v1` types + server/browser fetch clients
lib/storefront/                  Storefront repository (API → UI models), formatting, filters
data/crawl/                      Crawl/reference data
i18n/                   next-intl routing, navigation, and request config
messages/               Translation files (en.json, ja.json)
lib/                    Shared utilities
```

Route URLs remain `/`, `/shop`, `/shop/[slug]`, `/about`, `/policy`, `/cart`, and `/blog`; any other one-segment URL (`/[slug]`) renders a published CMS Page from `GET /api/v1/pages/:slug` or 404s. English uses the `/en` prefix through next-intl.

## Deployment (Cloudfly)

The web runs on the same Cloudfly VPS as the API (`amb-storage/api`), as its own Compose project `amb-storage-web-prod`, joined to the shared external Docker network `amb-network`. The container publishes no port; the reverse proxy reaches it at `amb-web:3000`. The image is built on the server from the exact commit that passed CI.

| File | Purpose |
| --- | --- |
| `Dockerfile` | Multi-stage Next.js `standalone` build, runs `node server.js` on port 3000 |
| `deploy/cloudfly/docker-compose.yml` | `web` service on `amb-network` (alias `amb-web`), healthcheck `GET /api/health` |
| `deploy/cloudfly/cd-deploy.sh` | Server-side deploy: checkout verified SHA → build `amb-storage-web:<sha>` → recreate → wait healthy → roll back on failure |
| `deploy/cloudfly/env.production.example` | Template for `/amb-storage-web/.env.production` |
| `.github/workflows/ci.yml` | Lint, build, ja/en message-key parity, Docker build |
| `.github/workflows/cd-cloudfly.yml` | After CI succeeds on `main` (or manual run): SSH in and run `cd-deploy.sh` |

`API_BASE_URL` is needed at **build time** (Next bakes the `/api/v1/*` rewrite into the build) and at runtime, so it lives in the server env file and Compose passes it as a build arg. Changing it requires a redeploy (re-run the CD workflow).

### One-time server setup

```bash
# 1. Checkout (the server needs read access to amb-storage/web, e.g. a deploy key)
sudo git clone git@github.com:amb-storage/web.git /amb-storage-web

# 2. Env file: root-owned, mode 600 (the deploy script refuses anything else)
sudo cp /amb-storage-web/deploy/cloudfly/env.production.example /amb-storage-web/.env.production
sudo chown root:root /amb-storage-web/.env.production
sudo chmod 600 /amb-storage-web/.env.production
sudo nano /amb-storage-web/.env.production   # check API_BASE_URL

# 3. First deploy (later deploys run from GitHub Actions)
cd /amb-storage-web && sudo git fetch origin main
sudo bash deploy/cloudfly/cd-deploy.sh "$(git rev-parse origin/main)"
```

Also required outside this repo:

- **Reverse proxy / domain**: the API's Caddy (`amb-storage/api`, `deploy/cloudfly`) only serves `API_DOMAIN` and is not on `amb-network`. Add a site block such as `{$WEB_DOMAIN} { reverse_proxy amb-web:3000 }`, set `WEB_DOMAIN` for the `caddy` service, attach `caddy` to `amb-network`, then recreate Caddy (`docker compose ... up -d caddy`; the API CD only recreates `api`).
- **API env** (`/amb-storage-api/.env.production`): add the web origin (`https://<web-domain>`) to `CORS_ORIGINS`, because Cart / Customer Auth / Checkout mutations are rejected when the `Origin` header is not listed.

### GitHub configuration (repo `amb-storage/web`, environment `production`)

| Kind | Name | Value |
| --- | --- | --- |
| Secret | `CLOUDFLY_HOST` | VPS host / IP |
| Secret | `CLOUDFLY_SSH_PRIVATE_KEY` | Private key of the deploy SSH user |
| Secret | `CLOUDFLY_KNOWN_HOSTS` | `ssh-keyscan -p <port> <host>` output, verified |
| Variable | `CLOUDFLY_SSH_USER` | SSH user (must be able to read the root-owned env file and run Docker) |
| Variable | `CLOUDFLY_SSH_PORT` | SSH port |
| Variable | `CLOUDFLY_CD_ENABLED` | `true` to enable automatic deploys |

These can be the same values as the API repo.

## Internationalization

Locales are managed with `next-intl`. Routes are prefixed as-needed (default locale `ja` has no prefix, `en` is prefixed with `/en`). Translation strings live in `messages/en.json` and `messages/ja.json`.

## Learn more

- [Next.js Documentation](https://nextjs.org/docs)
- [next-intl Documentation](https://next-intl.dev)
