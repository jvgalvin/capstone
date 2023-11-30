ARG APP_DIR=/capstone/project

# Build  image
# FROM python:3.11-slim AS build
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

# Copy all files
WORKDIR ${APP_DIR}
COPY ./project ./

RUN python -m venv --copies ${APP_DIR}/venv
RUN . ${APP_DIR}/venv/bin/activate
# RUN poetry install

# Upgrade pip
RUN python3 -m pip install --upgrade pip

# Install python requirements
COPY ./project/requirements.txt ./
RUN pip install -r requirements.txt

EXPOSE 80
EXPOSE 3000
EXPOSE 8000
EXPOSE 5432

ENV MODEL_OBJECT_PATH "./src/"

# Run uvicorn on 0.0.0.0:8000
CMD ["uvicorn", "src.main:app", "--host", "0.0.0.0", "--port", "8000"]