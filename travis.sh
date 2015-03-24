#!/bin/sh
if [ "${TRAVIS_PULL_REQUEST}" != "false" ]; then
  echo "This is a PR, skip deploy."
  exit 0
fi

echo "DEBUG ENV: ${TRAVIS_JOB_NUMBER} ${TRAVIS_BUILD_NUMBER} ..."

if [ "${TRAVIS_BUILD_NUMBER}.1" != "${TRAVIS_JOB_NUMBER}" ]; then
  echo "Only run extra tasks 1 time 1 commit... quit."
  exit 0
fi

if [ "${TRAVIS_REPO_SLUG}" != "zordius/gulp-jsx-coverage" ]; then
  echo "Skip deploy because this is a fork... quit."
  exit 0
fi

# Setup git
git config --global user.name "Travis-CI"
git config --global user.email "zordius@yahoo-inc.com"

# push coverage examples
cd coverage
git init
git add .
git commit -m "Auto deployed to Github Pages from branch ${TRAVIS_BRANCH} @${TRAVIS_COMMIT} [ci skip]"
git push --force --quiet "https://${GHTK}@github.com/zordius/gulp-jsx-coverage.git" master:gh-pages > /dev/null 2>&1
