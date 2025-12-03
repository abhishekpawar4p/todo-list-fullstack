# Docker Documentation

## Overview

This application is containerized using Docker with two services:
- **PostgreSQL Database** - postgres:14-alpine
- **Node.js API** - Custom built from Dockerfile

## Prerequisites

- Docker Desktop installed and running
- Docker Hub account (signed in)

## Quick Start

### Start all containers:
```bash
docker-compose up
```

### Start in background (detached mode):
```bash
docker-compose up -d
```

### Stop all containers:
```bash
docker-compose down
```

### Stop and remove all data:
```bash
docker-compose down -v
```

### Rebuild and start:
```bash
docker-compose up --build
```

## Useful Docker Commands

### View running containers:
```bash
docker ps
```

### View all containers (including stopped):
```bash
docker ps -a
```

### View logs:
```bash
docker-compose logs          # All services
docker-compose logs api      # API only
docker-compose logs db       # Database only
docker-compose logs -f       # Follow logs (live)
```

### Execute commands inside containers:
```bash
# Access API container bash
docker exec -it todolist_api sh

# Access PostgreSQL
docker exec -it todolist_db psql -U todo_user -d todolist_db
```

### Check container health:
```bash
docker inspect todolist_api | grep -A 10 Health
docker inspect todolist_db | grep -A 10 Health
```

### Remove all stopped containers:
```bash
docker container prune
```

### Remove all unused images:
```bash
docker image prune -a
```

### View disk usage:
```bash
docker system df
```

## Environment Variables

Environment variables are set in `docker-compose.yml`:

**Database:**
- `POSTGRES_USER` - Database username
- `POSTGRES_PASSWORD` - Database password
- `POSTGRES_DB` - Database name

**API:**
- `DB_HOST` - Database hostname (container name: `db`)
- `DB_PORT` - Database port (5432)
- `PORT` - API port (3000)
- `NODE_ENV` - Environment (production)

## Volumes

**postgres_data** - Persistent storage for database
- Location: Docker managed volume
- Data persists even when containers stop
- To reset: `docker-compose down -v`

## Networking

Both containers run on the same Docker network:
- API connects to database using hostname `db`
- External access: `localhost:3000` (API), `localhost:5432` (DB)

## Health Checks

**Database Health Check:**
- Command: `pg_isready -U todo_user -d todolist_db`
- Interval: Every 10 seconds
- Retries: 5 times

**API Health Check:**
- Endpoint: `http://localhost:3000/api/health`
- Interval: Every 30 seconds
- Start period: 40 seconds (wait for DB)

## Troubleshooting

### Port already in use:
```bash
# Find and kill process on port 3000
lsof -ti :3000 | xargs kill -9

# Or stop local PostgreSQL
brew services stop postgresql@14
```

### Container won't start:
```bash
# Check logs
docker-compose logs api

# Restart containers
docker-compose restart
```

### Database connection error:
```bash
# Check if database is healthy
docker ps

# Check database logs
docker-compose logs db

# Restart database
docker-compose restart db
```

### Reset everything:
```bash
# Stop and remove containers, networks, volumes
docker-compose down -v

# Remove all images
docker system prune -a

# Start fresh
docker-compose up --build
```

## Production Deployment

For production deployment:

1. **Use secrets management** (not environment variables in docker-compose)
2. **Use Docker Swarm or Kubernetes** for orchestration
3. **Set up load balancing** for multiple API instances
4. **Configure backups** for database volume
5. **Use reverse proxy** (Nginx) in front of API
6. **Enable SSL/TLS** certificates

## File Structure
```
.
├── Dockerfile              # API container definition
├── docker-compose.yml      # Multi-container orchestration
├── .dockerignore          # Files to exclude from image
└── server/                # Application code
```

## Testing

To run tests in Docker:
```bash
# Build test image
docker build -t todolist-test --target test .

# Run tests
docker run --rm todolist-test npm test
```

## CI/CD Integration

Docker images can be built automatically in CI/CD pipelines:
```yaml
# Example GitHub Actions
- name: Build Docker image
  run: docker build -t todolist-api .

- name: Run tests
  run: docker-compose up -d && npm test
```