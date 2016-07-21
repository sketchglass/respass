require('dotenv').config({silent: true});

const {DATABASE_URL, DATABASE_URL_DEV, DATABASE_URL_TEST} = process.env

module.exports = {
  production: {
    url: DATABASE_URL,
    dialect: "postgres",
  },
  development: {
    url: DATABASE_URL_DEV || "postgres://respass:@localhost/respass-dev",
    dialect: "postgres",
  },
  test: {
    url: DATABASE_URL_TEST || "postgres://respass:@localhost/respass-test",
    dialect: "postgres",
  },
}
