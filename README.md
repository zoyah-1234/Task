# Task1
project-root/
├── backend/             # Node.js app
│   ├── Dockerfile
│   ├── package.json
│   └── server.js
├── frontend/            # React app
│   ├── Dockerfile
│   ├── package.json
│   └── public/
│   └── src/
├── nginx/
│   └── default.conf     # Nginx reverse proxy config
├── docker-compose.yml


Recommended Order:
a. npm init -y – Initializes package.json

b.npm install express – Installs dependencies

c.Create .gitignore – So node_modules won’t be tracked

d.Write your Dockerfile

e.Build Docker image and test

This is a simple Node.js Express application containerized with Docker using a multi-stage build.
1. npm init -y
   npm install express
2. npm install --save-dev nodemon
3. echo "node_modules/" >> .gitignore
   echo "*.log" >> .gitignore

4.Dockerfile (Node.js Multistage)

# ---------- Build stage ----------
FROM node:18-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .

# ---------- Production stage ----------
FROM node:18-alpine
WORKDIR /app
COPY --from=build /app .
EXPOSE 5000
CMD ["node", "server.js"]

5. Dockerfile (React app Multistage)

 # ---------- Build stage ----------
FROM node:18-alpine as build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# ---------- Production stage ----------
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY ../nginx/default.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
  
6.nginx/default.conf (Reverse Proxy for frontend & backend)
server {
    listen 80;

    location / {
        proxy_pass http://frontend:80;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }

    location /api/ {
        proxy_pass http://backend:5000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_cache_bypass $http_upgrade;
    }
}
7. docker-compose.yml
yaml
Copy
Edit
version: '3.8'

services:
  backend:
    build: ./backend
    container_name: backend
    restart: always
    ports:
      - "5000:5000"
    networks:
      - app-network

  frontend:
    build: ./frontend
    container_name: frontend
    restart: always
    depends_on:
      - backend
    networks:
      - app-network

  nginx:
    image: nginx:alpine
    container_name: nginx
    ports:
      - "80:80"
    volumes:
      - ./nginx/default.conf:/etc/nginx/conf.d/default.conf
    depends_on:
      - frontend
      - backend
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

8.docker-compose up --build -d
9.React app will be accessible at: http://localhost

Build & start	
docker-compose up --build -d
View running containers	
docker ps
View logs	
docker-compose logs -f
Stop & remove containers	
docker-compose down

Visit: http://localhost:3000/
