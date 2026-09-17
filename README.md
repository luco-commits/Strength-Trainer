# Strength Trainer guided update

This version removes the side navigation and provides a guided, step by step workout flow.

## Upload to GitHub
1. Open the `Strength-Trainer` repository.
2. Select **Add file**, then **Upload files**.
3. Upload every item from this package, including the complete `images` folder.
4. Commit the changes.
5. Wait one to five minutes for GitHub Pages to redeploy.

## Important cache step
This release uses a new service worker cache name. If the installed phone app still shows an older design, remove the app shortcut, clear site data for the GitHub Pages site, reload the site and install it again.

Progress is held in local browser storage. The guided workout advances one repetition at a time, then one set at a time, then one exercise at a time.

## Set based workflow
The Done button now advances after the full set, rather than after each repetition. The required repetitions remain clearly displayed for each set.

## Rest timer update
All rest periods are 45 seconds. The timer now appears as an overlay while the current exercise remains visible underneath.

## Schedule controls and countdown sound
The overview now supports resetting a completed day, reopening the most recently completed day, and resetting the complete schedule. During the 45 second rest overlay, an energetic tone plays once per second at 5, 4, 3, 2 and 1 seconds. Browser audio restrictions require the workout to be started by a user tap, which is already part of the app flow.
