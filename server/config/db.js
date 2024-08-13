const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('mysql://root:root@localhost:3306/todomanager');

module.exports = sequelize;
