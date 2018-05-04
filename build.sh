#!/usr/bin/env bash

if [ ! -d "vendor" ]; then
  mkdir vendor
fi

# Install or update the git dependencies.
# format is: ORGANIZATION/PROJECT/TAG
LIBRARIES=(
  google/closure-library/v20180204
  google/closure-compiler/v20161024
  googlei18n/libphonenumber/v8.9.5
)
for LIBRARY in "${LIBRARIES[@]}"
do
  SPLIT=(${LIBRARY//\// })
  ORGANIZATION=${SPLIT[0]}
  PROJECT=${SPLIT[1]}
  TAG=${SPLIT[2]}
  echo "Updating $ORGANIZATION/$PROJECT to $TAG..."
  if [ ! -d "vendor/$PROJECT" ]; then
    git clone https://github.com/$ORGANIZATION/$PROJECT vendor/$PROJECT # clone the folder if it doesn't exist yet
  else
    git -C vendor/$PROJECT fetch --tags # otherwise just do git fetch in that folder of all tags
  fi
  git -C vendor/$PROJECT checkout tags/$TAG # checkout the desired version
done

# Build closure-compiler
echo "Bulding closure compiler..."
mvn -DskipTests -f vendor/closure-compiler/pom.xml

# Build libphonenumber
echo "Building custom libphonenumber..."
ant -f build.xml compile

echo "Done."
