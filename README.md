# Luke Connor 10-Week Upper Body PWA

A self contained progressive web app for tracking a 10-week, low impact upper body home workout program using 5 kg dumbbells.

## Files
- `index.html` - complete app, schedule and tracker
- `manifest.json` - installable PWA configuration
- `sw.js` - offline cache service worker
- `icon-192.png` and `icon-512.png` - app icons

## Publish with GitHub Pages
1. Create a new GitHub repository.
2. Upload all six files to the repository root.
3. Open **Settings > Pages**.
4. Under **Build and deployment**, select **Deploy from a branch**.
5. Select the `main` branch and `/ (root)`, then save.
6. Open the GitHub Pages address on your phone.
7. On Android, use Chrome > menu > **Install app**. On iPhone, use Safari > Share > **Add to Home Screen**.

A web server is required for PWA installation and offline service worker support. Opening `index.html` directly is suitable for previewing, but not installation.

## Progress storage
Progress is saved locally in the browser using localStorage. Clearing site data or changing browsers will reset it.

## Health note
This app provides general exercise information only. Stop if you experience sharp pain, dizziness, chest discomfort or unusual shortness of breath. Seek medical guidance before beginning if you have a health condition or injury.
