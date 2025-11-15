# Deployment Guide: Heroku (Backend) + Netlify (Frontend)

This guide will help you deploy your MERN Grocery List app with:
- **Backend:** Heroku
- **Frontend:** Netlify

---

## 📋 Prerequisites

Before you start, make sure you have:
- [ ] GitHub account (already have it ✅)
- [ ] Heroku account (free) - https://www.heroku.com
- [ ] Netlify account (free) - https://www.netlify.com
- [ ] Git installed (already have it ✅)
- [ ] Project pushed to GitHub (already done ✅)

---

## 🚀 PART 1: Deploy Backend to Heroku

### Step 1: Create Heroku Account
1. Go to https://www.heroku.com
2. Click "Sign up" and create a free account
3. Verify your email
4. Login to your Heroku dashboard

### Step 2: Install Heroku CLI
1. Download from: https://devcenter.heroku.com/articles/heroku-cli
2. Install and restart your terminal

### Step 3: Login to Heroku
Open PowerShell and run:
```powershell
heroku login
```
This will open a browser to authenticate. Login with your Heroku credentials.

### Step 4: Create Heroku App
Navigate to your Backend folder:
```powershell
cd "C:\Users\gurra\OneDrive\Desktop\mern project\Backend"
heroku create your-unique-app-name
```

**Example:**
```powershell
heroku create pavan-grocery-api
```

This creates an app and returns a URL like: `https://pavan-grocery-api.herokuapp.com`

### Step 5: Set Environment Variables on Heroku
```powershell
heroku config:set MONGODB_URI=your_mongodb_atlas_connection_string
heroku config:set NODE_ENV=production
```

**To get your MongoDB URI:**
1. Go to https://www.mongodb.com/cloud/atlas
2. Login to your cluster
3. Click "Connect"
4. Choose "Connect your application"
5. Copy the connection string
6. Replace `<password>` with your actual password
7. Paste it in the command above

**Example:**
```powershell
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery_list?retryWrites=true&w=majority
```

### Step 6: Deploy Backend to Heroku
```powershell
git push heroku main
```

This will:
- Push your code to Heroku
- Install dependencies
- Start the server

### Step 7: Verify Backend Deployment
```powershell
heroku logs --tail
```

You should see:
```
Server running on port 5000
MongoDB Connected: ...
```

