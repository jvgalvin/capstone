# Build image
FROM node:20-alpine

RUN mkdir /app
WORKDIR /app

# EXPOSE 80
EXPOSE 3000
# EXPOSE 5432
# EXPOSE 8000
# EXPOSE 8080

RUN node --version
RUN npm --version

COPY package.json /app
COPY package-lock.json /app

# Upgrade NPM
# RUN npm update -g npm

# Run NPM Install
RUN npm install

# Copy all files
COPY . ./

# Run NPM Start
CMD ["npm", "start"]