# ⚡ Quick Deployment: 5 Steps to Deploy (Heroku + Netlify)

## Step 1️⃣: Deploy Backend to Heroku (5 minutes)

### 1.1 Create Heroku Account
- Go to https://www.heroku.com
- Sign up (free)

### 1.2 Install Heroku CLI
- Download: https://devcenter.heroku.com/articles/heroku-cli
- Install and restart terminal

### 1.3 Login & Create App
```powershell
heroku login
cd Backend
heroku create your-app-name
```

Example:
```powershell
heroku create pavan-grocery-api
```

### 1.4 Add MongoDB Connection
Get your MongoDB Atlas connection string from https://mongodb.com/cloud/atlas

Then run:
```powershell
heroku config:set MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/grocery_list?retryWrites=true&w=majority
```

### 1.5 Deploy
```powershell
git push heroku main
```

✅ **Backend is live!** Your URL: `https://your-app-name.herokuapp.com`

---

## Step 2️⃣: Update Frontend with Backend URL (2 minutes)

Edit `Grocery List/.env`:

```
VITE_API_URL=https://your-app-name.herokuapp.com/api/items
```

Then push to GitHub:
```powershell
cd ..
git add .
git commit -m "Update backend URL"
git push
```

---

## Step 3️⃣: Build Frontend (2 minutes)

```powershell
cd "Grocery List"
npm run build
```

This creates a `dist/` folder with your production files.

---

## Step 4️⃣: Deploy to Netlify (3 minutes)

### Option A: Using GitHub (EASIEST!)

1. Go to https://app.netlify.com
2. Click "New site from Git"
3. Select GitHub & choose `mern-grocery-list`
4. Configure:
   - Base directory: `Grocery List`
   - Build command: `npm run build`
   - Publish directory: `dist`
5. Add environment variable:
   - Key: `VITE_API_URL`
   - Value: `https://your-app-name.herokuapp.com/api/items`
6. Click "Deploy"

✅ **Frontend is live!** URL will be shown after deployment

### Option B: Using CLI

```powershell
npm install -g netlify-cli
netlify login
netlify deploy --prod
```

---

## Step 5️⃣: Test Your Live App! 🎉

1. Visit your Netlify URL
2. Add a grocery item
3. Check if it appears instantly
4. Refresh page - should still be there
5. Try marking as complete and deleting

---

## 🔗 Your Live App URLs

After deployment, you'll have:

**Backend API:** `https://your-heroku-app.herokuapp.com`
**Frontend App:** `https://your-netlify-site.netlify.app`

---

## 📝 Cheat Sheet

### Quick Commands
```bash
# Heroku
heroku create app-name
git push heroku main
heroku logs --tail

# Frontend Build
npm run build

# Netlify
netlify deploy --prod

# GitHub
git push
```

---

## ✅ That's it! Your app is live! 🚀

**Total time: ~12 minutes**
**Total cost: $0** (all free tiers!)

---

## 🆘 Common Issues

**"Failed to fetch items"**
→ Check API URL in Netlify environment variables

**Heroku app not responding**
→ Check: `heroku logs --tail`

**Build fails on Netlify**
→ Check build logs in Netlify dashboard

---

See `HEROKU_NETLIFY_DEPLOYMENT.md` for detailed guide!
