# Airtable Events Integration Setup Guide

This guide explains how to connect your Airtable events database to your website.

## Step 1: Get Your Airtable Credentials

### 1.1 Find Your Base ID
1. Open your Airtable base in a browser
2. Look at the URL: `https://airtable.com/appXXXXXXXXXXXXXX/...`
3. Copy the part starting with `app` (e.g., `appAbc123Xyz456`)

### 1.2 Get Your API Key (Personal Access Token)
1. Go to https://airtable.com/create/tokens
2. Click "Create new token"
3. Give it a name (e.g., "Website Events")
4. Add these scopes:
   - `data.records:read`
5. Add access to your base
6. Click "Create token"
7. **IMPORTANT**: Copy the token immediately (starts with `pat...`) - you won't see it again!

### 1.3 Find Your Table Name
- This is simply the name of your table in Airtable (e.g., "Events")

## Step 2: Configure the Script

Open `js/airtable-events.js` and update these values:

```javascript
const AIRTABLE_CONFIG = {
    baseId: 'appYourBaseIdHere',           // Replace with your Base ID
    tableName: 'Events',                    // Replace if different
    apiKey: 'patYourPersonalAccessToken',  // Replace with your token
    view: 'Published'                       // Optional: create a filtered view
};
```

## Step 3: Add Script to Your Pages

### For events.html (English events page):
Add before the closing `</body>` tag:

```html
<!-- Airtable Events Integration -->
<script src="/js/airtable-events.js"></script>
<script>
    // Load events when page loads
    document.addEventListener('DOMContentLoaded', () => {
        loadEventsEnglish();
    });
</script>
```

### For events-he.html (Hebrew events page):
Add before the closing `</body>` tag:

```html
<!-- Airtable Events Integration -->
<script src="/js/airtable-events.js"></script>
<script>
    // Load events when page loads
    document.addEventListener('DOMContentLoaded', () => {
        loadEventsHebrew();
    });
</script>
```

### For zen-meditation.html (English meditation page):
Add before the closing `</body>` tag:

```html
<!-- Airtable Events Integration -->
<script src="/js/airtable-events.js"></script>
<script>
    // Load events when page loads
    document.addEventListener('DOMContentLoaded', () => {
        loadUpcomingEventsEnglish();
    });
</script>
```

### For zen-meditation-he.html (Hebrew meditation page):
Add before the closing `</body>` tag:

```html
<!-- Airtable Events Integration -->
<script src="/js/airtable-events.js"></script>
<script>
    // Load events when page loads
    document.addEventListener('DOMContentLoaded', () => {
        loadUpcomingEventsHebrew();
    });
</script>
```

## Step 4: Optional - Create a Published View in Airtable

For better performance and security:

1. In Airtable, create a new "Grid view"
2. Name it "Published"
3. Add a filter: `Published` is `checked`
4. This ensures only published events are fetched

## Step 5: Test

1. Deploy your changes to Netlify
2. Visit your events pages
3. Events should load automatically from Airtable
4. Check the browser console (F12) for any errors

## Important Security Note ⚠️

**The current setup exposes your Airtable API key in the browser.** This is OK for:
- Testing and development
- Low-security content
- Public read-only data

**For production, consider:**

### Option A: Netlify Functions (Recommended)
Create a serverless function that calls Airtable server-side:

1. Create `netlify/functions/get-events.js`:
```javascript
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
    const AIRTABLE_API_KEY = process.env.AIRTABLE_API_KEY;
    const AIRTABLE_BASE_ID = process.env.AIRTABLE_BASE_ID;

    const url = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/Events?view=Published`;

    const response = await fetch(url, {
        headers: {
            'Authorization': `Bearer ${AIRTABLE_API_KEY}`
        }
    });

    const data = await response.json();

    return {
        statusCode: 200,
        body: JSON.stringify(data)
    };
};
```

2. Add environment variables in Netlify dashboard:
   - `AIRTABLE_API_KEY` = your token
   - `AIRTABLE_BASE_ID` = your base ID

3. Update `js/airtable-events.js` to call `/.netlify/functions/get-events` instead

### Option B: Use Airtable's Web API (No auth required)
Airtable offers a public shared view option for read-only access.

## Troubleshooting

### Events not loading
- Check browser console (F12) for errors
- Verify API key and Base ID are correct
- Ensure "Published" field is checked for events in Airtable
- Check that the view name matches (case-sensitive)

### CORS errors
- Airtable API should allow browser requests by default
- If issues persist, use Netlify Functions approach above

### Images not showing
- Ensure Image field in Airtable has attachments uploaded
- Fallback image `/images/event.png` will be used if no image

## Field Mapping Reference

| Airtable Field | Used For |
|---------------|----------|
| Published | Controls visibility (must be checked) |
| Is Recurring | Shows on meditation pages even if past date |
| Event Date | Sorting and filtering upcoming events |
| Title (English) | English event title |
| Title (Hebrew) | Hebrew event title |
| Date Display (English) | Human-readable date (English) |
| Date Display (Hebrew) | Human-readable date (Hebrew) |
| Location (English) | Event location (English) |
| Location (Hebrew) | Event location (Hebrew) |
| Language | Event language (English pages) |
| Language (Hebrew) | Event language (Hebrew pages) |
| Description (English) | Full description (English) |
| Description (Hebrew) | Full description (Hebrew) |
| Registration Link | Optional registration URL |
| Image | Event photo (optional) |

## Next Steps

1. Set up your Airtable base with the structure from the previous guide
2. Add your credentials to `js/airtable-events.js`
3. Add the script tags to your HTML pages
4. Test locally or deploy to Netlify
5. For production: implement Netlify Functions for security

Need help? Check the Airtable API documentation: https://airtable.com/developers/web/api/introduction
