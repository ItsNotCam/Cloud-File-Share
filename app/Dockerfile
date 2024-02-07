FROM node:latest
RUN apt install curl

WORKDIR /app

COPY package*.json .
RUN npm cache clean --force
RUN npm install -g npm@latest
RUN npm i

COPY . .
RUN mkdir /app/data/files -p

VOLUME ["/app"]
VOLUME ["/data"]

RUN npm run build
ENTRYPOINT npm run start
