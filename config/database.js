// // config/database.js
// const { Sequelize } = require('sequelize');
// require('dotenv').config();



// const sequelize = new Sequelize({
//   dialect: 'mysql',
//   host: process.env.DB_HOST,
//   port: process.env.DB_PORT,
//   username: process.env.DB_USER,
//   password: process.env.DB_PASSWORD,
//   database: process.env.DB_DATABASE
// });

// module.exports = sequelize;

const config = require('../knexfile')['development'];
const knex = require('knex')(config);

module.exports = knex;