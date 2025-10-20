# 🚀 Netlify + Supabase Deployment Guide

## Complete Step-by-Step Guide to Deploy Your Portfolio

---

## **Part 1: Setup Supabase Database** (Free PostgreSQL)

### **Step 1: Create Supabase Account**

1. Go to **https://supabase.com/**
2. Click **"Start your project"**
3. Sign up with **GitHub** (easiest option)

### **Step 2: Create New Project**

1. Click **"New Project"**
2. Fill in details:
   - **Name**: `portfolio` (or any name you like)
   - **Database Password**: Create a strong password
     - **⚠️ IMPORTANT: Save this password somewhere safe!**
   - **Region**: Choose closest to your location
   - **Plan**: Select **Free**

3. Click **"Create new project"**
4. ⏳ Wait 2-3 minutes for the database to be created

### **Step 3: Get Your Database Connection String**

1. Once the project is ready, click **"Settings"** (gear icon in left sidebar, bottom)
2. Click **"Database"** in the settings menu
3. Scroll down to **"Connection string"** section
4. Click on the **"URI"** tab
5. You'll see something like:
   ```
   postgresql://postgres.[RANDOM]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   ```
6. **Copy this string**
7. **Replace `[YOUR-PASSWORD]`** with the actual password you created in Step 2

**Final connection string should look like:**
```
postgresql://postgres.abcdefgh:MySecurePass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
```

**Save this - you'll need it in multiple places!**

---

## **Part 2: Update Your Local Project**

### **Step 4: Update Environment Variables**

1. Open your `.env` file in your project
2. Update the `DATABASE_URL`:

```env
# Supabase Database URL (replace with yours from Step 3)
DATABASE_URL="postgresql://postgres.abcdefgh:MySecurePass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres"

# JWT Secret (keep or change)
JWT_SECRET="your-secret-key-change-this-to-something-random"

# Your site URL (update after deploying to Netlify)
NEXT_PUBLIC_API_URL="https://your-site.netlify.app"

# Optional: Email Configuration
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-gmail-app-password"
ADMIN_EMAIL="your-email@gmail.com"
ADMIN_NAME="Your Name"
```

### **Step 5: Install PostgreSQL Package**

Open terminal and run:
```bash
npm install pg
```

### **Step 6: Push Database Schema to Supabase**

Stop your development server (Ctrl+C), then run:

```bash
# Stop any running Node processes
powershell -Command "Get-Process -Name 'node' -ErrorAction SilentlyContinue | Stop-Process -Force"

# Generate Prisma Client
npx prisma generate

# Push schema to Supabase
npx prisma db push
```

You should see:
```
✔ Your database is now in sync with your Prisma schema
```

### **Step 7: Test Locally**

Start your dev server:
```bash
npm run dev
```

Visit `http://localhost:3000` and test:
- Admin login should work
- Can add projects, skills, services
- Everything should work as before

---

## **Part 3: Deploy to Netlify**

### **Step 8: Prepare for Deployment**

1. Make sure all changes are committed to Git:
```bash
git add .
git commit -m "Migrate to PostgreSQL for deployment"
git push origin main
```

2. Create a `.gitignore` entry for `.env`:
   - Make sure `.env` is in your `.gitignore` file
   - Never commit database passwords to Git!

### **Step 9: Create Netlify Account**

1. Go to **https://netlify.com/**
2. Click **"Sign up"**
3. Sign up with **GitHub** (easiest)

### **Step 10: Deploy Your Site**

1. Click **"Add new site"** → **"Import an existing project"**

2. Choose **"Deploy with GitHub"**

3. Authorize Netlify to access your GitHub

4. Select your **portfolio repository**

5. Configure build settings:
   - **Base directory**: (leave empty)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
   - **Branch to deploy**: `main`

6. **Add Environment Variables** (VERY IMPORTANT!):
   Click **"Add environment variables"** or **"Show advanced"**
   
   Add these variables:
   ```
   DATABASE_URL = postgresql://postgres.abcdefgh:MySecurePass123@aws-0-us-east-1.pooler.supabase.com:6543/postgres
   
   JWT_SECRET = your-secret-key-change-this
   
   EMAIL_USER = your-email@gmail.com
   
   EMAIL_PASS = your-gmail-app-password
   
   ADMIN_EMAIL = your-email@gmail.com
   
   ADMIN_NAME = Your Name
   ```

7. Click **"Deploy site"**

8. ⏳ Wait 3-5 minutes for build to complete

---

## **Part 4: Post-Deployment Setup**

### **Step 11: Get Your Netlify URL**

Once deployed, you'll get a URL like:
```
https://random-name-123.netlify.app
```

### **Step 12: Update Site Settings**

