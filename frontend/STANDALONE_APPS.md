# Standalone Published Apps

This document explains how to serve published apps as standalone applications, separate from the Reshift NoCode platform interface.

## Overview

Published apps can be served in two ways:
1. **Within the platform** - Accessible at `/apps/slug/{slug}` (requires authentication)
2. **As standalone apps** - Accessible at `http://localhost:3001/{slug}` (no authentication required)

## Architecture

### Backend Changes
- Added new endpoint: `GET /api/v1/apps/standalone/{slug}` - serves published app content without authentication
- This endpoint returns the same data as the authenticated endpoint but is publicly accessible

### Frontend Changes
- Created `StandaloneApp.tsx` - a minimal React app for rendering standalone published apps
- Created `standalone.html` - a clean HTML template without platform branding
- Updated `AppRenderer.tsx` to support standalone mode
- Created `standalone-server.js` - Express server for serving standalone apps

## How to Use

### 1. Build the Standalone App
```bash
cd frontend
npm run build:standalone
```

### 2. Start the Standalone Server
```bash
npm run serve:standalone
```

### 3. Access Published Apps
- Standalone apps will be available at: `http://localhost:3001/{app-slug}`
- Example: `http://localhost:3001/my-awesome-app`

## Features

### Standalone App Features
- ✅ No authentication required
- ✅ Clean, minimal interface without platform branding
- ✅ Full app functionality (components, layouts, pages)
- ✅ Responsive design
- ✅ Custom themes and styling
- ✅ Direct URL access

### Platform Integration
- ✅ Dashboard shows "Open Published App" button for published apps
- ✅ Published apps open in new tab/window
- ✅ Maintains separation between platform and published apps

## Development

### Local Development
1. Start the main platform: `npm run dev` (port 3000)
2. Start the backend: `python main.py` (port 8000)
3. Start standalone server: `npm run serve:standalone` (port 3001)

### Production Deployment
1. Build both main app and standalone app: `npm run build && npm run build:standalone`
2. Deploy the `dist` folder to your web server
3. Configure your web server to serve standalone apps from the appropriate routes

## URL Structure

- **Platform**: `http://localhost:3000/` (main app)
- **Standalone Apps**: `http://localhost:3001/{slug}` (published apps)
- **API**: `http://localhost:8000/api/v1/` (backend)

## Security Considerations

- Standalone apps are publicly accessible (no authentication)
- Only published apps can be accessed as standalone
- Unpublished apps return 404 errors
- API endpoints for standalone apps don't require authentication

## Customization

### Styling
- Standalone apps inherit the app's theme configuration
- Custom CSS can be added to the `standalone.html` template
- Material-UI theme can be customized in `StandaloneApp.tsx`

### Domain Configuration
- Update the standalone server URL in `Dashboard.tsx` for production
- Configure your web server to handle standalone app routing
- Consider using subdomains for published apps (e.g., `app-slug.yourdomain.com`)
