# 🚀 Reshift No-Code Platform - EC2 Deployment Guide

This guide will help you deploy your Reshift no-code platform on an AWS EC2 instance.

## 📋 Prerequisites

1. **AWS Account** with EC2 access
2. **Domain name** (optional but recommended)
3. **SSH access** to your EC2 instance
4. **Basic knowledge** of Linux commands

## 🏗️ EC2 Instance Setup

### 1. Launch EC2 Instance

**Recommended Instance Type:** `t3.medium` or `t3.large`
- **CPU:** 2-4 vCPUs
- **RAM:** 4-8 GB
- **Storage:** 20-50 GB SSD
- **OS:** Ubuntu 22.04 LTS

**Security Group Rules:**
```
Type           Protocol    Port Range    Source
HTTP           TCP         80            0.0.0.0/0
HTTPS          TCP         443           0.0.0.0/0
SSH            TCP         22            Your IP
Custom TCP     TCP         8000          0.0.0.0/0 (for testing)
```

### 2. Connect to Your Instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

## 🚀 Deployment Methods

### Method 1: Manual Deployment (Recommended for beginners)

#### Step 1: Run the Setup Script

```bash
# Download and run the deployment script
curl -O https://raw.githubusercontent.com/your-repo/reshift-nocode-platform/main/deployment/ec2-deploy.sh
chmod +x ec2-deploy.sh
./ec2-deploy.sh
```

#### Step 2: Upload Your Application

```bash
# Create a zip of your application
zip -r reshift-app.zip backend/ frontend/ deployment/

# Upload to EC2 (from your local machine)
scp -i your-key.pem reshift-app.zip ubuntu@your-ec2-ip:/opt/reshift/

# Extract on EC2
cd /opt/reshift
unzip reshift-app.zip
```

#### Step 3: Configure Environment Variables

```bash
# Edit backend environment
nano backend/.env.production

# Edit frontend environment
nano frontend/.env.production
```

#### Step 4: Set Up Nginx

```bash
# Copy nginx configuration
sudo cp deployment/nginx.conf /etc/nginx/sites-available/reshift
sudo ln -s /etc/nginx/sites-available/reshift /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Test nginx configuration
sudo nginx -t

# Restart nginx
sudo systemctl restart nginx
```

#### Step 5: Set Up Supervisor

```bash
# Create log directory
sudo mkdir -p /var/log/reshift
sudo chown www-data:www-data /var/log/reshift

# Copy supervisor configuration
sudo cp deployment/supervisor.conf /etc/supervisor/conf.d/reshift.conf

# Reload supervisor
sudo supervisorctl reread
sudo supervisorctl update
sudo supervisorctl start all
```

#### Step 6: Set Up SSL (Optional but Recommended)

```bash
# Install certbot
sudo apt install certbot python3-certbot-nginx

# Get SSL certificate
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### Method 2: Docker Deployment (Advanced)

#### Step 1: Install Docker

```bash
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.20.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

#### Step 2: Deploy with Docker Compose

```bash
# Copy docker-compose file
cp deployment/docker-compose.yml .

# Create environment file
cat > .env << EOF
MYSQL_ROOT_PASSWORD=your-secure-password
MYSQL_DATABASE=reshift
MYSQL_USER=reshift
MYSQL_PASSWORD=your-secure-password
SECRET_KEY=your-super-secret-key
EOF

# Start services
docker-compose up -d
```

## 🔧 Configuration

### Environment Variables

**Backend (.env.production):**
```env
DATABASE_URL=mysql+pymysql://admin:reshift12345@database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com/ZeroCarbon12345
SECRET_KEY=your-super-secret-key-change-this
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]
ENVIRONMENT=production
DEBUG=false
```

**Frontend (.env.production):**
```env
VITE_API_BASE_URL=https://yourdomain.com/api/v1
VITE_APP_NAME=Reshift No-Code Platform
VITE_APP_VERSION=1.0.0
```

### Database Configuration

Your app is already configured to use AWS RDS MySQL:
- **Host:** database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com
- **Database:** ZeroCarbon12345
- **Username:** admin
- **Password:** reshift12345

## 🚀 Starting the Services

### Manual Deployment
```bash
# Start all services
sudo supervisorctl start all

# Check status
sudo supervisorctl status

# View logs
sudo supervisorctl tail -f reshift-backend
sudo supervisorctl tail -f reshift-frontend
```

### Docker Deployment
```bash
# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend
```

## 🔍 Monitoring and Maintenance

### Health Checks

```bash
# Check backend health
curl http://localhost:8000/health

# Check frontend
curl http://localhost:3000

# Check nginx
curl http://localhost
```

### Log Monitoring

```bash
# Backend logs
tail -f /var/log/reshift/backend.log

# Frontend logs
tail -f /var/log/reshift/frontend.log

# Nginx logs
tail -f /var/log/nginx/reshift_access.log
tail -f /var/log/nginx/reshift_error.log
```

### Backup Strategy

```bash
# Database backup
mysqldump -h database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com -u admin -p ZeroCarbon12345 > backup_$(date +%Y%m%d).sql

# Application backup
tar -czf reshift_backup_$(date +%Y%m%d).tar.gz /opt/reshift
```

## 🔒 Security Considerations

1. **Change default passwords**
2. **Use strong secret keys**
3. **Enable firewall rules**
4. **Regular security updates**
5. **Monitor access logs**
6. **Use HTTPS in production**

## 🆘 Troubleshooting

### Common Issues

**Backend not starting:**
```bash
# Check logs
sudo supervisorctl tail -f reshift-backend

# Check database connection
python3 -c "import pymysql; pymysql.connect(host='database-1.cirbwefqfnpy.us-east-1.rds.amazonaws.com', user='admin', password='reshift12345', database='ZeroCarbon12345')"
```

**Frontend not loading:**
```bash
# Check build
cd /opt/reshift/frontend
npm run build

# Check nginx
sudo nginx -t
sudo systemctl restart nginx
```

**Database connection issues:**
- Check RDS security groups
- Verify database credentials
- Check network connectivity

## 📞 Support

If you encounter issues:
1. Check the logs first
2. Verify all environment variables
3. Test each service individually
4. Check AWS RDS connectivity

## 🎉 Success!

Once deployed, your Reshift no-code platform will be available at:
- **Frontend:** https://yourdomain.com
- **API:** https://yourdomain.com/api/v1
- **Marketplace:** https://yourdomain.com/marketplace
- **Themes:** https://yourdomain.com/themes

Your platform is now ready for production use! 🚀
