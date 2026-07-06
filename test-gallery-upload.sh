#!/usr/bin/env bash

BASE_URL="http://localhost:8080"
USERNAME="admin"
PASSWORD="your_secure_password"
IMAGE_PATH="C:/Users/sammy/Documents/GitHub/jpweb/frontend/src/assets/1-julie-payette-official-picture-csa-2009-min.jpg"

echo "Logging in..."
curl -i -c cookies.txt -X POST "$BASE_URL/api/auth/login" \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}"

echo ""
echo "Uploading image..."
curl -i -b cookies.txt -X POST "$BASE_URL/api/admin/gallery/upload" \
  -F "file=@$IMAGE_PATH" \
  -F "caption=Test image" \
  -F "altText=Test alt text"

echo ""
echo "Checking public gallery..."
curl -i "$BASE_URL/api/gallery"