FROM node:22-bookworm AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.0.0 --activate

FROM base AS deps
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml turbo.json .npmrc ./
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
COPY packages/rules/package.json ./packages/rules/
COPY packages/ui/package.json ./packages/ui/
COPY packages/eslint-config/package.json ./packages/eslint-config/
COPY packages/typescript-config/package.json ./packages/typescript-config/
RUN pnpm install --frozen-lockfile

FROM base AS build
COPY --from=deps /app /app
COPY apps/api ./apps/api
COPY packages ./packages
COPY turbo.json package.json pnpm-workspace.yaml ./

WORKDIR /app/apps/api
RUN pnpm exec prisma generate && pnpm build

FROM node:22-bookworm-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

RUN apt-get update \
  && apt-get install -y --no-install-recommends curl openssl \
  && rm -rf /var/lib/apt/lists/* \
  && corepack enable && corepack prepare pnpm@9.0.0 --activate

COPY --from=build /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml /app/turbo.json /app/.npmrc ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/apps/api/package.json ./apps/api/
COPY --from=build /app/apps/api/dist ./apps/api/dist
COPY --from=build /app/apps/api/prisma ./apps/api/prisma
COPY --from=build /app/apps/api/node_modules ./apps/api/node_modules
COPY --from=build /app/packages ./packages

WORKDIR /app/apps/api
EXPOSE 3001
CMD ["sh", "-c", "pnpm exec prisma db push --skip-generate && node dist/server.js"]
