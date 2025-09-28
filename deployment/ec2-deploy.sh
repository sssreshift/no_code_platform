#!/bin/bash

# Reshift No-Code Platform - EC2 Deployment Script
# This script sets up the entire application on a fresh EC2 instance

set -e  # Exit on any error
set -u  # Exit on undefined variables

# Configuration
APP_DIR="/opt/reshift"
DOMAIN="${1:-app.reshift.co.uk}"  # Use first argument or default
LOG_FILE="/tmp/reshift-deploy.log"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%H:%M:%S')] $1${NC}" | tee -a "$LOG_FILE"
}

error() {
    echo -e "${RED}[ERROR] $1${NC}" | tee -a "$LOG_FILE"
    exit 1
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   error "This script should not be run as root. Please run as ubuntu user."
fi

log "🚀 Starting Reshift No-Code Platform Deployment on EC2..."
log "🌐 Domain: $DOMAIN"

# Update system packages
log "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Add Node.js repository first
log "📦 Adding Node.js 18 repository..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -

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
    ufw

# Verify installations
log "✅ Verifying installations..."
python3.11 --version || error "Python 3.11 installation failed"
node --version || error "Node.js installation failed"
npm --version || error "npm installation failed"

# Create application directory
log "📁 Creating application directory..."
sudo mkdir -p "$APP_DIR"
sudo chown $USER:$USER "$APP_DIR"

# Use existing repository (no git operations)
log "📁 Using existing repository..."
if [ ! -d "$APP_DIR" ]; then
    error "Application directory $APP_DIR does not exist. Please clone the repository first."
fi
cd "$APP_DIR"

# Verify we're in a git repository
if [ ! -d ".git" ]; then
    error "Not a git repository. Please ensure you're in the correct directory."
fi

log "✅ Repository found at $APP_DIR"

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
pip install --upgrade pip
pip install -r requirements.txt

# Set up frontend
log "⚛️ Setting up React frontend..."
cd "$APP_DIR/frontend"

# Check if package.json exists
if [ ! -f "package.json" ]; then
    error "package.json not found in frontend directory"
fi

# Install frontend dependencies
log "Installing Node.js dependencies..."
npm install

# Create production configuration
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
npm run build

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

sudo cp "$APP_DIR/deployment/supervisor.conf" /etc/supervisor/conf.d/reshift.conf

# Configure firewall
log "🛡️ Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 'Nginx Full'
sudo ufw allow 8000

# Start services
log "🚀 Starting services..."
sudo systemctl enable nginx
sudo systemctl restart nginx

sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all

# Wait for services to start
sleep 5

# Check service status
log "🔍 Checking service status..."
sudo supervisorctl status

# SSL Certificate setup (optional)
if [ "$DOMAIN" != "localhost" ] && [ "$DOMAIN" != "$PUBLIC_IP" ]; then
    log "🔒 Setting up SSL certificate..."
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN" --redirect || log "SSL setup skipped - configure manually if needed"
fi

# Display summary
log "🎉 Deployment completed successfully!"
echo ""
echo -e "${GREEN}📋 Deployment Summary:${NC}"
echo -e "✅ Application Directory: $APP_DIR"
echo -e "✅ Domain: $DOMAIN"
echo -e "✅ Public IP: $PUBLIC_IP"
echo -e "✅ Backend API: http://$PUBLIC_IP:8000"
echo -e "✅ Frontend: http://$PUBLIC_IP"
if [ "$DOMAIN" != "localhost" ] && [ "$DOMAIN" != "$PUBLIC_IP" ]; then
    echo -e "✅ Production URL: https://$DOMAIN"
fi
echo ""
echo -e "${YELLOW}📝 Useful Commands:${NC}"
echo "  View backend logs: sudo supervisorctl tail -f reshift-backend"
echo "  View frontend logs: sudo supervisorctl tail -f reshift-frontend"
echo "  Restart services: sudo supervisorctl restart all"
echo "  Check service status: sudo supervisorctl status"
echo ""
log "🏁 Deployment script completed!"
