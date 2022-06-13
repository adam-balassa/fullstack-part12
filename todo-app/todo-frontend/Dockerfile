FROM node:16 as build
WORKDIR /usr/src/app
COPY . .
RUN npm ci --only=production

ARG REACT_APP_BACKEND_URL
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

FROM node:16 as test
WORKDIR /usr/src/app
COPY --from=build /usr/src/app .
RUN CI=true npm run test

FROM nginx:1.20-alpine
COPY --from=test /usr/src/app/build /usr/share/nginx/html