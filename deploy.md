# Render Deployment Guide

## Step 1: Create New Web Service on Render

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Choose your repository

## Step 2: Configure Service Settings

### Basic Settings:
- **Name**: `course-registration-backend` (or your preferred name)
- **Root Directory**: `server` ⚠️ **IMPORTANT: Set this to `server`**
- **Runtime**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`

### Environment Variables:
Add these in the Environment tab:

```
MONGODB_URI=mongodb+srv://admin123:WHDwvBqNBUVwQcqn@cluster0.7ttpes6.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
PORT=5000
CASHFREE_APP_ID=TEST10783812f10718d0b666328656b221838701
CASHFREE_SECRET_KEY=cfsk_ma_test_055a585aa73adc293efd874e702cd10c_23aa53e9
CASHFREE_API_VERSION=2023-08-01
CASHFREE_BASE=https://sandbox.cashfree.com/pg
CLIENT_ORIGIN=http://localhost:3000
EMAIL_USER=zerokosthealthcare@gmail.com
EMAIL_PASS=mpkk nuhi npld tgoz
```

## Step 3: Deploy

1. Click "Create Web Service"
2. Wait for deployment to complete
3. Note your backend URL (e.g., `https://your-app-name.onrender.com`)

## Step 4: Test Backend

Test these endpoints:
- `GET https://your-app-name.onrender.com/api/` (should return API info)
- `POST https://your-app-name.onrender.com/api/register` (test registration)

## Step 5: Update Frontend

After backend is deployed, update your frontend:
1. Change `VITE_API_BASE` to your backend URL
2. Deploy frontend
3. Update `CLIENT_ORIGIN` in backend environment variables
4. Redeploy backend

## Troubleshooting

- **Build fails**: Check Root Directory is set to `server`
- **Module not found**: Ensure package.json is in server directory
- **CORS errors**: Update CLIENT_ORIGIN environment variable
- **Database connection**: Verify MONGODB_URI is correct

