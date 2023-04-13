'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const catModel = require('./cat/model.js');
const userModel = require('./users/model.js');
const Collection = require('./data-collection.js');

const DATABASE_URL = process.env.DATABASE_URL || 'sqlite:memory:';

const sequelize = new Sequelize(DATABASE_URL);
const cat = catModel(sequelize, DataTypes);
const users = userModel(sequelize, DataTypes);

module.exports = {
  db: sequelize,
  cat: new Collection(cat),
  users: new Collection(users),
};
