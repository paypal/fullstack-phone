#!/usr/bin/env bash

## DEPRECATED

# Run quick local compilation

# assuming build.sh has already been run to download dependencies and compile closure compiler

# Build libphonenumber
ant -f build.xml compile
