# 🚀 Deployment Guide for Builder.io

## Quick Setup Steps

### 1. **Create New Builder.io Project**
1. Go to [Builder.io](https://builder.io)
2. Click "Create Project" 
3. Choose "React" as your framework
4. Give it a name like "University Registration System"

### 2. **Upload Project Files**
1. **Method 1**: Drag and drop the entire `registration-system-standalone` folder
2. **Method 2**: Use Git integration if you have a GitHub repo
3. **Method 3**: Upload via ZIP file

### 3. **Configure Build Settings**
In Builder.io project settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`
- **Node Version**: 18+

### 4. **Deploy**
1. Click "Deploy" button in Builder.io
2. Wait for build completion (usually 2-3 minutes)
3. Your app will be available at a Builder.io URL

## 📱 Access Points

After deployment, your system will be available at:
- **Landing Page**: `https://your-builderio-url.com/`
- **Student Login**: `https://your-builderio-url.com/student-login`
- **Advisor Login**: `https://your-builderio-url.com/advisor-login`
- **Admin Login**: `https://your-builderio-url.com/admin-login`

## 🔐 Demo Credentials

### Student Portal
- **ID**: `2021-1-60-001`
- **Password**: `student123`

### Advisor Portal
- **ID**: `ADV001`
- **Password**: `advisor123`

### Admin Portal
- **Username**: `admin`
- **Password**: `admin123`

## 🛠 Environment Variables (Optional)

If you need to configure environment variables:
1. Go to Project Settings in Builder.io
2. Add environment variables:
   ```
   VITE_APP_NAME=University Registration System
   VITE_API_URL=your_api_endpoint (if needed)
   ```

## 🔧 Troubleshooting

### Build Fails?
1. Check Node.js version is 18+
2. Ensure all dependencies are in package.json
3. Check for TypeScript errors

### Page Not Found?
1. Verify routing configuration
2. Check that all page files exist in src/pages/
3. Ensure App.tsx routes are correct

### Styling Issues?
1. Verify Tailwind CSS is configured
2. Check that global.css is imported
3. Ensure all UI components exist

## �� Support

- Check Builder.io documentation
- Verify all files are uploaded correctly
- Ensure package.json scripts are correct

---

**🎉 Your University Registration System should now be live and accessible to your clients!**
