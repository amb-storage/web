FROM node:24.22.1-alpine AS base
WORKDIR /app
# Corepack đi kèm Node 24 chưa chạy được pnpm 12 → cài thẳng đúng bản trong "packageManager"
RUN npm install --global --no-fund --no-audit pnpm@12.4.1

FROM base AS dependencies
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS build
# Rewrite `/api/v1/*` → backend được Next ghi vào build, nên URL backend phải có ngay lúc build
ARG API_BASE_URL
ENV API_BASE_URL=${API_BASE_URL} \
    NEXT_TELEMETRY_DISABLED=1
COPY --from=dependencies /app/node_modules ./node_modules
COPY . .
RUN test -n "$API_BASE_URL" || (echo "API_BASE_URL build arg is required" >&2; exit 1)
RUN pnpm build

FROM node:24.22.1-alpine AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
WORKDIR /app
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
USER node
EXPOSE 3000
CMD ["node", "server.js"]
