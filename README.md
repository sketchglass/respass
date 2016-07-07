# respass

[![CircleCI](https://circleci.com/gh/sketchglass/respass.svg?style=svg)](https://circleci.com/gh/sketchglass/respass)
[![Coverage Status](https://coveralls.io/repos/github/sketchglass/respass/badge.svg?branch=master)](https://coveralls.io/github/sketchglass/respass?branch=master)

## Run

```
cp .env.sample .env
typings install
npm install
createuser respass
createdb respass-dev
npm run db:migrate
npm start
```

## Test

```
createdb respass-test
npm test
```
