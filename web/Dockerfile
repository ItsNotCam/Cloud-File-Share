FROM node:latest

# RUN apk update
# RUN apk add nodejs npm

WORKDIR /app
# COPY . .

COPY package*.json /app
RUN npm cache clean --force
RUN npm install -g npm@latest
RUN npm i

COPY . .

VOLUME ["/app"]
CMD ["npm", "run", "dev"]