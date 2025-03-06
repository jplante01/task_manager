# Build stage
FROM node:18-alpine as build
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Copy built static files
COPY --from=build /app/dist .

# Copy Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy and configure the environment script
COPY env.sh /env.sh
RUN chmod +x /env.sh

# Expose the port Fly.io expects
EXPOSE 8080

# Use the environment script as the container entrypoint
CMD ["/env.sh"]