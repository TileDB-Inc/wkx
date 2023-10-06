#!/usr/bin/env bash

export GIT_TAG_VERSION=$(git describe --tags --abbrev=0)
export TMP_PACKAGE_JSON=/tmp/package.json
echo Publishing @tiledb-inc/tiledb-pydeck-tilelayer@$GIT_TAG_VERSION
# Update package.json's version with the tag from the release
jq ".version=\"${GIT_TAG_VERSION:1}\"" package.json > $TMP_PACKAGE_JSON && mv $TMP_PACKAGE_JSON package.json
if [[ $GIT_TAG_VERSION == *"beta"* ]];
then
echo "Publishing beta version $GIT_TAG_VERSION";
yarn npm publish --access public --tag beta
elif [[ $GIT_TAG_VERSION == *"alpha"* ]];
then
echo "Publishing alpha version $GIT_TAG_VERSION";
yarn npm publish --access public --tag alpha
else
echo "Publishing new version $GIT_TAG_VERSION";
yarn npm publish --access public
fi