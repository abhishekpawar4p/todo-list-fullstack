const pool = require('../config/database');

// Get all tasks
const getAllTasks = async () => {
  const result = await pool.query(
    'SELECT * FROM tasks ORDER BY created_at DESC'
  );
  return result.rows;
};

// Get task by ID
const getTaskById = async (id) => {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1',
    [id]
  );
  return result.rows[0];
};

// Create new task
const createTask = async (title, description) => {
  const result = await pool.query(
    'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
    [title, description]
  );
  return result.rows[0];
};

// Update task
const updateTask = async (id, title, description, completed) => {
  const result = await pool.query(
    'UPDATE tasks SET title = $1, description = $2, completed = $3, updated_at = CURRENT_TIMESTAMP WHERE id = $4 RETURNING *',
    [title, description, completed, id]
  );
  return result.rows[0];
};

// Delete task
const deleteTask = async (id) => {
  await pool.query('DELETE FROM tasks WHERE id = $1', [id]);
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};