#!/bin/bash

# Replace these with your actual values
DOMAIN="bible-themeapp.melnerdz.com"
EMAIL="biblethemeapp@melnerdz.com"

# Create directories
mkdir -p ./certbot/conf
mkdir -p ./certbot/www

# Stop any running containers
docker-compose -f docker-compose.prod.yml down

# Start nginx without SSL first (for initial certificate)
docker run -d --name temp-nginx \
  -v $(pwd)/nginx/nginx-initial.conf:/etc/nginx/nginx.conf:ro \
  -v $(pwd)/certbot/www:/var/www/certbot:ro \
  -p 80:80 \
  nginx:alpine

# Get the certificate
docker run --rm \
  -v $(pwd)/certbot/conf:/etc/letsencrypt \
  -v $(pwd)/certbot/www:/var/www/certbot \
  certbot/certbot certonly --webroot \
  --webroot-path=/var/www/certbot \
  --email $EMAIL \
  --agree-tos \
  --no-eff-email \
  -d $DOMAIN \
  -d www.$DOMAIN

# Stop temporary nginx
docker stop temp-nginx
docker rm temp-nginx

echo "Certificate obtained! Now run: docker-compose -f docker-compose.prod.yml up -d --build"
