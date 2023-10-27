ARG APP_DIR=/capstone/project

# Build  image
FROM python:3.11-slim AS build
ARG APP_DIR

RUN apt-get update \
    && apt-get install -y \
        curl \
        build-essential \
        libffi-dev \
    && rm -rf /var/lib/apt/lists/*

ENV POETRY_VERSION=1.4.2
RUN curl -sSL https://install.python-poetry.org | python3 -
ENV PATH /root/.local/bin:$PATH

# Copy all files
WORKDIR ${APP_DIR}
COPY ./ ./

RUN python -m venv --copies ${APP_DIR}/venv
RUN . ${APP_DIR}/venv/bin/activate
RUN poetry install

# Install node JS in container
ENV NODE_VERSION=16.13.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# Install PG for node JS
# RUN npm install pg

# Install python requirements
RUN pip install -r requirements.txt

CMD ["poetry", "run", "uvicorn", "src.main:app"]