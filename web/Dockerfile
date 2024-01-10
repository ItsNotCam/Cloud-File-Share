FROM node:latest

WORKDIR /app

COPY app/package*.json /app/
RUN npm cache clean --force
RUN npm install -g npm@latest
RUN npm i

COPY app/* .

VOLUME ["/app"]
CMD ["npm", "run", "dev"]
# ENTRYPOINT npm run dev
