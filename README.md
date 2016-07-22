# respass

Websocket-based chat app implementation written in TypeScript

[Try now](https://respass.sketch-glass.io/)

[![CircleCI](https://circleci.com/gh/sketchglass/respass.svg?style=svg)](https://circleci.com/gh/sketchglass/respass)
[![Coverage Status](https://coveralls.io/repos/github/sketchglass/respass/badge.svg?branch=master)](https://coveralls.io/github/sketchglass/respass?branch=master)

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

## Notes

In production environment, you have to use this application with **https**. If not, the server will automatically redirect to https.

## Development

### With Docker

#### Prerequisites

- Docker
- Docker Compose

#### Build Images

```
docker-compose build
```

#### Update Typings and Node Modules
```
docker-compose run --entrypoint docker/init.sh respass
```

#### Run

```
docker-compose up
```

#### Test

```
docker-compose run --entrypoint docker/test.sh respass
```

### Manual

#### Prerequisites

- PostgreSQL
- NodeJS (>=6)

#### DB Settings

Create User `respass` with empty password.
```
createuser respass
createdb respass-dev
createdb respass-test
```

#### Run

```
cp .env.sample .env
npm install
npm run db:migrate
npm start
```

#### Testing

```
npm test
```

## CONTRIBUTING

See [CONTRIBUTING.md](CONTRIBUTING.md)

## LICENSE

MIT
