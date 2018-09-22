#!/usr/bin/env bash

# Script to run through all necessary git changes for updating to latest libphonenumber:
#
# - pull latest libphonenumber
# - compile
# - run tests
# - update CHANGELOG.md, README.md, and libphonenumber version in package.json
# - git commit
#
# (Does everything except npm version, git push, and npm publish)
#
# NOTE: this script assumes it's running in project folder (not inside bin/)
#
# References
# https://stackoverflow.com/questions/1955505/parsing-json-with-unix-tools/1955555#1955555
# https://stackoverflow.com/questions/22497246/insert-multiple-lines-into-a-file-after-specified-pattern-using-shell-script/22497489#22497489
# https://stackoverflow.com/questions/19075671/how-do-i-use-shell-variables-in-an-awk-script/19075707#19075707

extractJsonProp () {
    local PROPERTY=$1
    local EXTRACT_RESULT=$(python -c "import sys, json; print json.load(sys.stdin)['$PROPERTY']")
    echo $EXTRACT_RESULT
}

getCurrentFSPVersion() {
    local VERSION=$(cat package.json | extractJsonProp version)
    echo $VERSION
}

getNewFSPVersion() {
    local OLD=$(getCurrentFSPVersion)
    local NEW=$(node -e "console.log(require('semver').inc('$OLD', 'minor'));")
    echo $NEW
}

# Update CHANGELOG.md, README, and package.json with new libphonenumber versions
updateRefs () {
    local OLD_LIBP=$1
    local NEW_LIBP=$2
    local OLD_FSP=$3
    local NEW_FSP=$4

    # update changelog (pass version numbers to awk as variables)
    awk -v fsp="$NEW_FSP" -v libp="$NEW_LIBP" '/Changelog/{print $0 RS "" RS "## " fsp RS "" RS "* Metadata:" RS "  * Updated to libphonenumber " libp ;next}1' CHANGELOG.md > tmp && mv tmp CHANGELOG.md

    # update libphonenumber version in package.json
    sed -i '' 's/"libphonenumber": ".*"/"libphonenumber": "'$NEW_LIBP'"/' package.json

    # update README
    sed -i '' 's/\['$OLD_LIBP'\]/\['$NEW_LIBP'\]/' README.md
}

# MAIN EXECUTION

set -e # abort on any error

OLD_LIBP=$(cat package.json | extractJsonProp libphonenumber)
NEW_LIBP=$(curl -s https://api.github.com/repos/googlei18n/libphonenumber/releases/latest | extractJsonProp tag_name)

if [ "$OLD_LIBP" = "$NEW_LIBP" ]; then
    echo "Already up to date with libphonenumber $NEW_LIBP"
    exit
fi

OLD_FSP=$(getCurrentFSPVersion)
NEW_FSP=$(getNewFSPVersion)

echo "==================UPGRADE=================="
echo "Current libphonenumber version: $OLD_LIBP"
echo "New libphonenumber version: $NEW_LIBP"
echo
echo "Current fullstack-phone version: $OLD_FSP"
echo "New fullstack-phone version: $NEW_FSP"
echo "==========================================="

npm run update -- $NEW_LIBP
npm run build
npm test --silent
updateRefs $OLD_LIBP $NEW_LIBP $OLD_FSP $NEW_FSP
git add -u
git commit -m "Update to libphonenumber $NEW_LIBP"

echo
echo "============================"
echo "Done upgrading. Ready for:"
echo "| npm version $NEW_FSP"
echo "| git push origin master"
echo "| git push origin v$NEW_FSP"
echo "| npm publish"
echo "============================"
