var knex = require('./knex');
console.log(knex);
module.exports = require('bookshelf')(knex);