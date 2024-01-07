FROM alpine:latest

RUN apk update
RUN apk add py-pip
RUN apk add --no-cache python3-dev

RUN python3 -m venv venv
RUN . venv/bin/activate

RUN pip install --upgrade pip --break-system-packages

WORKDIR /app
COPY . /app

RUN pip --no-cache-dir install -r requirements.txt --break-system-packages

VOLUME [ "/app" ]
CMD ["python3", "src/flaskapp.py"]