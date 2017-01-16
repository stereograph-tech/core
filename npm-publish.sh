#!/bin/bash

pwd=$(pwd)
echo "Cleaning $pwd/dist directory..."
cd "$pwd/dist"
find . -type f -delete
find . -type d -delete
cd $pwd

echo 'Compiling TypeScript files...'
tsc

echo 'Updating git...'
git add . && git commit -m 'Version update' && git push origin master

echo 'Updating npm package version patch...'
npm version patch

echo 'Copying package.json to dist/...'
cp ./package.json ./dist/package.json 
cp ./README.md ./dist/README.md

echo 'Changing directory into dist/...'
cd ./dist

echo 'Publishing to NPM...'
npm publish --access public

echo 'Publish successful.'