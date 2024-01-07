FROM alpine:latest

RUN apk update
RUN apk add nodejs npm

WORKDIR /app
COPY . /app

RUN npm i

VOLUME ["/app"]
CMD ["npm", "run", "dev"]