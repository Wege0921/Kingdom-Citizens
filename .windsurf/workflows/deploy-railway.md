---
description: Deploy to Railway using CLI
---

# Deploy to Railway via CLI

## Prerequisites
1. Railway account at https://railway.app
2. Railway CLI installed (already done)

## Step 1: Login to Railway

```bash
railway login
```

This opens a browser window to authenticate.

## Step 2: Link project (first time only)

```bash
railway link
```

Select your project or create a new one.

## Step 3: Set environment variables

```bash
railway variables set NEXT_PUBLIC_APP_URL="https://your-app.up.railway.app"
railway variables set NEXT_PUBLIC_SUPABASE_URL="https://xxxx.supabase.co"
railway variables set NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
railway variables set SUPABASE_SERVICE_ROLE_KEY="your-service-key"
```

Add any other vars from `.env.example` as needed.

## Step 4: Deploy

```bash
railway up
```

This builds and deploys your app.

## Step 5: Set domain (after first deploy)

```bash
railway domain
```

Copy the generated domain and update:

```bash
railway variables set NEXT_PUBLIC_APP_URL="https://your-domain.up.railway.app"
```

## Step 6: Redeploy with updated URL

```bash
railway up
```

## Useful commands

```bash
railway logs              # View logs
railway status            # Check deployment status
railway variables         # List all env vars
railway variables get KEY # Get specific var
```
