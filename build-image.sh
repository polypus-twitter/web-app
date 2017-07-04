#!/bin/bash
tar czf web-app.tar.gz app css fonts images js .htaccess index.html LICENSE
docker build -t polypus/web-app .
rm web-app.tar.gz
