const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Project = sequelize.define('Project', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  userId:{
    type:DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'Users',
      key: 'id'
    }
  }
});
Project.associate = (models) => {
  Project.belongsTo(models.User, { foreignKey: 'userId' });
  Project.hasMany(models.Task, { foreignKey: 'projectId' });
};

module.exports = Project;
