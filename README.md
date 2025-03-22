# Photo Gallery App =)

A modern photo gallery application built with Next.js.

## GitHub Pages Deployment

This app is configured for deployment to GitHub Pages.

### Automatic Deployment

The app is configured to automatically deploy to GitHub Pages when changes are pushed to the main branch. The deployment is handled by GitHub Actions.

### Manual Deployment

To manually deploy the app to GitHub Pages:

1. Make sure you have the gh-pages package installed:
   ```
   npm install --save-dev gh-pages
   ```

2. Build and deploy the app:
   ```
   npm run build
   npm run deploy
   ```

### Configuration

- Update the `basePath` in `next.config.js` to match your repository name.
- Make sure GitHub Pages is enabled in your repository settings and is set to deploy from the `gh-pages` branch.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

## Build

```bash
# Create production build
npm run build

# Serve production build locally
npm start
```

And open `http://localhost:3000` in your browser.
