#!/bin/bash

browserify public/js/main.js -o public/js/compiled.js

if [ "$1" == "prod" ]; then
NODE_ENV=production node app.js
nohup node app.js &
else
NODE_ENV=development node app.js
node app.js
fi