1. **Change site name** (optional):
   - Go to **Site settings** → **General** → **Site details**
   - Click **"Change site name"**
   - Choose something like: `your-name-portfolio`
   - New URL: `https://your-name-portfolio.netlify.app`

2. **Add custom domain** (optional):
   - Go to **Domain settings**
   - Click **"Add custom domain"**
   - Follow instructions

### **Step 13: Register Admin Account**

1. Visit: `https://your-site.netlify.app/admin/register`
2. Create your admin account
3. Login at: `https://your-site.netlify.app/admin/login`
4. Start adding your content!

---

## **Part 5: Add Content**

### **Step 14: Populate Your Portfolio**

1. **Login to admin**: `https://your-site.netlify.app/admin/dashboard`

2. **Add About Info**:
   - Go to **About** tab
   - Upload profile image
   - Write your bio
   - Add social links
   - Save

3. **Add Skills**:
   - Go to **Skills** tab
   - Add skills with categories
   - Set proficiency levels
   - Save

4. **Add Services**:
   - Go to **Services** tab
   - Add services with descriptions
   - Add feature lists
   - Save

5. **Add Projects**:
   - Go to **Projects** tab
   - Upload cover images
   - Upload gallery images
   - Add project details
   - Add GitHub and live demo URLs
   - Save

---

## **Troubleshooting**

### **Build Fails on Netlify**

**Problem**: Build fails with Prisma errors

**Solution**:
1. Check environment variables are set correctly
2. Make sure `DATABASE_URL` is correct
3. Check build logs for specific errors

### **Database Connection Error**

**Problem**: Can't connect to database

**Solution**:
1. Verify `DATABASE_URL` in Netlify environment variables
2. Make sure you replaced `[YOUR-PASSWORD]` with actual password
3. Check Supabase project is not paused (free tier pauses after inactivity)

### **Images Not Showing**

**Problem**: Uploaded images don't display

**Solution**:
1. For Netlify, you might need to use external image hosting
2. Or use Netlify's Large Media addon (free tier has limits)
3. Alternative: Use Cloudinary or Supabase Storage for images

### **Admin Can't Login**

**Problem**: Admin login fails

**Solution**:
1. Make sure you registered at the deployed URL, not localhost
2. Check browser console for errors
3. Verify `JWT_SECRET` is set in Netlify environment variables

---

## **Image Upload Solution for Netlify**

### **Option 1: Use Supabase Storage (Recommended)**

Netlify's filesystem is read-only, so you need external storage for images.

**Setup Supabase Storage:**

1. In Supabase dashboard → **Storage**
2. Create new bucket: **"uploads"**
3. Make it public
4. Update upload API to use Supabase Storage instead of local files

I can help you set this up if needed!

### **Option 2: Use Cloudinary (Also Good)**

1. Sign up at **https://cloudinary.com/** (free tier)
2. Get API credentials
3. Update upload API to use Cloudinary

---

## **Cost Breakdown**

### **Netlify Free Tier:**
- ✅ 100GB bandwidth/month
- ✅ 300 build minutes/month
- ✅ Unlimited sites
- ✅ Custom domains
- ✅ SSL certificates
- **Cost: $0/month**

### **Supabase Free Tier:**
- ✅ 500MB database
- ✅ 1GB file storage
- ✅ Unlimited API requests
- ✅ Social auth
- **Cost: $0/month**

### **Total Cost: $0/month Forever!** 🎉

---

## **Quick Reference**

### **Important URLs:**

- **Your Site**: `https://your-site.netlify.app`
- **Admin Login**: `https://your-site.netlify.app/admin/login`
- **Admin Dashboard**: `https://your-site.netlify.app/admin/dashboard`
- **Netlify Dashboard**: `https://app.netlify.com`
- **Supabase Dashboard**: `https://app.supabase.com`

### **Commands:**

```bash
# Local development
npm run dev

# Build for production
npm run build

# Push database changes
npx prisma db push

# Open Prisma Studio (view database)
npx prisma studio
```

---

## **Next Steps**

1. ✅ Complete Supabase setup
2. ✅ Update local `.env` with Supabase URL
3. ✅ Test locally
4. ✅ Push to GitHub
5. ✅ Deploy to Netlify
6. ✅ Add environment variables in Netlify
7. ✅ Register admin account
8. ✅ Add your content
9. ✅ Share your portfolio!

---

## **Need Help?**

If you run into any issues:

1. Check the **Troubleshooting** section above
2. Check **Netlify build logs** for errors
3. Check **Supabase logs** for database errors
4. Check browser console for frontend errors

---

**Your portfolio is ready to go live! 🚀**

Let me know when you're ready to proceed with each step, and I can help you through any issues!

