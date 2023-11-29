FROM library/postgres

ENV POSTGRES_PASSWORD 12345678
ENV POSTGRES_DB alzheimer_predict
ENV POSTGRES_USER alzheimer_predict_user

EXPOSE 80
EXPOSE 3000
EXPOSE 8000
EXPOSE 5432

COPY ./db_container/init.sql /docker-entrypoint-initdb.d/