FROM node:latest
RUN apt install curl

WORKDIR /app

COPY app/package*.json .
RUN npm cache clean --force
RUN npm install -g npm@latest
RUN npm i

COPY app/* /app/

VOLUME ["/app"]
ENTRYPOINT npm run dev
