'use strict'

require('dotenv').config();
const { DataTypes } = require('sequelize');

const Cat = (sequelize) => sequelize.define('Cat', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false,
    required: true
  },
  sex: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true
  },
  breed: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true
  },
  user_Id: {
    type: DataTypes.INTEGER,
    allowNull: true,
    required: false,
  },
  note: {
    type: DataTypes.STRING,
    allowNull: false,
    required: true,
    defaultValue: ''
  }
});

module.exports = Cat;
