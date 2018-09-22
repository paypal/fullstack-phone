#!/usr/bin/env bash

# Read libphonenumber version:

LIBPHONENUMBER_VERSION=$1 # use command line arg if it was passed
while [ -z "$LIBPHONENUMBER_VERSION" ]; do
    echo -n "Libphonenumber tag (e.g., v8.9.14): "
    read LIBPHONENUMBER_VERSION
done

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
