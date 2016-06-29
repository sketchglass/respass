"use strict";
const Sequelize = require("sequelize");
exports.sequelize = new Sequelize('sample', '', '', { dialect: 'sqlite', storage: './sample.db' });
exports.Message = exports.sequelize.define('message', {
    text: Sequelize.STRING,
});
