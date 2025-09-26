#!/bin/bash

# Reshift No-Code Platform - Enhanced EC2 Deployment Script
# This script sets up the entire application on a fresh EC2 instance

set -e  # Exit on any error
set -u  # Exit on undefined variables

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
REPO_URL="https://github.com/sssreshift/no_code_platform.git"
APP_DIR="/opt/reshift"
DOMAIN="${1:-app.reshift.co.uk}"  # Use first argument or default
LOG_FILE="/tmp/reshift-deploy.log"

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

warning() {
    echo -e "${YELLOW}[WARNING] $1${NC}" | tee -a "$LOG_FILE"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root. Please run as ubuntu user."
fi

log "🚀 Starting Reshift No-Code Platform Deployment on EC2..."
log "📝 Logging to: $LOG_FILE"
log "🌐 Domain: $DOMAIN"

# Update system packages
log "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y >> "$LOG_FILE" 2>&1

# Add Node.js repository first
log "📦 Adding Node.js 18 repository..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - >> "$LOG_FILE" 2>&1

# Install required system dependencies
log "🔧 Installing system dependencies..."
sudo apt install -y \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    python3-pip \
    nginx \
    nodejs \
    git \
    curl \
    wget \
    unzip \
    build-essential \
    libssl-dev \
    libffi-dev \
    libmysqlclient-dev \
    pkg-config \
    supervisor \
    certbot \
    python3-certbot-nginx \
    ufw >> "$LOG_FILE" 2>&1

# Verify installations
log "✅ Verifying installations..."
python3.11 --version || error "Python 3.11 installation failed"
node --version || error "Node.js installation failed"
npm --version || error "npm installation failed"
nginx -v || error "Nginx installation failed"

# Create application directory
log "📁 Creating application directory..."
sudo mkdir -p "$APP_DIR"
sudo chown $USER:$USER "$APP_DIR"

# Clone repository
log "📥 Cloning repository from GitHub..."
if [ -d "$APP_DIR/.git" ]; then
    log "Repository already exists, pulling latest changes..."
    cd "$APP_DIR"
    git pull origin main >> "$LOG_FILE" 2>&1
else
    git clone "$REPO_URL" "$APP_DIR" >> "$LOG_FILE" 2>&1
    cd "$APP_DIR"
fi

# Set up backend
log "🐍 Setting up Python backend..."
cd "$APP_DIR/backend"

# Check if requirements.txt exists
if [ ! -f "requirements.txt" ]; then
    error "requirements.txt not found in backend directory"
fi

# Create virtual environment
if [ ! -d "venv" ]; then
    log "Creating Python virtual environment..."
    python3.11 -m venv venv
fi

# Activate virtual environment and install dependencies
log "Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip >> "$LOG_FILE" 2>&1
pip install -r requirements.txt >> "$LOG_FILE" 2>&1

# Set up frontend
log "⚛️ Setting up React frontend..."
cd "$APP_DIR/frontend"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    error "package.json not found in frontend directory"
fi

# Install frontend dependencies
log "Installing Node.js dependencies..."
npm install >> "$LOG_FILE" 2>&1

# Create production environment files
log "⚙️ Creating production configuration..."

# Generate a secure secret key
SECRET_KEY=$(openssl rand -hex 32)

# Get EC2 public IP
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "localhost")

# Backend production config
log "Creating backend environment configuration..."
cat > "$APP_DIR/backend/.env.production" << EOF
# Database Configuration
DATABASE_URL=mysql+pymysql://admin:reshift12345@database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com/ZeroCarbon12345

# Security
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=["https://$DOMAIN","https://www.$DOMAIN","http://$PUBLIC_IP","http://localhost:3000"]

# Environment
ENVIRONMENT=production
DEBUG=false
EOF

# Frontend production config
log "Creating frontend environment configuration..."
cat > "$APP_DIR/frontend/.env.production" << EOF
VITE_API_BASE_URL=https://$DOMAIN/api/v1
VITE_APP_NAME=Reshift No-Code Platform
VITE_APP_VERSION=1.0.0
EOF

# Build frontend
log "🏗️ Building frontend application..."
cd "$APP_DIR/frontend"
npm run build >> "$LOG_FILE" 2>&1

# Verify build
if [ ! -d "dist" ]; then
    error "Frontend build failed - dist directory not found"
fi

