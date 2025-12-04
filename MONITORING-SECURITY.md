# Monitoring & Security Documentation

## Overview

This application implements enterprise-grade monitoring, logging, and security features.

## Security Features

### 1. Helmet - HTTP Security Headers

**What it does:**
- Sets secure HTTP headers
- Protects against common vulnerabilities (XSS, clickjacking, etc.)
- Implements Content Security Policy (CSP)
- Enables HTTP Strict Transport Security (HSTS)

**Headers added:**
- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`
- `Strict-Transport-Security: max-age=31536000`

**Test it:**
```bash
curl -I http://localhost:3000/api/health
```

### 2. Rate Limiting

**Two tiers of protection:**

**General API Rate Limit:**
- 100 requests per 15 minutes per IP
- Applies to all `/api/*` routes
- Prevents abuse and DDoS attacks

**Strict Rate Limit (Write Operations):**
- 50 requests per 15 minutes per IP
- Applies to POST, PUT, DELETE operations
- Prevents data manipulation attacks

**Test rate limiting:**
```bash
# Test strict limit (should block after 50)
for i in {1..55}; do 
  curl -X POST http://localhost:3000/api/tasks \
    -H "Content-Type: application/json" \
    -d '{"title":"Test"}'; 
  echo " - Request $i"; 
done
```

**Bypass in development:**
To disable rate limiting for testing, comment out in `server.js`:
```javascript
// app.use('/api/', limiter);
```

### 3. CORS (Cross-Origin Resource Sharing)

**Configuration:**
- Allows requests from any origin (development)
- In production, restrict to specific domains:
```javascript
app.use(cors({
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true
}));
```

### 4. Input Validation

**Validation in controllers:**
- Required field checks (title must be present)
- Data type validation
- SQL injection prevention (parameterized queries)

**Example:**
```javascript
if (!title) {
  return res.status(400).json({ error: 'Title is required' });
}
```

## Logging System

### 1. HTTP Request Logging (Morgan)

**Development Mode:**
- Logs to console with color coding
- Format: `METHOD /path STATUS time - size`
- Example: `GET /api/tasks 200 15.234 ms - 1234`

**Production Mode:**
- Logs to file: `logs/access.log`
- Format: Apache combined log format
- Includes IP, timestamp, user agent, etc.

**Log rotation (recommended for production):**
```bash
npm install rotating-file-stream
```

### 2. Error Logging

**Error logs saved to:** `logs/error.log`

**What gets logged:**
- Stack traces
- Timestamp
- Request details
- Error messages

**View error logs:**
```bash
tail -f logs/error.log
```

### 3. Performance Monitoring

**Slow Request Detection:**
- Automatically warns if requests take > 1 second
- Logs: `⚠️  Slow request: POST /api/tasks took 1234ms`

**Monitor in real-time:**
Watch terminal output while server runs

### 4. Health Check Endpoint

**Endpoint:** `GET /api/health`

**Response:**
```json
{
  "status": "OK",
  "message": "Server is running",
  "timestamp": "2025-12-04T01:54:57.571Z",
  "uptime": 10631.902,
  "environment": "development"
}
```

**Use for:**
- Kubernetes/Docker health checks
- Load balancer health checks
- Monitoring systems (Datadog, New Relic)

**Test it:**
```bash
curl http://localhost:3000/api/health
```

## Log Files

### Log Directory Structure
```
logs/
├── access.log    # HTTP request logs (production)
└── error.log     # Error logs (production)
```

### Viewing Logs

**All access logs:**
```bash
cat logs/access.log
```

**Last 50 lines:**
```bash
tail -50 logs/access.log
```

**Follow logs in real-time:**
```bash
tail -f logs/access.log
```

**Search logs:**
```bash
grep "POST" logs/access.log
grep "500" logs/access.log
grep "Error" logs/error.log
```

### Log Analysis

**Count requests by method:**
```bash
cat logs/access.log | awk '{print $6}' | sort | uniq -c
```

**Count status codes:**
```bash
cat logs/access.log | awk '{print $9}' | sort | uniq -c
```

**Find slowest requests:**
```bash
grep "Slow request" logs/access.log
```

## Monitoring Best Practices

### 1. Set Up Alerts

**Monitor for:**
- Error rate spikes
- Slow response times (> 1s)
- Rate limit hits
- Database connection failures
- High memory usage

### 2. Log Retention

**Recommended retention:**
- Access logs: 30 days
- Error logs: 90 days
- Archive older logs to S3/cloud storage

**Implement log rotation:**
```javascript
// Use rotating-file-stream
const rfs = require('rotating-file-stream');
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d',    // Rotate daily
  path: path.join(__dirname, 'logs'),
  maxFiles: 30       // Keep 30 days
});
```

### 3. Metrics to Track

**Application Metrics:**
- Request rate (requests/second)
- Response time (average, p95, p99)
- Error rate (%)
- Database query time
- Memory usage
- CPU usage

**Business Metrics:**
- Tasks created per day
- Active users
- API usage by endpoint

### 4. Monitoring Tools (Production)

**Recommended services:**
- **Datadog** - Full observability platform
- **New Relic** - Application performance monitoring
- **Sentry** - Error tracking and monitoring
- **LogDNA/LogRocket** - Log management
- **Prometheus + Grafana** - Self-hosted monitoring

## Security Best Practices

### 1. Environment Variables

**Never commit:**
- Database passwords
- API keys
- Secret tokens

**Always use `.env` file and add to `.gitignore`**

### 2. HTTPS in Production

**Enable SSL/TLS:**
- Use Let's Encrypt for free certificates
- Use reverse proxy (Nginx) with SSL
- Redirect HTTP to HTTPS

### 3. Database Security

**Best practices:**
- Use strong passwords
- Limit database user permissions
- Use connection pooling
- Enable SSL for database connections
- Regular backups

### 4. Input Sanitization

**Already implemented:**
- Parameterized queries (prevents SQL injection)
- JSON parsing limits
- URL encoding

**Additional protection:**
```bash
npm install express-validator
```

### 5. Authentication (Future Enhancement)

**Recommended for production:**
- JWT tokens
- Password hashing (bcrypt)
- Session management
- OAuth integration

## Troubleshooting

### High Error Rate

**Check:**
```bash
grep "500" logs/access.log | wc -l
tail -100 logs/error.log
```

**Common causes:**
- Database connection issues
- Memory leaks
- Slow queries

### Rate Limit Issues

**Increase limits temporarily:**
```javascript
// In server/middleware/security.js
max: 200  // Increase from 100
```

**Check rate limit hits:**
```bash
grep "429" logs/access.log
```

### Slow Performance

**Identify slow endpoints:**
```bash
grep "Slow request" logs/access.log
```

**Optimize:**
- Add database indexes
- Implement caching
- Optimize queries

### Memory Leaks

**Monitor memory:**
```javascript
console.log(process.memoryUsage());
```

**Check for:**
- Unclosed database connections
- Large object retention
- Event listener leaks

## Testing Security Features

### Test Rate Limiting
```bash
# Should see error after 50 requests
for i in {1..55}; do curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" -d '{"title":"Test"}'; done
```

### Test Error Handling
```bash
# Send invalid data
curl -X POST http://localhost:3000/api/tasks \
  -H "Content-Type: application/json" -d '{invalid json}'
```

### Test Security Headers
```bash
curl -I http://localhost:3000/api/health | grep -E "X-|Strict"
```

## Production Deployment Checklist

- [ ] Change `NODE_ENV=production` in .env
- [ ] Enable HTTPS/SSL
- [ ] Set up log rotation
- [ ] Configure monitoring alerts
- [ ] Restrict CORS origins
- [ ] Review rate limits
- [ ] Set up database backups
- [ ] Enable firewall rules
- [ ] Set strong passwords
- [ ] Configure error tracking (Sentry)
- [ ] Set up health check monitoring
- [ ] Review security headers
- [ ] Implement authentication
- [ ] Set up CI/CD pipeline
- [ ] Configure auto-scaling
- [ ] Test disaster recovery

## Maintenance Tasks

### Daily
- Check error logs
- Monitor response times
- Verify health checks

### Weekly
- Review security alerts
- Analyze traffic patterns
- Check disk space

### Monthly
- Update dependencies (`npm audit fix`)
- Review and rotate logs
- Test backup restoration
- Security audit

## Resources

- [Helmet Documentation](https://helmetjs.github.io/)
- [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)
- [Morgan Logging](https://github.com/expressjs/morgan)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)