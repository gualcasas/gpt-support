# TODO: Remove dev deps from prod build
# BUILDER - Stage 1
FROM node:alpine as builder
RUN apk update && yarn global add pnpm
COPY . .
RUN pnpm install

# # RUNNER - Stage 3
FROM node:alpine AS runner

# # Don't run production as root
RUN addgroup --system --gid 1001 app
RUN adduser --system --uid 1001 app
USER app
COPY --from=builder . .

CMD ["pnpm", "start"]
