
# ---------- Stage 1: Build Stage ----------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependency files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# ---------- Stage 2: Production Stage ----------
FROM node:18-alpine AS runner

# Set NODE_ENV to production
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

# Copy only necessary files from builder stage
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/src ./src
COPY --from=builder /app/package*.json ./

# Expose application port
EXPOSE 3000

# Default command
CMD ["node", "src/index.js"]
