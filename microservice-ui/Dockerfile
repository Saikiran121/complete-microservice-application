FROM node:12 AS build 
WORKDIR /app
COPY package*.json ./
RUN npm ci 
COPY . .
RUN npx ng build --configuration=$NG_BUILD_CONFIG --aot --build-optimizer


FROM nginx:1.25-alpine
RUN rm -rf /usr/share/nginx/html/*
COPY --from=build /app/dist/microservice-ui/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/conf.d/default.conf
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
    CMD wget -qO- http://127.0.0.1/ || exit 1
EXPOSE 80