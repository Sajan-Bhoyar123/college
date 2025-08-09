#!/bin/bash

echo "Testing School Management API endpoints..."
echo "=========================================="

# Test JSON parsing endpoint
echo "1. Testing JSON parsing endpoint..."
curl -X POST https://college-53qo.onrender.com/test-json \
  -H "Content-Type: application/json" \
  -d '{"test": "data", "number": 123}' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"

echo -e "\n2. Testing Add School endpoint..."
curl -X POST https://college-53qo.onrender.com/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School via Curl",
    "address": "Test Address via Curl",
    "latitude": 12.9716,
    "longitude": 77.5946
  }' \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"

echo -e "\n3. Testing List Schools endpoint..."
curl -X GET "https://college-53qo.onrender.com/listSchools?latitude=12.9716&longitude=77.5946" \
  -w "\nStatus: %{http_code}\nTime: %{time_total}s\n"

echo -e "\nTesting completed!"
