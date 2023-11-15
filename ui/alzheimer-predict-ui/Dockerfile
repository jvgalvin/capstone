# FROM postgres
FROM spittet/node-postgresql
ENV POSTGRES_PASSWORD 12345678
ENV POSTGRES_DB alzheimer_predict
ENV POSTGRES_USER alzheimer_predict_user

EXPOSE 5432

# Copy  files
WORKDIR /usr/app
COPY ./ /usr/app
COPY init.sql /docker-entrypoint-initdb.d/

# Install node JS in container
ENV NODE_VERSION=16.13.0
# RUN apt install -y curl
RUN apt-get install curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# Install PG for node JS
RUN npm install pg

CMD ["node", "src/setup-db-container.js"]

