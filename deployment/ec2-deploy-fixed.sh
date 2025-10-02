#!/bin/bash

# Reshift No-Code Platform - EC2 Deployment Script with Git Conflict Resolution
# This script handles git conflicts automatically

set -e  # Exit on any error
set -u  # Exit on undefined variables

# Configuration
REPO_URL="https://github.com/sssreshift/no_code_platform.git"
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

# Add Python 3.11 from deadsnakes PPA
log "📦 Adding Python 3.11 repository..."
sudo apt install software-properties-common -y
sudo add-apt-repository ppa:deadsnakes/ppa -y
sudo apt update

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

# Handle repository with conflict resolution
log "📥 Setting up repository..."
if [ -d "$APP_DIR/.git" ]; then
    log "Repository exists, handling potential conflicts..."
    cd "$APP_DIR"
    
    # Stash any local changes
    git stash --include-untracked || true
    
    # Reset to clean state
    git reset --hard HEAD || true
    git clean -fd || true
    
    # Pull latest changes
    git pull origin main || {
        log "Pull failed, trying force reset..."
        git fetch origin
        git reset --hard origin/main
    }
else
    log "Cloning fresh repository..."
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# Set up backend
log "🐍 Setting up Python backend..."
cd "$APP_DIR/backend"

if [ ! -f "requirements.txt" ]; then
    error "requirements.txt not found in backend directory"
fi

if [ ! -d "venv" ]; then
    log "Creating Python virtual environment..."
    python3.11 -m venv venv
fi

log "Installing Python dependencies..."
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt

# Set up frontend
log "⚛️ Setting up React frontend..."
cd "$APP_DIR/frontend"

if [ ! -f "package.json" ]; then
    error "package.json not found in frontend directory"
fi

# Clean npm cache and reinstall to avoid conflicts
log "Cleaning npm cache and installing dependencies..."
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Create production configuration
log "⚙️ Creating production configuration..."

SECRET_KEY=$(openssl rand -hex 32)
PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "localhost")

log "Creating backend environment configuration..."
cat > "$APP_DIR/backend/.env.production" << EOL
DATABASE_URL=mysql+pymysql://admin:reshift12345@database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com/ZeroCarbon12345
SECRET_KEY=$SECRET_KEY
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_CORS_ORIGINS=["https://$DOMAIN","https://www.$DOMAIN","http://$PUBLIC_IP","http://localhost:3000"]
ENVIRONMENT=production
DEBUG=false
EOL

log "Creating frontend environment configuration..."
cat > "$APP_DIR/frontend/.env.production" << EOL
VITE_API_BASE_URL=https://$DOMAIN/api/v1
VITE_APP_NAME=Reshift No-Code Platform
VITE_APP_VERSION=1.0.0
EOL

# Build frontend
log "🏗️ Building frontend application..."
cd "$APP_DIR/frontend"
npm run build

if [ ! -d "dist" ]; then
    error "Frontend build failed - dist directory not found"
fi

# Configure Nginx
log "🌐 Configuring Nginx..."
sed "s/app\.reshift\.co\.uk/$DOMAIN/g" "$APP_DIR/deployment/nginx.conf" > /tmp/nginx-reshift.conf
sed "s/www\.app\.reshift\.co\.uk/www.$DOMAIN/g" /tmp/nginx-reshift.conf > /tmp/nginx-reshift-final.conf

sudo cp /tmp/nginx-reshift-final.conf /etc/nginx/sites-available/reshift
sudo ln -sf /etc/nginx/sites-available/reshift /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

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

sleep 5

log "🔍 Checking service status..."
sudo supervisorctl status

# SSL Certificate setup
if [ "$DOMAIN" != "localhost" ] && [ "$DOMAIN" != "$PUBLIC_IP" ]; then
    log "🔒 Setting up SSL certificate..."
    sudo certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email "admin@$DOMAIN" --redirect || log "SSL setup skipped - configure manually if needed"
fi

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



