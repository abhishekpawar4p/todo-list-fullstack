-- Drop table if exists (useful for development)
DROP TABLE IF EXISTS tasks;

-- Create tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX idx_tasks_completed ON tasks(completed);

-- Sample data for testing
INSERT INTO tasks (title, description, completed) VALUES
('Learn Node.js', 'Complete Node.js tutorial', false),
('Setup PostgreSQL', 'Install and configure database', true),
('Build API', 'Create RESTful API endpoints', false);