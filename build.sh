#!/usr/bin/env bash

CWD=`pwd`

if [ ! -d "vendor" ]; then
  mkdir vendor
fi

# Install or update the git dependencies.
LIBRARIES=(google/closure-linter gflags/python-gflags google/closure-library google/closure-compiler googlei18n/libphonenumber)
for LIBRARY in "${LIBRARIES[@]}"
do
  SPLIT=(${LIBRARY//\// })
  ORGANIZATION=${SPLIT[0]}
  PROJECT=${SPLIT[1]}
  if [ ! -d "vendor/$PROJECT" ]; then
    git clone https://github.com/$ORGANIZATION/$PROJECT vendor/$PROJECT
  else
    cd vendor/$PROJECT
    git pull
    cd ../..
  fi
done

# Build closure-compiler
ant -f vendor/closure-compiler/build.xml

# Build libphonenumber
ant -f build.xml compile