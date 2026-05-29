# Deploy to Railway

## Prerequisites
1. [Railway account](https://railway.app)
2. [GitHub account](https://github.com) (recommended)
3. Your Supabase project already set up

## Step 1: Push to GitHub

If not already a git repo:

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Step 2: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **New Project**
3. Select **Deploy from GitHub repo**
4. Choose your repository
5. Railway will auto-detect the Node.js app

## Step 3: Set Environment Variables

In Railway Dashboard → Your Service → Variables, add:

**Required:**
```
NEXT_PUBLIC_APP_URL=https://your-app-name.up.railway.app
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Optional (copy from .env):**
```
RESEND_API_KEY=
RESEND_FROM_EMAIL=
ANTHROPIC_API_KEY=
NEXT_PUBLIC_VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_EMAIL=
```

## Step 4: Deploy

Railway will auto-deploy on every push to `main`.

To deploy manually: Railway Dashboard → Your Service → Deploy

## Step 5: Update NEXT_PUBLIC_APP_URL

After first deploy, copy the Railway domain (e.g., `https://my-app.up.railway.app`) and set it as:

```
NEXT_PUBLIC_APP_URL=https://my-app.up.railway.app
```

Then redeploy.

## Troubleshooting

- **Build fails**: Check Railway logs. Usually a missing env var.
- **Prisma errors**: Make sure `POSTGRES_PRISMA_URL` is set if using Prisma directly.
- **Socket.IO not working**: Ensure `NEXT_PUBLIC_APP_URL` matches the Railway domain.
