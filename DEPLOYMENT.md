# Vercel Deployment Guide

## Project Structure
This is a monorepo with separate frontend and backend applications that should be deployed as separate Vercel projects.

## Prerequisites
- GitHub repository with this code
- Supabase database credentials
- Vercel account

---

## Frontend Deployment (React + Vite)

### 1. Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `frontend` directory as Root Directory
5. Framework Preset: Vite
6. Click Deploy

### 2. Environment Variables (if needed)
Add these in Vercel Project Settings → Environment Variables:
```
VITE_API_URL=https://your-backend-url.vercel.app
```

### 3. Build Configuration
Vercel will automatically detect Vite and use these settings:
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Install Command**: `npm install`

---

## Backend Deployment (Node.js + Express)

### 1. Create Vercel Project
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your GitHub repository
4. Select the `backend` directory as Root Directory
5. Framework Preset: Other
6. Click Deploy

### 2. Environment Variables (REQUIRED)
Add these in Vercel Project Settings → Environment Variables:

```
DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@[YOUR-PROJECT-REF].pooler.supabase.com:6543/postgres?pgbouncer=true
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=5000
NODE_ENV=production

# Razorpay (if using)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Email (if using)
EMAIL=your_email@gmail.com
EMAIL_PASSWORD=your_app_specific_password
```

### 3. Build Configuration
Update in Vercel Project Settings → Build & Development Settings:
- **Build Command**: (leave empty)
- **Output Directory**: (leave empty)
- **Install Command**: `npm install`

### 4. Update package.json scripts
Ensure your backend package.json has:
```json
{
  "scripts": {
    "start": "node src/server.js"
  }
}
```

---

## Post-Deployment Steps

### 1. Update Frontend API URL
After deploying the backend, update the frontend's API base URL:
- In `frontend/src/services/api.js` or similar file
- Change from `http://localhost:5000` to your backend Vercel URL

### 2. Run Database Migrations
Since Vercel is serverless, you'll need to run migrations manually:
```bash
cd backend
npx prisma db push
```

### 3. Seed Database (optional)
```bash
cd backend
npx prisma db seed
```

---

## Troubleshooting

### Backend fails to start
- Check that `src/server.js` exists and is properly configured
- Verify all environment variables are set
- Check Vercel function logs

### Database connection errors
- Verify `DATABASE_URL` is correct
- Ensure Supabase project is active
- Check connection string format (use pgbouncer for Supabase)

### CORS errors
- Ensure backend CORS allows your frontend domain
- Update CORS origins in backend middleware

---

## Default Credentials (after seeding)
- **Admin**: admin@bms.com / Admin@123
- **Security**: security@bms.com / Security@123
- **Resident**: resident@bms.com / Resident@123
- **Developer**: developer@bms.com / Developer@123
