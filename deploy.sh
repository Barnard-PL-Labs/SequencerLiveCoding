#!/bin/bash

browserify public/js/main.js -o public/js/compiled.js

if [ "$1" == "prod" ]; then
export NODE_ENV=production
else
export NODE_ENV=development
fi

if [ "$2" == "serverless" ]; then
export CVC5MODE=serverless
fi