# Configure Nginx
log "🌐 Configuring Nginx..."
# Update nginx config with actual domain
sed "s/app\.reshift\.co\.uk/$DOMAIN/g" "$APP_DIR/deployment/nginx.conf" > /tmp/nginx-reshift.conf
sed "s/www\.app\.reshift\.co\.uk/www.$DOMAIN/g" /tmp/nginx-reshift.conf > /tmp/nginx-reshift-final.conf

sudo cp /tmp/nginx-reshift-final.conf /etc/nginx/sites-available/reshift
sudo ln -sf /etc/nginx/sites-available/reshift /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t || error "Nginx configuration test failed"

# Configure Supervisor
log "🔧 Configuring Supervisor..."
sudo mkdir -p /var/log/reshift
sudo chown www-data:www-data /var/log/reshift

# Update supervisor config paths
sed "s|/opt/reshift|$APP_DIR|g" "$APP_DIR/deployment/supervisor.conf" > /tmp/supervisor-reshift.conf
sudo cp /tmp/supervisor-reshift.conf /etc/supervisor/conf.d/reshift.conf

# Configure firewall
log "🛡️ Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 8000  # For testing backend directly

# Start services
log "🚀 Starting services..."
sudo systemctl enable nginx
sudo systemctl restart nginx

sudo supervisorctl reread >> "$LOG_FILE" 2>&1
sudo supervisorctl update >> "$LOG_FILE" 2>&1
sudo supervisorctl start all >> "$LOG_FILE" 2>&1

# Wait a moment for services to start
sleep 5

# Check service status
log "🔍 Checking service status..."
if sudo supervisorctl status | grep -q "RUNNING"; then
    log "✅ Supervisor services are running"
else
    warning "⚠️ Some supervisor services may not be running properly"
    sudo supervisorctl status
fi

if sudo systemctl is-active --quiet nginx; then
    log "✅ Nginx is running"
else
    error "❌ Nginx failed to start"
fi

# Test backend health
log "🩺 Testing backend health..."
sleep 10  # Give backend time to start
if curl -f http://localhost:8000/health > /dev/null 2>&1; then
    log "✅ Backend is responding to health checks"
else
    warning "⚠️ Backend health check failed - this might be normal if database connection is not ready"
fi

# SSL Certificate setup (optional)
if [ "$DOMAIN" != "localhost" ] && [ "$DOMAIN" != "$PUBLIC_IP" ]; then
    log "🔒 Setting up SSL certificate..."
    if sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN" --redirect; then
        log "✅ SSL certificate installed successfully"
    else
        warning "⚠️ SSL certificate installation failed - you can set it up manually later"
    fi
fi

# Final checks and summary
log "🎯 Performing final checks..."

# Check if frontend is accessible
if curl -f http://localhost/ > /dev/null 2>&1; then
    log "✅ Frontend is accessible"
else
    warning "⚠️ Frontend accessibility check failed"
fi

# Display summary
log "🎉 Deployment completed successfully!"
echo ""
echo -e "${BLUE}📋 Deployment Summary:${NC}"
echo -e "${GREEN}✅ Application Directory: $APP_DIR${NC}"
echo -e "${GREEN}✅ Domain: $DOMAIN${NC}"
echo -e "${GREEN}✅ Public IP: $PUBLIC_IP${NC}"
echo -e "${GREEN}✅ Backend API: http://$PUBLIC_IP:8000${NC}"
echo -e "${GREEN}✅ Frontend: http://$PUBLIC_IP${NC}"
if [ "$DOMAIN" != "localhost" ] && [ "$DOMAIN" != "$PUBLIC_IP" ]; then
    echo -e "${GREEN}✅ Production URL: https://$DOMAIN${NC}"
fi
echo ""
echo -e "${YELLOW}📝 Useful Commands:${NC}"
echo "  View backend logs: sudo supervisorctl tail -f reshift-backend"
echo "  View frontend logs: sudo supervisorctl tail -f reshift-frontend"
echo "  Restart services: sudo supervisorctl restart all"
echo "  Check service status: sudo supervisorctl status"
echo "  View deployment log: cat $LOG_FILE"
echo ""
echo -e "${BLUE}🔧 Next Steps:${NC}"
echo "1. Point your domain DNS to: $PUBLIC_IP"
echo "2. Test your application at: http://$PUBLIC_IP"
echo "3. Check logs if any issues occur"
echo "4. Set up monitoring and backups"

log "🏁 Deployment script completed at $(date)"
