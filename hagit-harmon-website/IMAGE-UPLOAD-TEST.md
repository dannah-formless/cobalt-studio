# Event Image Upload Test Guide

## What Was Fixed

**Problem:** Netlify CMS + Git LFS incompatibility caused uploaded images to fail
- Image paths were saved in events.json
- But actual image files were not committed to git
- Result: Broken images on live site

**Solution:** Disabled Git LFS for the images folder
- Images are now stored as regular git files
- Netlify CMS can upload directly without LFS complications
- Images commit and deploy automatically

---

## How to Test Future Event Images

### Step 1: Add a Test Event via Netlify CMS

1. Go to: **https://hagitharmon.com/admin/**
2. Click **"Events"** → **"Events List"**
3. Click **"+ Add events"** at the bottom
4. Fill in the event details:
   - English Title: "Test Event - Image Upload"
   - Hebrew Title: "אירוע בדיקה - העלאת תמונה"
   - Date, Location, Description (any test text)
5. **Upload an image:**
   - Click the **"Event Image"** upload button
   - Choose any small test image (< 5MB recommended)
   - Wait for upload to complete
6. Click **"Save"**
7. Click **"Publish"** (IMPORTANT!)

### Step 2: Verify the Image Was Committed

Wait ~30 seconds, then check GitHub:

1. Go to: **https://github.com/dannah-formless/formless-studio/commits/main**
2. Look for a commit: "Update Events 'events'"
3. Click on the commit
4. Verify you see:
   - ✅ `content/events.json` changed
   - ✅ `images/[your-image-name]` added

### Step 3: Check Live Site

1. Go to: **https://hagitharmon.com/events.html**
2. Hard refresh: `Cmd + Shift + R` (Mac) or `Ctrl + Shift + R` (Windows)
3. Verify:
   - ✅ Test event appears
   - ✅ Image displays correctly (not broken)

### Step 4: Check Hebrew Version

1. Go to: **https://hagitharmon.com/events-he.html**
2. Hard refresh
3. Verify:
   - ✅ Test event appears in Hebrew
   - ✅ Same image displays correctly

### Step 5: Clean Up (Optional)

Delete the test event from Netlify CMS:
1. Go back to admin panel
2. Open the test event
3. Click **"Delete"**
4. Click **"Publish"**

---

## Troubleshooting

### Image Doesn't Appear After Publishing

**Check 1: Browser Cache**
- Hard refresh the page (Cmd+Shift+R)
- Try in incognito/private window

**Check 2: Auto-Deploy Setup**
- Make sure continuous deployment is enabled (see main README)
- If not set up, manually deploy: `netlify deploy --prod`

**Check 3: GitHub Commit**
- Verify the image file was actually committed to GitHub
- If not, there may be a file size issue (keep images < 10MB)

**Check 4: Image Path**
- Open browser console (F12)
- Look for 404 errors on image URLs
- Image should be at: `/images/[filename]`

### File Too Large Error

If you get "file too large" when uploading:
- Resize image to < 10MB (recommended: < 5MB)
- Use image compression (tinypng.com, squoosh.app)
- For event images, 1920x1080px at 80% quality is plenty

### Still Having Issues?

Check these files:
1. `.gitattributes` - Should have images folder excluded from LFS
2. `admin/config.yml` - media_folder should be "images"
3. Git status: `git status` - No uncommitted LFS pointer files

---

## Current Configuration

**Git LFS Status:** Disabled for images folder
```
images/*.png !filter !diff !merge
images/*.jpg !filter !diff !merge
```

**Netlify CMS Config:**
```yaml
media_folder: "images"
public_folder: "/images"
```

**Expected Behavior:**
1. Upload image via CMS → Image saved to `images/` folder
2. CMS commits changes → Both events.json AND image file committed
3. Netlify auto-deploys → Image appears on live site
4. Total time: ~30-60 seconds

---

## Test Results Log

Document your test results here:

### Test 1: [Date]
- [ ] Image uploaded successfully
- [ ] Commit appeared in GitHub
- [ ] Image displays on events.html
- [ ] Image displays on events-he.html
- [ ] No console errors
- **Result:** Pass / Fail
- **Notes:**

### Test 2: [Date]
- [ ] Image uploaded successfully
- [ ] Commit appeared in GitHub
- [ ] Image displays on events.html
- [ ] Image displays on events-he.html
- [ ] No console errors
- **Result:** Pass / Fail
- **Notes:**
