FROM node:20-alpine AS build
WORKDIR /app

# Copy both package files for consistent installs
COPY package.json package-lock.json* ./

# Use ci for faster, reproducible installs; fallback to install if no lockfile
RUN npm ci || npm install

# Copy source (node_modules excluded via .dockerignore)
COPY . .

# Build
RUN npm run build

FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built files
COPY --from=build /app/dist .

# nginx config to handle React Router (SPA fallback)
RUN echo 'server { \
  listen 80; \
  root /usr/share/nginx/html; \
  index index.html; \
  location / { try_files $uri $uri/ /index.html; } \
  location /api/ { proxy_pass http://api:5000/; } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
