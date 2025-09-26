#!/bin/bash

# Reshift No-Code Platform - EC2 Deployment Script
# This script sets up the entire application on a fresh EC2 instance

set -e  # Exit on any error

echo "🚀 Starting Reshift No-Code Platform Deployment on EC2..."

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required system dependencies
echo "🔧 Installing system dependencies..."
sudo apt install -y \
    python3.11 \
    python3.11-venv \
    python3.11-dev \
    python3-pip \
    nginx \
    nodejs \
    npm \
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
    python3-certbot-nginx

# Install Node.js 18 (LTS)
echo "📦 Installing Node.js 18..."
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Create application directory
echo "📁 Creating application directory..."
sudo mkdir -p /opt/reshift
sudo chown $USER:$USER /opt/reshift
cd /opt/reshift

# Clone your repository (replace with your actual repo URL)
echo "📥 Cloning repository..."
# git clone https://github.com/yourusername/reshift-nocode-platform.git .
# For now, we'll assume you'll upload the files manually

# Set up backend
echo "🐍 Setting up Python backend..."
cd /opt/reshift/backend

# Create virtual environment
python3.11 -m venv venv
source venv/bin/activate

# Install Python dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Set up frontend
echo "⚛️ Setting up React frontend..."
cd /opt/reshift/frontend
npm install
npm run build

# Create production configuration
echo "⚙️ Creating production configuration..."
cd /opt/reshift

# Backend production config
cat > backend/.env.production << EOF
# Database Configuration
DATABASE_URL=mysql+pymysql://admin:reshift12345@database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com/ZeroCarbon12345

# Security
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:3000","https://yourdomain.com"]

# Environment
ENVIRONMENT=production
DEBUG=false
EOF

# Frontend production config
cat > frontend/.env.production << EOF
VITE_API_BASE_URL=https://yourdomain.com/api/v1
VITE_APP_NAME=Reshift No-Code Platform
VITE_APP_VERSION=1.0.0
EOF

echo "✅ Basic setup completed!"
echo "📋 Next steps:"
echo "1. Upload your application files to /opt/reshift"
echo "2. Configure your domain name"
echo "3. Set up SSL certificates"
echo "4. Start the services"
