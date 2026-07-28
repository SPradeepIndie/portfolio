# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "if [ -n \"$PORTFOLIO_BACKEND_URL\" ]; then sed -i \"s|http://127.0.0.1:5000|https://$PORTFOLIO_BACKEND_URL|g\" /etc/nginx/conf.d/default.conf; fi && exec nginx -g 'daemon off;'"]
