FROM python:3.8-alpine3.10

RUN apk add --no-cache --virtual .build-deps gcc libc-dev make \
    && pip install pipenv

COPY Pipfile Pipfile
COPY Pipfile.lock Pipfile.lock

RUN pipenv install --dev

COPY src /app

CMD [ "pipenv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80" ]
