const User = require('./user');
const Project = require('./project');

User.associate({ Project });
Project.associate({ User });

module.exports = { User, Project };
