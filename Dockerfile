FROM node:6.2-slim

# install git to download dockerode since
# the 1.12 api changes aren't published to npm
RUN apt-get update
RUN apt-get install -y git

# Workdir
RUN mkdir -p /log-service
WORKDIR /log-service

# npm install
COPY package.json /log-service/
RUN npm --loglevel info install
COPY . /log-service

# lint
RUN npm run lint

# transpile/copy src to dist
RUN npm run build

# web
EXPOSE 80

CMD node dist/index.js