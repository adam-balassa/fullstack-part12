FROM node:16 as build
WORKDIR /usr/src/app
COPY . .
RUN npm ci

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

FROM nginx:1.20-alpine
COPY --from=build /usr/src/app/build /usr/share/nginx/html