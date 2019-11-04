# Sudoku Battle Royale backend

## How to run

### Build the image

```shell
$ docker build -t backend .
Sending build context to Docker daemon
Step 1/9 : FROM python:3.8-alpine3.10
...
```

### Run the container

```shell
$ docker run --name backend-container -p 80:80 backend
INFO:     Started server process [1]
INFO:     Uvicorn running on http://0.0.0.0:80 (Press CTRL+C to quit)
INFO:     Waiting for application startup.
INFO:     Application startup complete.
```
