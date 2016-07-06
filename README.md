# respass

[![CircleCI](https://circleci.com/gh/sketchglass/respass.svg?style=svg)](https://circleci.com/gh/sketchglass/respass)

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
