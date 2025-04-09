# 1st Stage: Build project
FROM node:alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

# 2nd Stage: Create nginx image with built project
FROM nginx:alpine

### Install bash
RUN apk update
RUN apk upgrade
RUN apk add bash

### ConfigurationInterface of NGINX
COPY docker/nginx.conf /etc/nginx/nginx.template.conf

EXPOSE 80

WORKDIR /usr/share/nginx/html

### Copy project from node image to nginx image
COPY --from=build /app/dist/teiler-dashboard .
COPY docker/env.template.js         ./assets/
ADD docker/start.sh                 /samply/
RUN chmod +x                        /samply/start.sh

ENV EXAMPLE=[]
ENV BACKGROUND_IMAGE_URL=""
ENV LOGO_URL=""
ENV COLOR_PALETTE="Grey"
ENV FONT="Open Sans"

CMD ["/samply/start.sh"]
