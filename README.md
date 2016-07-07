# respass



[![CircleCI](https://circleci.com/gh/sketchglass/respass.svg?style=svg)](https://circleci.com/gh/sketchglass/respass)
[![Coverage Status](https://coveralls.io/repos/github/sketchglass/respass/badge.svg)](https://coveralls.io/github/sketchglass/respass)

## Prerequisites

- PostgreSQL
- NodeJS (higher than 6.0)

## DB Settings

Create User `respass`
```
createuser respass
createdb respass-dev
```

## Run

```
cp .env.sample .env
typings install
npm install
npm run db:migrate
npm start
```

## Test

```
createdb respass-test
npm test
```