Or visit your app URL (you'll see a JSON response):
```
https://pavan-grocery-api.herokuapp.com/
```

**Save your backend URL!** You'll need it for the frontend deployment.

---

## 🎨 PART 2: Deploy Frontend to Netlify

### Step 1: Create Netlify Account
1. Go to https://www.netlify.com
2. Click "Sign up"
3. Choose "Sign up with GitHub" (easiest)
4. Authorize Netlify to access your GitHub

### Step 2: Build Your Frontend
First, prepare the frontend for production:

```powershell
cd "C:\Users\gurra\OneDrive\Desktop\mern project\Grocery List"
npm run build
```

This creates a `dist/` folder with optimized production files.

### Step 3: Update Frontend Environment Variable
Before deploying, update your `.env` file with the Heroku backend URL:

Edit `.env` in the Grocery List folder:
```
VITE_API_URL=https://pavan-grocery-api.herokuapp.com/api/items
```

Replace `pavan-grocery-api` with your actual Heroku app name!

### Step 4: Commit Changes to GitHub
```powershell
cd "C:\Users\gurra\OneDrive\Desktop\mern project"
git add .
git commit -m "Update API URL for production deployment"
git push
```

### Step 5: Deploy to Netlify (Option A: GitHub Integration - EASIEST)

**This is the easiest method!**

1. Go to https://app.netlify.com/signup
2. Click "Deploy with GitHub"
3. Authorize and select your `mern-grocery-list` repository
4. Configure build settings:
   - **Base directory:** `Grocery List`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

5. Add environment variables:
   - Click "Environment variables"
   - Add: `VITE_API_URL` = `https://your-heroku-app.herokuapp.com/api/items`

6. Click "Deploy"

Netlify will automatically deploy when you push to GitHub!

### Step 6: Deploy to Netlify (Option B: Netlify CLI)

If you prefer using the CLI:

1. Install Netlify CLI:
```powershell
npm install -g netlify-cli
```

2. Login to Netlify:
```powershell
netlify login
```

3. Deploy from the Grocery List folder:
```powershell
cd "C:\Users\gurra\OneDrive\Desktop\mern project\Grocery List"
netlify deploy --prod
```

4. Choose your site or create a new one
5. Confirm the build folder: `dist`

### Step 7: Verify Frontend Deployment

Your app will be live at: `https://your-site-name.netlify.app`

Netlify will give you a URL after deployment.

---

## 🔗 Final Setup: Connect Frontend to Backend

### Update Netlify Environment Variables

1. Go to your Netlify site dashboard
2. Click "Site settings"
3. Go to "Build & Deploy" → "Environment"
4. Add the variable:
   - **Key:** `VITE_API_URL`
   - **Value:** `https://your-heroku-app.herokuapp.com/api/items`

5. Trigger a redeploy by pushing a change to GitHub or using:
```powershell
netlify deploy --prod
```

---

## ✅ Deployment Checklist

### Backend (Heroku)
- [ ] Created Heroku account
- [ ] Installed Heroku CLI
- [ ] Created Heroku app (`heroku create app-name`)
- [ ] Set MongoDB URI on Heroku
- [ ] Deployed with `git push heroku main`
- [ ] Verified with `heroku logs --tail`
- [ ] Saved Heroku app URL

### Frontend (Netlify)
- [ ] Created Netlify account
- [ ] Updated `.env` with Heroku API URL
- [ ] Built frontend (`npm run build`)
- [ ] Pushed changes to GitHub
- [ ] Connected GitHub to Netlify
- [ ] Set `VITE_API_URL` environment variable on Netlify
- [ ] Deployed successfully
- [ ] Verified app works

---

## 🧪 Testing Live Application

1. Visit your Netlify URL: `https://your-site.netlify.app`
2. Try adding a grocery item
3. Should appear in the list immediately
4. Refresh page - item should persist
5. Try marking as complete and deleting

---

## 🔄 Continuous Deployment

**Automatic Redeployment:**

Both services are now connected to your GitHub repository!

When you push changes:
1. Push to GitHub
2. Netlify automatically rebuilds and deploys frontend
3. For backend, redeploy with:
```powershell
git push heroku main
```

---

## 🐛 Troubleshooting

### "Failed to fetch items" on Netlify

**Problem:** Frontend can't connect to backend

**Solution:**
1. Check Heroku app is running:
```powershell
heroku logs --tail
```

2. Verify API URL in Netlify environment variables matches your Heroku app

3. Check Heroku allows CORS from Netlify domain

### Heroku App Goes to Sleep

**Free tier Heroku apps sleep after 30 mins of inactivity**

**Solution:**
- Upgrade to paid tier, OR
- Add a ping service to keep it awake (optional)

### Build Fails on Netlify

**Problem:** Build command fails

**Solution:**
1. Check build logs on Netlify dashboard
2. Make sure dependencies are installed: `npm install`
3. Check `package.json` has correct scripts
4. Try building locally first: `npm run build`

### API URL Issues

**Problem:** Frontend can't connect to backend

**Solution:**
1. Make sure Heroku app URL is correct
2. Add `/api/items` to the end of URL
3. Check CORS is enabled in backend (it is ✅)

---

## 📊 Deployment Summary

| Component | Platform | URL Format | Free Tier |
|-----------|----------|-----------|-----------|
| Backend | Heroku | `https://app-name.herokuapp.com` | ✅ Yes |
| Frontend | Netlify | `https://site-name.netlify.app` | ✅ Yes |
| Database | MongoDB Atlas | Cloud | ✅ Yes |

**Total Cost:** $0 (all free tiers!)

---

## 🚀 Commands Quick Reference

### Heroku
```bash
heroku create app-name           # Create app
heroku config:set KEY=VALUE      # Set environment variable
git push heroku main             # Deploy
heroku logs --tail               # View logs
heroku open                       # Open app in browser
```

### Netlify
```bash
npm run build                     # Build frontend
netlify deploy --prod            # Deploy with CLI
netlify logs                      # View deploy logs
```

### Git
```bash
git add .
git commit -m "message"
git push                          # Push to GitHub (auto triggers both)
```

---

## 📞 Support Links

- **Heroku Docs:** https://devcenter.heroku.com/
- **Netlify Docs:** https://docs.netlify.com/
- **MongoDB Atlas:** https://docs.atlas.mongodb.com/

---

## ✨ You're All Set!

Your MERN app is now:
- ✅ Backend deployed on Heroku
- ✅ Frontend deployed on Netlify
- ✅ Connected and working
- ✅ Automatically redeploys on GitHub pushes

**Enjoy your live grocery list app! 🎉**
