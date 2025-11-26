# API Design Document

## Base URL
`http://localhost:3000/api`

## Endpoints

### 1. Get All Tasks
- **Method:** GET
- **URL:** `/tasks`
- **Response:** Array of task objects
```json
[
  {
    "id": 1,
    "title": "Learn Node.js",
    "description": "Complete tutorial",
    "completed": false,
    "created_at": "2024-11-25T10:00:00Z"
  }
]
```

### 2. Get Single Task
- **Method:** GET
- **URL:** `/tasks/:id`
- **Response:** Single task object

### 3. Create Task
- **Method:** POST
- **URL:** `/tasks`
- **Body:**
```json
{
  "title": "Task title",
  "description": "Task description"
}
```

### 4. Update Task
- **Method:** PUT
- **URL:** `/tasks/:id`
- **Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "completed": true
}
```

### 5. Delete Task
- **Method:** DELETE
- **URL:** `/tasks/:id`
- **Response:** Success message