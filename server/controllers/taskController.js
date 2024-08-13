const Task = require("../models/task");
exports.getTasksByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const tasks = await Task.findAll({ where: { ProjectId: projectId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

exports.getTasksById = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const tasks = await Task.findOne({ where: { id: taskId } });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { projectId } = req.params;
    const task = await Task.create({ ...req.body, projectId: projectId });
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: "Failed to create task" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const updatedTask = await Task.update(req.body, { where: { id: taskId } });
    res.json({ message: "Task updated successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to update task" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const deletedtask = await Task.destroy({ where: { id: taskId } });
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Failed to delete task" });
  }
};
