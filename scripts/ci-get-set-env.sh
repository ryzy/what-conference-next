#!/usr/bin/env bash

# Angular env to build (see yarn build:APP_ENV_NAME)
# Determined based on branch and/or tag name.
export APP_ENV_NAME=dev
if [ $CIRCLE_BRANCH = "prod" ]; then
  export APP_ENV_NAME="prod"
fi

# Built app version, to substitute in built static files of front-end app
export APP_VERSION="$APP_ENV_NAME$CIRCLE_BUILD_NUM-${CIRCLE_BRANCH}-${CIRCLE_SHA1:0:7}"
