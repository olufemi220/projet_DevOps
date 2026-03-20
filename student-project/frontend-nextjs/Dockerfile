# Stage 1: Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy everything including local node_modules
COPY . .

RUN npm run build

# Stage 2: Runtime
FROM node:20-alpine AS runtime

WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

CMD ["node", "server.js"]
