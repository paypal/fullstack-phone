#!/usr/bin/env bash

CWD=`pwd`

if [ ! -d "vendor" ]; then
  mkdir vendor
fi

# Install or update the SVN dependencies.
LIBRARIES=(closure-linter python-gflags)
for LIBRARY in "${LIBRARIES[@]}"
do
  if [ ! -d "vendor/$LIBRARY" ]; then
    svn checkout http://$LIBRARY.googlecode.com/svn/trunk/ vendor/$LIBRARY
  else
    svn update vendor/$LIBRARY
  fi
done

# Install or update the git dependencies.
LIBRARIES=(closure-library closure-compiler)
for LIBRARY in "${LIBRARIES[@]}"
do
  if [ ! -d "vendor/$LIBRARY" ]; then
    git clone https://github.com/google/$LIBRARY vendor/$LIBRARY
  else
    cd vendor/$LIBRARY
    git pull
    cd ../..
  fi
done

# Install or update the git dependencies.
LIBRARIES=(libphonenumber)
for LIBRARY in "${LIBRARIES[@]}"
do
  if [ ! -d "vendor/$LIBRARY" ]; then
    git clone https://github.com/googlei18n/$LIBRARY vendor/$LIBRARY
  else
    cd vendor/$LIBRARY
    git pull
    cd ../..
  fi
done

# Build closure-compiler
ant -f vendor/closure-compiler/build.xml

# Build libphonenumber
ant -f build.xml compile-libphonenumber