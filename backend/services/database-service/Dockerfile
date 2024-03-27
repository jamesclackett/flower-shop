FROM postgres:alpine

COPY init.sql /docker-entrypoint-initdb.d/

RUN apk add --no-cache postgresql-client