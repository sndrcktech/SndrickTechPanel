# frontend/Dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/.next ./.next
COPY --from=build /app/public ./public
COPY package.json package-lock.json ./
RUN npm ci --omit=dev
EXPOSE 3000
CMD ["npm", "start"]
