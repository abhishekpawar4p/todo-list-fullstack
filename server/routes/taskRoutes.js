const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { strictLimiter } = require('../middleware/security');

// GET all tasks (no strict limit)
router.get('/', taskController.getTasks);

// GET single task by ID (no strict limit)
router.get('/:id', taskController.getTask);

// POST create new task (strict limit)
router.post('/', strictLimiter, taskController.createTask);

// PUT update task (strict limit)
router.put('/:id', strictLimiter, taskController.updateTask);

// DELETE task (strict limit)
router.delete('/:id', strictLimiter, taskController.deleteTask);

module.exports = router;