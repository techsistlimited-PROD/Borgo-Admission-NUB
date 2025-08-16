# Fly.io Deployment Guide for Northern University Admission System

## Prerequisites

1. Install the Fly CLI: https://fly.io/docs/hands-on/install-flyctl/
2. Login to Fly.io: `fly auth login`

## Deployment Steps

### 1. Create Volume for Database (One-time setup)

```bash
fly volumes create data_volume --region fra --size 1
```

### 2. Deploy the Application

```bash
# Deploy (first time)
fly deploy

# Or if app already exists, just deploy updates
fly deploy
```

### 3. Check Application Status

```bash
# Check if app is running
fly status

# View logs
fly logs

# Open in browser
fly open
```

## Configuration

The application is configured with:

- **Port**: 3000 (internal)
- **Region**: Frankfurt (fra)
- **Memory**: 1GB
- **Database**: SQLite with persistent volume
- **Auto-scaling**: Enabled

## Environment Variables

Set in `fly.toml`:

- `NODE_ENV=production`
- `DATABASE_PATH=/app/data/database.sqlite`

## File Structure

```
/
├── Dockerfile              # Container configuration
├── fly.toml                # Fly.io app configuration
├── server/production.js    # Production server
└── dist/spa/              # Built React app (served statically)
```

## Troubleshooting

### Cannot GET / Error

This usually means:

1. Build failed - check `fly logs`
2. Server not serving static files properly
3. Database initialization failed

### Check Application Health

```bash
# Check health endpoint
curl https://your-app.fly.dev/health

# Check API
curl https://your-app.fly.dev/api/ping
```

### Database Issues

```bash
# Connect to machine and check database
fly ssh console

# Inside the machine:
ls -la /app/data/
```

### View Detailed Logs

```bash
fly logs --follow
```

## Test Credentials

Once deployed, test with:

**Admin Login:**

- Email: `admin@nu.edu.bd`
- Password: `admin123`

**Applicant Login:**

- University ID: `NU24MBA002`
- Password: `temp123456`

## Scaling

```bash
# Scale to multiple machines
fly scale count 2

# Scale memory
fly scale memory 2048
```
