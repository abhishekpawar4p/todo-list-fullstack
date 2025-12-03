# CI/CD Documentation

## Overview

This project uses **GitHub Actions** for continuous integration and deployment.

## Pipeline Stages

### 1. Test Stage
- **Trigger:** Every push and pull request
- **Actions:**
  - Sets up PostgreSQL test database
  - Installs Node.js dependencies
  - Runs Jest test suite
  - Uploads coverage reports to Codecov
- **Duration:** ~2 minutes

### 2. Lint Stage
- **Trigger:** Runs in parallel with tests
- **Actions:**
  - Code quality checks
  - Formatting validation
- **Duration:** ~30 seconds

### 3. Build Stage
- **Trigger:** After tests pass
- **Actions:**
  - Builds Docker image
  - Tests Docker image functionality
  - Tags with commit SHA
- **Duration:** ~1 minute

### 4. Security Stage
- **Trigger:** Every push
- **Actions:**
  - npm audit for vulnerabilities
  - Dependency security checks
- **Duration:** ~20 seconds

### 5. Deploy Stage
- **Trigger:** Only on main branch, after all tests pass
- **Actions:**
  - Deployment notification
  - Ready for manual/automatic deployment
- **Duration:** ~10 seconds

## Workflow File

Location: `.github/workflows/ci-cd.yml`

## Branch Protection Rules

**Recommended settings for main branch:**
1. Require pull request reviews
2. Require status checks to pass:
   - test
   - lint
   - build
3. Require branches to be up to date
4. Include administrators

## Viewing Pipeline Results

1. Go to your GitHub repository
2. Click **"Actions"** tab
3. View all workflow runs
4. Click on any run to see details

## Local Testing Before Push

Run these commands locally before pushing:
```bash
# Run tests
npm test

# Build Docker image
docker build -t todolist-api .

# Check for vulnerabilities
npm audit
```

## Troubleshooting

### Tests fail in CI but pass locally:
- Check PostgreSQL connection
- Verify environment variables
- Check Node.js version match

### Docker build fails:
- Check Dockerfile syntax
- Verify all files are committed
- Check .dockerignore isn't excluding necessary files

### Security audit fails:
```bash
# Update vulnerable packages
npm audit fix

# Force update (may break things)
npm audit fix --force
```

## Secrets Management

For production deployment, add secrets in GitHub:

1. Go to Settings → Secrets and variables → Actions
2. Add secrets:
   - `DB_PASSWORD` - Production database password
   - `DOCKER_USERNAME` - Docker Hub username
   - `DOCKER_PASSWORD` - Docker Hub password
   - `DEPLOY_KEY` - SSH key for deployment

## Deployment Strategies

### Manual Deployment:
- Approve deployment in GitHub Actions
- SSH into server
- Pull latest Docker image
- Restart containers

### Automatic Deployment:
- Add deployment step to workflow
- Deploy to cloud provider (AWS, Heroku, DigitalOcean)
- Use Docker registry (Docker Hub, GitHub Container Registry)

## Monitoring

After deployment, monitor:
- Application logs: `docker-compose logs -f`
- Error rates
- Response times
- Database performance

## Rollback Procedure

If deployment fails:
```bash
# Pull previous working image
docker pull todolist-api:previous-commit-sha

# Restart with previous version
docker-compose up -d
```

## Badge Status

The CI/CD badge in README.md shows:
- ✅ Green (passing) - All checks passed
- ❌ Red (failing) - Some checks failed
- 🟡 Yellow (pending) - Pipeline running