FROM node:20-alpine AS base
RUN apk add --no-cache libc6-compat openssl

WORKDIR /app

# Copy package files and prisma schema first
COPY package*.json ./
COPY src/prisma/schema.prisma ./src/prisma/schema.prisma
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

# Copy source files
COPY . .

# Build the Next.js app
ENV NEXT_TELEMETRY_DISABLED=1
RUN npm run build

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

EXPOSE 3000

CMD ["node", "server.js"]
