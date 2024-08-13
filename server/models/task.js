const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Project = require('./project');

const Task = sequelize.define('Task', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('Pending', 'In Progress', 'Completed'),
    defaultValue: 'Pending'
  },
  projectId: {
    type: DataTypes.INTEGER,
    references: {
      model: 'Projects',
      key: 'id'
    }
  }
});

Task.belongsTo(Project, { foreignKey: 'projectId' }); 

module.exports = Task;
