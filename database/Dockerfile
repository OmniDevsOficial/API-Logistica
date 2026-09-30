FROM postgres:17-alpine

ENV TZ=America/Sao_Paulo \
    PGTZ=America/Sao_Paulo

COPY init/ /docker-entrypoint-initdb.d/
