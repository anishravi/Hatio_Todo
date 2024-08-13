const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');


const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty : true,
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.associate = (models)=>{
    User.hasMany(models.Project,{foreignKey: 'userId'})
}

module.exports = User;
