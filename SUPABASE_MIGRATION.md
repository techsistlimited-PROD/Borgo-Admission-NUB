# Supabase Migration Instructions

This guide will help you migrate from SQLite to Supabase PostgreSQL database to resolve the application submission errors.

## Step 1: Get Your Supabase Project Details

1. Go to your [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Go to **Settings** → **API**
4. Copy the following values:
   - **Project URL** (e.g., `https://your-project-ref.supabase.co`)
   - **Service Role Key** (the `service_role` secret key)

## Step 2: Run Database Migration in Supabase

1. In your Supabase project, go to **SQL Editor**
2. Copy the contents of `supabase_migration.sql` 
3. Paste it into the SQL Editor
4. Click **Run** to create all tables and insert sample data

This will create all the necessary tables:
- `applications` (with proper schema for your application form)
- `users`, `programs`, `departments` 
- `admission_settings`, `payment_methods`
- Plus all necessary indexes and sample data

## Step 3: Configure Environment Variables

1. Create or update your `.env` file:

```bash
# Supabase Configuration
SUPABASE_URL=https://your-project-ref.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Switch to Supabase
DATABASE_TYPE=supabase

# Keep existing variables
JWT_SECRET=your-jwt-secret
NODE_ENV=production
PORT=3001
```

2. **Important**: Never commit your `.env` file. Add it to `.gitignore`

## Step 4: Install Supabase Dependencies

Run this command to install the Supabase client:

```bash
npm install @supabase/supabase-js
```

## Step 5: Deploy Updated Code

### Option A: Deploy to Fly.dev (Current Setup)
1. Push your code to GitHub
2. Redeploy on Fly.dev with the new environment variables

### Option B: Deploy to Netlify (Recommended)
1. [Connect to Netlify](#open-mcp-popover) 
2. I'll deploy the updated code automatically
3. Set the environment variables in Netlify dashboard

### Option C: Deploy to Vercel
1. [Connect to Vercel](#open-mcp-popover)
2. I'll deploy the updated code automatically
3. Set the environment variables in Vercel dashboard

## Step 6: Test the Application

After deployment:

1. **Test Application Submission**: Try submitting an application form
2. **Check Supabase Dashboard**: Go to **Table Editor** → **applications** to see submitted data
3. **Verify No More 500 Errors**: The application should now submit successfully

## Benefits of This Migration

✅ **Fixes the 500 error**: Proper database schema with all required fields
✅ **No more deployment issues**: Supabase handles the database automatically  
✅ **Better performance**: PostgreSQL is more robust than SQLite
✅ **Real-time capabilities**: Supabase offers real-time subscriptions
✅ **Automatic backups**: Your data is automatically backed up
✅ **Scalability**: Can handle thousands of applications

## Rollback Plan

If you need to rollback:
1. Set `DATABASE_TYPE=sqlite` in your environment variables
2. Redeploy the application
3. The app will use the local SQLite database again

## Need Help?

If you encounter any issues:
1. Check your Supabase project is active
2. Verify environment variables are set correctly
3. Check the server logs for detailed error messages
4. Ensure the SQL migration ran successfully in Supabase

The migration preserves all your existing functionality while fixing the database issues!
