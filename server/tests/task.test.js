const request = require('supertest');
const app = require('../server');
const pool = require('../config/database');

// Test data
let testTaskId;

describe('Task API Tests', () => {
  
  // Run before all tests - clean up test data
  beforeAll(async () => {
    // Delete any existing test tasks
    await pool.query("DELETE FROM tasks WHERE title LIKE 'Test Task%'");
  });

  // Run after all tests - close database connection
  afterAll(async () => {
    await pool.end();
  });

  // Test 1: Health check endpoint
  describe('GET /api/health', () => {
    it('should return server status', async () => {
      const response = await request(app).get('/api/health');
      
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('OK');
      expect(response.body.message).toBe('Server is running');
    });
  });

  // Test 2: Get all tasks
  describe('GET /api/tasks', () => {
    it('should return all tasks', async () => {
      const response = await request(app).get('/api/tasks');
      
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  // Test 3: Create a new task
  describe('POST /api/tasks', () => {
    it('should create a new task', async () => {
      const newTask = {
        title: 'Test Task 1',
        description: 'This is a test task'
      };

      const response = await request(app)
        .post('/api/tasks')
        .send(newTask);

      expect(response.status).toBe(201);
      expect(response.body.title).toBe(newTask.title);
      expect(response.body.description).toBe(newTask.description);
      expect(response.body.completed).toBe(false);
      expect(response.body).toHaveProperty('id');
      
      // Save ID for later tests
      testTaskId = response.body.id;
    });

    it('should not create task without title', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .send({ description: 'No title' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Title is required');
    });
  });

  // Test 4: Get single task
  describe('GET /api/tasks/:id', () => {
    it('should return a single task', async () => {
      const response = await request(app).get(`/api/tasks/${testTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(testTaskId);
      expect(response.body.title).toBe('Test Task 1');
    });

    it('should return 404 for non-existent task', async () => {
      const response = await request(app).get('/api/tasks/99999');

      expect(response.status).toBe(404);
      expect(response.body.error).toBe('Task not found');
    });
  });

  // Test 5: Update task
  describe('PUT /api/tasks/:id', () => {
    it('should update a task', async () => {
      const updatedTask = {
        title: 'Test Task 1 Updated',
        description: 'Updated description',
        completed: true
      };

      const response = await request(app)
        .put(`/api/tasks/${testTaskId}`)
        .send(updatedTask);

      expect(response.status).toBe(200);
      expect(response.body.title).toBe(updatedTask.title);
      expect(response.body.description).toBe(updatedTask.description);
      expect(response.body.completed).toBe(true);
    });
  });

  // Test 6: Delete task
  describe('DELETE /api/tasks/:id', () => {
    it('should delete a task', async () => {
      const response = await request(app).delete(`/api/tasks/${testTaskId}`);

      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Task deleted successfully');
    });

    it('should verify task is deleted', async () => {
      const response = await request(app).get(`/api/tasks/${testTaskId}`);

      expect(response.status).toBe(404);
    });
  });
});