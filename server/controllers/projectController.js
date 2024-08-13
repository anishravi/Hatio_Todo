const Project = require('../models/project');
const Task = require('../models/task');
const User = require('../models/user');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.findAll({
      where:{userId: req.user.userId},
    });
    console.log(projects)
    res.json(projects);
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { title, description } = req.body;
    const newProject = await Project.create({
      title,
      description,
      userId: req.user.userId
    });
    res.status(201).json(newProject);
  } catch (error) {
    res.status(400).json({ error: 'Failed to create project' });
  }
};

exports.updateProject = async (req,res) =>{
  try {
    const project = await Project.findByPk(req.params.projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    if(project.userId!== req.user.userId){
      return res.status(403).json({ error: 'Forbidden: You are not authorized to update this project' });
    }
    await project.update(req.body);
    res.json(project);
  } catch (error) {
    console.error("Error updating project:", error);
    res.status(500).json({ error: 'Failed to update project' });
  }
}

exports.fetchProjectById = async (req, res) => {
  try {
    const project = await Project.findOne({
      where: { id: req.params.projectId }});

      const tasks = await Task.findAll({
        where: { ProjectId: req.params.projectId }
      })
      const projectDetails = project.get({ plain: true });
      const details = {
        ...projectDetails,
        tasks: tasks 
      };
      console.log(details)
    res.json(details);
  } catch (error) {
    console.error("Error fetching project:", error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
};
