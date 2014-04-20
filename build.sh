#!/usr/bin/env bash

CWD=`pwd`

if [ ! -d "vendor" ]; then
  mkdir vendor
fi

# Install or update the dependencies.
LIBRARIES=(libphonenumber closure-library closure-compiler closure-linter python-gflags)
for LIBRARY in "${LIBRARIES[@]}"
do
  if [ ! -d "vendor/$LIBRARY" ]; then
    svn checkout http://$LIBRARY.googlecode.com/svn/trunk/ vendor/$LIBRARY
  else
    svn update vendor/$LIBRARY
  fi
done

# Build closure-compiler
ant -f vendor/closure-compiler/build.xml

# Build libphonenumber
ant -f build.xml compile-libphonenumber