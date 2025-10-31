# Step 1: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy application files
COPY . .

# Set environment variable for Prisma
ENV DATABASE_URL="mysql://teem:Test123@34.126.168.42:3306/gipineapple"


# Generate Prisma Client
RUN npx prisma generate

# Build the app
RUN npm run build

# Step 2: Runner
FROM node:18-alpine AS runner

WORKDIR /app

# Copy files from builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.mjs ./
COPY --from=builder /app/node_modules ./node_modules

# Set environment for production
ENV NODE_ENV=production
ENV NEXT_PUBLIC_DEBUG=true

# Expose port
EXPOSE 3000

CMD ["npm", "start"]
