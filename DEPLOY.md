# Deploying to GitHub Pages

Follow these steps to deploy your California Housing Price Predictor to GitHub Pages:

## Step 1: Create a GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right and select "New repository"
3. Name your repository (e.g., `california-housing-predictor`)
4. Make it public
5. Click "Create repository"

## Step 2: Push Your Code

Open your terminal in this project folder and run:

```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: California Housing Price Predictor"

# Add your GitHub repository as remote (replace with your actual repo URL)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## Step 3: Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" (gear icon)
3. In the left sidebar, click on "Pages"
4. Under "Source", select "Deploy from a branch"
5. Under "Branch", select "main" and "/ (root)"
6. Click "Save"

## Step 4: Access Your Website

After a few minutes, your site will be live at:
```
https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/
```

GitHub will show you the exact URL in the Pages settings.

## Files Needed for GitHub Pages

The following files are included and required:
- `index.html` - Main webpage
- `model.js` - JavaScript model and logic
- `.nojekyll` - Tells GitHub Pages not to use Jekyll processing

## Notes

- The app loads the California Housing dataset from an external source
- All machine learning happens in the browser (client-side)
- No backend server required
- Works with any static hosting service

## Troubleshooting

If your site doesn't load:
1. Wait 5-10 minutes for GitHub to build and deploy
2. Check the "Pages" settings to see the deployment status
3. Make sure all files (index.html, model.js) are in the root directory
4. Clear your browser cache and try again

## Alternative: Test Locally

To test before deploying:
1. Open `index.html` directly in your browser, or
2. Use a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Then open http://localhost:8000
   ```

