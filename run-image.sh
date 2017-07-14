#!/bin/bash
docker kill polypus-web-app 2> /dev/null
docker rm polypus-web-app 2> /dev/null
docker run --net=host -tid --name polypus-web-app -p 80:80 polypus/web-app
