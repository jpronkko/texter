FROM node:22-alpine
WORKDIR /usr/src/app

ARG MONGO_DB_URI
ENV MONGO_DB_URI $MONGO_DB_URI

RUN echo "Mongo db: $MONGO_DB_URI"
RUN tar -czf build.tar.gz -C \
  server/build \
  server/package.json \ 
  server/package-lock.json \ 
  server/server.js \
  server/graphql/ \
  server/models/ \
  server/routes/ \
  server/services/ \
  server/utils/
