#!/bin/bash

echo "🚀 Deploying authentication fixes..."

# Add all changes
git add -A

# Commit changes
git commit -m "fix: Update auth response format to match frontend expectations

- Fixed login endpoint to wrap response in data property
- Updated getCurrentUser endpoint to use consistent format  
- Improved form accessibility with proper ARIA attributes
- Demo credentials: admin@nu.edu.bd/admin123, NU24MBA002/temp123456"

# Push to current branch (cosmos-home)
git push origin cosmos-home

echo "✅ Changes pushed to GitHub"
echo "🔄 Your Fly.io deployment should start automatically"
echo ""
echo "📋 Demo Credentials:"
echo "🔐 Admin: admin@nu.edu.bd / admin123"
echo "🎓 Applicant: NU24MBA002 / temp123456"
echo ""
echo "🌐 Production URL: https://b28bc40f8c6349bca991157dd3303fe2-2e7f89cbf8cb41229762fddc9.fly.dev"
