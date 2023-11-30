ARG APP_DIR=/capstone

# Build  image
#FROM python:3.11-slim AS build
FROM tensorflow/tensorflow:2.11.1-gpu AS build
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

WORKDIR ${APP_DIR}
COPY ./project/pyproject.toml ./

RUN python -m venv --copies ${APP_DIR}/venv
RUN . ${APP_DIR}/venv/bin/activate
# RUN poetry install

# Install node JS in container
ENV NODE_VERSION=20.8.0
RUN apt install -y curl
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
ENV NVM_DIR=/root/.nvm
RUN . "$NVM_DIR/nvm.sh" && nvm install ${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm use v${NODE_VERSION}
RUN . "$NVM_DIR/nvm.sh" && nvm alias default v${NODE_VERSION}
ENV PATH="/root/.nvm/versions/node/v${NODE_VERSION}/bin/:${PATH}"
RUN node --version
RUN npm --version

# Upgrade NPM
# RUN npm update -g npm

# Install PG for node JS
# RUN npm install

# Upgrade pip
RUN python3 -m pip install --upgrade pip

# Install python requirements
COPY ./requirements.txt ./
RUN pip install -r requirements.txt

COPY ./setup-db.sh ./
COPY ./ui/alzheimer-predict-ui/src/setup.js ./ui/alzheimer-predict-ui/src/

EXPOSE 80
EXPOSE 3000
EXPOSE 5000
EXPOSE 8000
EXPOSE 8080

# Install Kubectl
RUN curl -LO 'https://dl.k8s.io/release/v1.22.0/bin/linux/amd64/kubectl'
RUN curl -LO "https://dl.k8s.io/v1.22.0/bin/linux/amd64/kubectl.sha256"
RUN install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl

# Install Minikube
RUN apt-get update
RUN apt install -y conntrack
RUN curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
RUN install minikube-linux-amd64 /usr/local/bin/minikube
RUN sysctl net/netfilter/nf_conntrack_max=524288


# CMD ["bash", "setup-db.sh"]

# CMD ["poetry", "run", "jupyter", "notebook", "--ip=0.0.0.0", "--port=8888", "--no-browser", "--allow-root"]

# # Run image
# FROM python:3.11-slim as run
# ARG APP_DIR

# WORKDIR ${APP_DIR}/

# # COPY ./notebooks ./notebooks

# COPY --from=build ${APP_DIR} ${APP_DIR}
# ENV PATH ${APP_DIR}/venv/bin:$PATH
# # RUN . ${APP_DIR}/venv/bin/activate && poetry install --no-dev


# # COPY . ./
# COPY ./notebooks ./notebooks

# HEALTHCHECK CMD curl -f http://localhost:8000/health || exit 1

# CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]