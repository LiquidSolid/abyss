#!/usr/bin/env sh

# остановить публикацию при ошибках
set -e

yarn build

cd dist
git init
git add -A
git commit -m 'deploy'
git push -f git@github.com:LiquidSolid/abyss.git master:gh-pages

cd -