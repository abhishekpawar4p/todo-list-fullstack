const taskModel = require('../models/taskModel');

// Get all tasks
const getTasks = async (req, res) => {
  try {
    const tasks = await taskModel.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get single task
const getTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await taskModel.getTaskById(id);
    
    if (!task) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create new task
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const newTask = await taskModel.createTask(title, description || '');
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update task
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed } = req.body;
    
    const updatedTask = await taskModel.updateTask(id, title, description, completed);
    
    if (!updatedTask) {
      return res.status(404).json({ error: 'Task not found' });
    }
    
    res.status(200).json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete task
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    await taskModel.deleteTask(id);
    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  deleteTask,
};