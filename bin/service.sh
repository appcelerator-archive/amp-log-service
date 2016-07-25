#!/usr/bin/env bash

docker build -t log-service:latest .

docker service rm log-service || true
docker service create --name log-service \
  -m type=bind,source=/var/run/docker.sock,target=/var/run/docker.sock \
  --network amp-build \
  log-service:latest
