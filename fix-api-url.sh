#!/bin/bash

# Fix Frontend API URL Configuration
# This fixes the issue where frontend calls localhost instead of the domain

set -e

DOMAIN="app.reshift.co.uk"
APP_DIR="/opt/reshift"

echo "🔧 Fixing Frontend API URL Configuration"
echo "========================================"
echo "Domain: $DOMAIN"
echo "Issue: Frontend calling localhost instead of $DOMAIN"
echo ""

# Check if we're on the EC2 instance
if [ ! -d "$APP_DIR" ]; then
    echo "❌ Error: This script must be run on the EC2 instance where the app is deployed"
    exit 1
fi

cd "$APP_DIR"

echo "1. 📝 Updating Frontend Environment Configuration"
echo "================================================"

# Create the correct frontend production environment
cat > "$APP_DIR/frontend/.env.production" << EOF
VITE_API_BASE_URL=http://$DOMAIN/api/v1
VITE_APP_NAME=Reshift No-Code Platform
VITE_APP_VERSION=1.0.0
NODE_ENV=production
EOF

echo "✅ Frontend .env.production updated:"
cat "$APP_DIR/frontend/.env.production"
echo ""

echo "2. 📝 Updating Backend CORS Configuration"
echo "========================================="

# Get the current secret key if it exists
SECRET_KEY=$(grep "SECRET_KEY=" "$APP_DIR/backend/.env.production" 2>/dev/null | cut -d'=' -f2 || openssl rand -hex 32)

# Update backend environment to allow the domain
cat > "$APP_DIR/backend/.env.production" << EOF
# Database Configuration
DATABASE_URL=mysql+pymysql://admin:reshift12345@database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com/ZeroCarbon12345

# Security
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS - Allow domain access
BACKEND_CORS_ORIGINS=["http://$DOMAIN","https://$DOMAIN","http://www.$DOMAIN","https://www.$DOMAIN","http://localhost:3000"]

# Environment
ENVIRONMENT=production
DEBUG=false
EOF

echo "✅ Backend CORS configuration updated"
echo ""

echo "3. 🏗️ Rebuilding Frontend"
echo "========================="

cd "$APP_DIR/frontend"

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/
rm -rf node_modules/.vite/

# Build with production environment
echo "🔨 Building frontend with production config..."
NODE_ENV=production npm run build 2>/dev/null || npm run build:production 2>/dev/null || npm run build

# Verify build
if [ ! -d "dist" ] || [ -z "$(ls -A dist)" ]; then
    echo "❌ Frontend build failed!"
    exit 1
fi

echo "✅ Frontend build completed"

# Fix ownership
echo "🔧 Fixing file ownership..."
sudo chown -R www-data:www-data "$APP_DIR/frontend/dist"

echo ""
echo "4. 🔄 Restarting Services"
echo "========================"

# Restart backend to pick up new CORS settings
echo "🔄 Restarting backend service..."
sudo supervisorctl restart reshift-backend

# Reload nginx to serve new frontend files
echo "🔄 Reloading nginx..."
sudo systemctl reload nginx

# Wait for services
sleep 3

echo ""
echo "5. 🧪 Testing Configuration"
echo "==========================="

# Test if backend is responding
if curl -s --max-time 5 "http://localhost:8000/docs" > /dev/null; then
    echo "✅ Backend API is responding"
else
    echo "❌ Backend API is not responding"
fi

# Test if frontend is being served
if curl -s --max-time 5 "http://localhost" > /dev/null; then
    echo "✅ Frontend is being served"
else
    echo "❌ Frontend is not being served"
fi

echo ""
echo "🎉 Configuration Fix Completed!"
echo "==============================="
echo ""
echo "✅ Frontend now configured to call: http://$DOMAIN/api/v1"
echo "✅ Backend CORS allows: $DOMAIN"
echo "✅ Services restarted"
echo ""
echo "🌐 Test your application at:"
echo "   Frontend: http://$DOMAIN"
echo "   Backend API: http://$DOMAIN/api/v1"
echo "   API Docs: http://$DOMAIN/docs"
echo ""
echo "🔍 If login still fails, check browser developer tools:"
echo "   1. Open F12 Developer Tools"
echo "   2. Go to Network tab"
echo "   3. Try to login"
echo "   4. Check if API calls are now going to $DOMAIN instead of localhost"
echo ""
echo "📝 Useful commands for debugging:"
echo "   Backend logs: sudo supervisorctl tail -f reshift-backend"
echo "   Nginx logs: sudo tail -f /var/log/nginx/error.log"
