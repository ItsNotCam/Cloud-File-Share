FROM ubuntu:latest

# Set environment variables from docker-compose
ENV API_HOST=$API_HOST
ENV API_PORT=$API_PORT
ENV API_START=$API_START

# Copy files
WORKDIR /app/files
WORKDIR /app
COPY . /app

# Install dependencies
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN apt update -y
RUN apt install python3-pip python3-dev uvicorn -y
RUN pip install --upgrade pip
RUN pip3 install -r requirements.txt

# we must reload the shell in order to see uvicorn in the path lol
RUN source ~/.bashrc

VOLUME [ "/app", "/app/files", "/app/src" ]

WORKDIR /app/src
ENTRYPOINT uvicorn $API_START --host $API_HOST --port $API_PORT --reload
