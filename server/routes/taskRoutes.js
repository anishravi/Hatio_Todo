const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

router.get('/:projectId/tasks', taskController.getTasksByProject);
router.post('/:projectId/tasks', taskController.createTask);
router.get('/:projectId/tasks/:taskId', taskController.getTasksById);
router.patch('/:projectId/tasks/:taskId', taskController.updateTask);
router.delete('/:projectId/tasks/:taskId', taskController.deleteTask);

module.exports = router;
