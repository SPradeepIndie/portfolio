FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev

COPY . .
RUN mkdir -p uploads
RUN chmod +x docker-entrypoint.sh

EXPOSE 5000
ENV NODE_ENV=production

CMD ["./docker-entrypoint.sh"]
