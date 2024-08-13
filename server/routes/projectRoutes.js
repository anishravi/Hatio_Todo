const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

const authenticate = require('../middleware/AuthenticateToken');

router.get('/', projectController.getAllProjects);
router.post('/',projectController.createProject);
router.put('/:projectId',projectController.updateProject);
router.get('/:projectId',projectController.fetchProjectById);

module.exports = router;
