# Fix Radio Music Storage (NotSupportedError)

The `NotSupportedError: The element has no supported sources` error means the browser cannot load the audio file from Supabase Storage. This is almost always a **bucket permission or CORS** issue.

## Quick Fix Steps

### 1. Make the bucket public

1. Open your Supabase Dashboard: https://supabase.com/dashboard/project/_/storage/buckets
2. Find the `radio-music` bucket
3. Click the **...** menu → **Edit** (or click into it)
4. Toggle **Public bucket** to **ON**
5. Click **Save**

### 2. Verify CORS is configured (critical)

1. In the same bucket settings, look for a **CORS** section
2. Add a CORS policy with these settings:
   - **Origin**: `*` (or your exact domain, e.g. `https://your-app.vercel.app`)
   - **Methods**: `GET`, `HEAD`
   - **Allowed Headers**: `*`
   - **Max age**: `86400`
3. Click **Save**

> Without CORS, the browser blocks the audio request even if the bucket is public.

### 3. Test the URL directly

Copy one of your audio URLs and paste it directly into a browser tab:

```
https://wyuzezzhsqcjqpgjndro.supabase.co/storage/v1/object/public/radio-music/Lili%20v5%20Track%20No13.mp3
```

If it:
- **Downloads or plays** → The bucket is public and working
- **Shows 404** → The file name doesn't match exactly (case-sensitive!)
- **Shows 403** → The bucket is NOT public

### 4. Check file extensions

Make sure the uploaded files actually have `.mp3` extensions and are valid MP3 files. Supabase Storage doesn't check file contents — it serves whatever you upload.

## Common mistakes

| Mistake | Result |
|---------|--------|
| Bucket is private | 403 error → `NotSupportedError` |
| CORS not set | Browser blocks request → `NotSupportedError` |
| File name typo in SQL | 404 error → `NotSupportedError` |
| File is not actually MP3 | Decode error → `NotSupportedError` |
| Special chars in filename not URL-encoded | 404 error |

## After fixing

Refresh the `/radio` page. The fallback player should now load the first track and show the play button. You may need to click **Play** first (browsers block autoplay).
