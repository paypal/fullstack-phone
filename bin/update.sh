#!/usr/bin/env bash

# Edit this to update the libphonenumber version:
LIBPHONENUMBER_VERSION=v8.9.10

# NOTE: this script assumes it's running in project folder (not inside bin/)

if [ ! -d "vendor" ]; then
    mkdir vendor
fi

# Install or update libphonenumber
echo "Updating googlei18n/libphonenumber to $LIBPHONENUMBER_VERSION..."
if [ ! -d "vendor/libphonenumber" ]; then
    git clone https://github.com/googlei18n/libphonenumber vendor/libphonenumber # clone the folder if it doesn't exist yet
else
    git -C vendor/libphonenumber fetch --tags # otherwise just do git fetch in that folder of all tags
fi
git -C vendor/libphonenumber checkout tags/$LIBPHONENUMBER_VERSION # checkout the desired version

echo "Done."
