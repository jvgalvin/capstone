ARG APP_DIR=/capstone/ui/alzheimer-predict-ui

# Build image
FROM node AS build

RUN mkdir /app
WORKDIR /app

RUN apt-get update \
    && apt-get install -y \
        curl \
        build-essential \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

EXPOSE 80
EXPOSE 3000
EXPOSE 5432
EXPOSE 8000
EXPOSE 8080

RUN node --version
RUN npm --version

COPY package.json /app

# Upgrade NPM
RUN npm update -g npm

# Run NPM Install
RUN npm install

# Copy all files
COPY . ./

# Run NPM Start
CMD ["npm", "start"]