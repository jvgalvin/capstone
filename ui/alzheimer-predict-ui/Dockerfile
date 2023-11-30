FROM debian:11-slim as build

RUN mkdir /app
WORKDIR /app

EXPOSE 80
EXPOSE 3000
# EXPOSE 5432
# EXPOSE 8000
# EXPOSE 8080

RUN apt-get update \
    && apt-get install -y \
        curl \
        build-essential \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

COPY ./ui/alzheimer-predict-ui/package.json /app
COPY ./ui/alzheimer-predict-ui/package-lock.json /app

# Install node JS in container
ENV NODE_VERSION=20.8.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"

# Upgrade NPM and remove any modules
RUN npm install -g npm@latest
# RUN rm -rf node_modules

# Run NPM Install
RUN npm install

# Copy all files
COPY ./ui/alzheimer-predict-ui/. ./

# Run NPM Start
CMD ["npm", "start"]