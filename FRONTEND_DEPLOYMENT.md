# Frontend-Only Deployment Guide

This document provides step-by-step instructions for deploying the Northern University Admission Portal frontend application.

## 🚀 Quick Deployment Options

### Option 1: Netlify (Recommended)

#### Manual Deployment

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Deploy to Netlify**:
   - Go to [netlify.com](https://netlify.com)
   - Drag and drop the `dist/` folder
   - Your site will be live instantly

#### Git-based Deployment (Continuous Deployment)

1. **Connect Repository**:

   - Connect your GitHub repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables** (if needed for backend integration later):
   ```
   VITE_API_URL=https://your-backend-api.com/api
   ```

### Option 2: Vercel

#### Using Vercel CLI

1. **Install Vercel CLI**:

   ```bash
   npm i -g vercel
   ```

2. **Deploy**:
   ```bash
   npm run build
   vercel --prod
   ```

#### Using GitHub Integration

1. Connect your repository to Vercel
2. Vercel will auto-detect Vite and deploy automatically

### Option 3: Static Hosting (Any Provider)

#### Build and Upload

1. **Build the application**:

   ```bash
   npm run build
   ```

2. **Upload** the `dist/` folder to any static hosting provider:
   - GitHub Pages
   - AWS S3 + CloudFront
   - Firebase Hosting
   - Surge.sh
   - Any web hosting with static file support

## 🔧 Build Configuration

The application is configured to build as a static site with these settings:

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./client"),
    },
  },
  root: "./client",
  build: {
    outDir: "../dist",
    emptyOutDir: true,
  },
  server: {
    port: 3000,
    host: true,
  },
});
```

## 📁 Build Output

After running `npm run build`, you'll get:

```
dist/
├── index.html          # Main entry point
├── assets/
│   ├── index-[hash].js # Main JavaScript bundle
│   ├── index-[hash].css # Styles
���   └── [images/fonts]  # Static assets
└── robots.txt          # SEO file
```

## 🌐 SPA Routing Configuration

Since this is a Single Page Application (SPA), configure your hosting to redirect all routes to `index.html`:

### Netlify (\_redirects file)

Create `public/_redirects`:

```
/*    /index.html   200
```

### Vercel (vercel.json)

Create `vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Apache (.htaccess)

Create `public/.htaccess`:

```apache
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]
```

### Nginx

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

## 🔐 Environment Variables for Production

If you plan to connect to a real backend later, set these environment variables:

```env
# Backend API URL
VITE_API_URL=https://api.yourdomain.com

# Payment Gateway URLs
VITE_BKASH_URL=https://checkout.pay.bka.sh
VITE_SSL_COMMERZ_URL=https://securepay.sslcommerz.com

# File Upload Service
VITE_UPLOAD_URL=https://files.yourdomain.com

# Analytics (optional)
VITE_GA_TRACKING_ID=UA-XXXXXXXXX-X
```

## 📊 Performance Optimization

The build is already optimized with:

- **Code Splitting**: Automatic by Vite
- **Tree Shaking**: Dead code elimination
- **Asset Optimization**: Images and fonts optimized
- **Gzip Compression**: Enable on your hosting provider
- **CDN**: Use your hosting provider's CDN

### Additional Optimizations

1. **Enable Gzip/Brotli** on your server
2. **Set proper cache headers** for static assets
3. **Use a CDN** for global distribution
4. **Enable HTTP/2** on your hosting

## 🔍 SEO Configuration

### Meta Tags

The application includes proper meta tags in `index.html`:

```html
<meta name="description" content="Northern University Admission Portal" />
<meta name="keywords" content="university, admission, bangladesh, education" />
<meta property="og:title" content="Northern University" />
<meta property="og:description" content="Apply for admission online" />
```

### Robots.txt

Included in `public/robots.txt`:

```
User-agent: *
Allow: /

Sitemap: https://yourdomain.com/sitemap.xml
```

## 🚨 Important Notes

### Demo Mode

The application currently runs in **demo mode** with mock data:

- No real backend required
- All data is simulated
- Perfect for showcasing features

### Production Readiness

To make this production-ready:

1. **Connect Real Backend**: Replace mock API with real endpoints
2. **Real Payment Gateway**: Integrate actual payment services
3. **File Storage**: Implement real file upload/storage
4. **Authentication**: Use real user authentication
5. **Database**: Connect to actual database

### URLs and Routing

The application supports these main routes:

- `/` - Home page
- `/program-selection` - Application form
- `/applicant-portal` - Student login
- `/admin` - Admin login
- `/admin/admissions` - Admin dashboard

## 🔧 Troubleshooting

### Build Issues

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
npx vite build --force
```

### Routing Issues

- Ensure SPA redirect rules are configured
- Check that `index.html` is served for all routes

### Asset Loading Issues

- Verify all assets are in `dist/` after build
- Check asset paths are relative, not absolute

## 📞 Support

For deployment support:

- **Technical Issues**: Check the GitHub repository issues
- **Hosting Questions**: Contact your hosting provider
- **General Support**: Refer to the main README.md

---

**Ready to Deploy!** Your Northern University Admission Portal frontend is fully self-contained and ready for deployment to any static hosting provider.
