# Scheduled Post Publishing System

## Overview
This system allows you to add multiple posts at once, and they will automatically publish every 2 hours (5 posts at a time). Admin can also manually publish posts anytime.

## Features

### 1. **Automatic Publishing**
- Every 2 hours, the system automatically publishes 5 unpublished posts
- Oldest unpublished posts are published first (FIFO - First In, First Out)
- Runs 24/7 in the background

### 2. **Manual Publishing**
- **Publish Single Post**: Click the green checkmark button on any unpublished post
- **Batch Publish**: Click "Batch Publish" button to publish multiple posts at once
- **Unpublish Post**: Click the yellow eye-slash button to hide a published post

### 3. **Publishing Status**
- **Unpublished Posts**: Show a yellow "Unpublished" badge
- **Published Posts**: No badge (visible to users)
- **Statistics**: Dashboard shows total, published, and unpublished counts

## Setup Instructions

### 1. Install Dependencies
```bash
cd c:\Websites\VipWeb\api
npm install
```

This will install the `node-cron` package required for scheduled publishing.

### 2. Start the Server
```bash
cd c:\Websites\VipWeb\api
npm start
```

The scheduled publisher will automatically initialize when the server starts.

### 3. Verify Installation
Look for these messages in the console:
```
🚀 Initializing Scheduled Post Publisher...
⏰ Schedule: Every 2 hours, publish 5 posts
✅ Scheduled Publisher initialized successfully
```

## How It Works

### For Admin:
1. **Add New Posts**: Posts are saved as "unpublished" by default
2. **View Status**: See publishing statistics at the top of the posts page
3. **Manual Control**:
   - Publish individual posts immediately using the green button
   - Batch publish multiple posts using "Batch Publish" button
   - Unpublish posts if needed using the yellow button

### For Users:
- Only published posts are visible on the website
- Unpublished posts are completely hidden from public view

## Scheduled Publishing Details

### Schedule
- **Frequency**: Every 2 hours
- **Batch Size**: 5 posts per run
- **Order**: Oldest unpublished posts first

### Cron Schedule
The system uses this cron expression: `0 */2 * * *`
- Runs at: 12:00 AM, 2:00 AM, 4:00 AM, 6:00 AM, 8:00 AM, 10:00 AM, 12:00 PM, 2:00 PM, 4:00 PM, 6:00 PM, 8:00 PM, 10:00 PM

### Example Timeline
If you add 50 posts at once:
- **Immediately**: 0 posts visible to users
- **After 2 hours**: 5 posts published
- **After 4 hours**: 10 posts published
- **After 6 hours**: 15 posts published
- **After 20 hours**: All 50 posts published

## API Endpoints

### Get Publishing Statistics
```
GET /publish/stats
```

### Manually Publish Single Post
```
POST /publish/post/:id
Body: { modelType: 'Data' }
```

### Unpublish Post
```
POST /unpublish/post/:id
Body: { modelType: 'Data' }
```

### Batch Publish
```
POST /publish/batch
Body: { batchSize: 5 }
```

## Database Schema Changes

New fields added to both `Data` and `RvData` models:
- `isPublished`: Boolean (default: false)
- `publishedAt`: Date (when the post was published)
- `scheduledPublishTime`: Date (for future scheduling features)

## Customization

### Change Publishing Frequency
Edit `c:\Websites\VipWeb\api\services\scheduledPublisher.js`:
```javascript
// Current: Every 2 hours
const cronSchedule = '0 */2 * * *';

// Options:
// Every hour: '0 * * * *'
// Every 3 hours: '0 */3 * * *'
// Every 30 minutes: '*/30 * * * *'
// Daily at 9 AM: '0 9 * * *'
```

### Change Batch Size
Default is 5 posts per run. You can change this in the admin panel when using "Batch Publish" or modify the default in the code.

## Troubleshooting

### Posts Not Publishing Automatically
1. Check if server is running
2. Look for cron job initialization message in console
3. Verify there are unpublished posts in the database

### Manual Publish Not Working
1. Check browser console for errors
2. Verify API server is running on correct port
3. Check network tab for failed requests

### All Posts Showing as Unpublished
This is normal for existing posts. You can:
1. Use "Batch Publish" to publish them all at once
2. Wait for automatic publishing (5 posts every 2 hours)
3. Manually publish individual posts

## Migration for Existing Posts

If you have existing posts in the database, they will all be marked as "unpublished" by default. To publish them:

### Option 1: Batch Publish All
1. Go to Admin Posts page
2. Click "Batch Publish"
3. Enter the number of posts to publish
4. Click "Publish X Posts"

### Option 2: Wait for Automatic Publishing
The system will automatically publish 5 posts every 2 hours.

### Option 3: Manual Database Update (Advanced)
If you want to mark all existing posts as published:
```javascript
// Run this in MongoDB shell or using a script
db.postdatas.updateMany(
  { isPublished: { $ne: true } },
  { $set: { isPublished: true, publishedAt: new Date() } }
);
```

## Benefits

1. **Consistent Content Flow**: Regular content updates keep users engaged
2. **SEO Friendly**: Gradual publishing is better for search engine indexing
3. **Admin Control**: Full control over what gets published and when
4. **Bulk Upload**: Add many posts at once without overwhelming users
5. **Flexibility**: Automatic + manual publishing options

## Support

For issues or questions, check:
- Server console logs for error messages
- Browser console for frontend errors
- API response messages for detailed error information
