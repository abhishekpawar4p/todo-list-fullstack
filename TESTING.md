# Testing Documentation

## Test Coverage

Current test coverage: **90.47%**

## Running Tests

### Run all tests:
```bash
npm test
```

### Run tests in watch mode:
```bash
npm run test:watch
```

## Test Structure

### Unit Tests
- Located in: `server/tests/`
- Framework: Jest
- API Testing: Supertest

### Test Cases

#### Health Check
- ✅ Verifies server is running

#### GET /api/tasks
- ✅ Returns all tasks as array

#### POST /api/tasks
- ✅ Creates new task with valid data
- ✅ Returns 400 error without title

#### GET /api/tasks/:id
- ✅ Returns single task by ID
- ✅ Returns 404 for non-existent task

#### PUT /api/tasks/:id
- ✅ Updates task successfully

#### DELETE /api/tasks/:id
- ✅ Deletes task successfully
- ✅ Verifies task is removed

## Coverage Report

Run tests with coverage:
```bash
npm test
```

View detailed HTML coverage report:
```bash
open coverage/lcov-report/index.html
```

## CI/CD Integration

Tests run automatically on:
- Pull requests
- Push to main branch
- Pre-deployment checks