ARG APP_DIR=/capstone/ui/alzheimer-predict-ui

# Build image
FROM node AS build
ARG APP_DIR

RUN apt-get update \
    && apt-get install -y \
        curl \
        build-essential \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

# Copy all files
WORKDIR ${APP_DIR}
COPY ./ ./

EXPOSE 80
EXPOSE 3000
EXPOSE 8000
EXPOSE 5432

RUN node --version
RUN npm --version

# Run NPM Install
RUN npm install

# Run NPM Start
CMD ["npm", "start"]