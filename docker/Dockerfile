FROM postgres:15-alpine

ENV POSTGRES_USER=postgres
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_DB=eval_db

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432

