const {DATABASE_URL} = process.env

module.exports = {
  production: {
    url: DATABASE_URL,
    dialect: "postgres",
  },
  development: {
    url: "postgres://respass:@localhost/respass-dev",
    dialect: "postgres",
  },
  test: {
    url: "postgres://respass:@localhost/respass-test",
    dialect: "postgres",
  },
}
