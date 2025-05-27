# Task1
# Dockerized Node.js App
Recommended Order:
a. npm init -y – Initializes package.json

b.npm install express – Installs dependencies

c.Create .gitignore – So node_modules won’t be tracked

d.Write your Dockerfile

e.Build Docker image and test

structure:
node-docker-app/
├── Dockerfile
├── package.json
├── package-lock.json
└── src/
    └── index.js

This is a simple Node.js Express application containerized with Docker using a multi-stage build.
1. npm init -y
   npm install express
2. npm install --save-dev nodemon
3. echo "node_modules/" >> .gitignore
   echo "*.log" >> .gitignore

4.dockerfile

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

  
## Run Locally

```bash
docker build -t node-docker-app .
docker run -p 3000:3000 node-docker-app

Visit: http://localhost:3000/
