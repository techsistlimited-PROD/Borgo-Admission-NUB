# Northern University Admission System - Deployment Guide

## Production Deployment

This application is configured for deployment on Netlify with the following architecture:

### Architecture

- **Frontend**: React SPA built with Vite
- **Backend**: Express.js API running as Netlify Functions
- **Database**: SQLite with automatic initialization
- **Authentication**: JWT-based auth system

### Deployment Steps

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Connect your repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist/spa`
   - Deploy!

### Environment Variables

For production, set these environment variables in Netlify:

```
NODE_ENV=production
VITE_API_URL=/api
```

### Database Initialization

The database will be automatically initialized on the first API request with:

- Admin users
- Sample programs and departments
- Employee referrers
- Sample applications

### Test Credentials

**Admin Login:**

- Email: `admin@nu.edu.bd`
- Password: `admin123`

**Applicant Login:**

- University ID: `NU24MBA002`
- Password: `temp123456`

### File Structure

```
dist/
├── spa/                    # Frontend build (served by Netlify)
│   ├── index.html
│   └── assets/
└── server/                 # Backend build (used by functions)
    └── node-build.mjs

netlify/
└── functions/
    └── api.ts             # Serverless function handler
```

### API Routes

All API endpoints are available at `/api/*`:

- `/api/auth/*` - Authentication
- `/api/applications/*` - Application management
- `/api/programs/*` - Program data
- `/api/referrers/*` - Referrer management

### Troubleshooting

If you see "Cannot GET /" error:

1. Check that the build completed successfully
2. Verify netlify.toml redirects are configured
3. Ensure publish directory is set to `dist/spa`

The application uses client-side routing, so all routes must redirect to index.html.
