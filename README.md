# respass



[![CircleCI](https://circleci.com/gh/sketchglass/respass.svg?style=svg)](https://circleci.com/gh/sketchglass/respass)
[![Coverage Status](https://coveralls.io/repos/github/sketchglass/respass/badge.svg?branch=master)](https://coveralls.io/github/sketchglass/respass?branch=master)

## Prerequisites

- PostgreSQL
- NodeJS (>=6)

## DB Settings

Create User `respass` with empty password.
```
createuser respass
createdb respass-dev
createdb respass-test
```

## Run

```
cp .env.sample .env
typings install
npm install
npm run db:migrate
npm start
```

## Testing

```
npm test
```

## CONTRIBUTING

See (CONTRIBUTING.md)[CONTRIBUTING.md]

## LICENSE

MIT
