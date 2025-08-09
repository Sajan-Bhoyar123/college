# Postman Troubleshooting Guide

## Your API is Working! ✅

The PowerShell test confirmed that your API endpoints are working correctly:
- ✅ `/addSchool` - Successfully added a new school (ID: 9)
- ✅ `/listSchools` - Returns 9 schools with proper distance calculations

## Postman Issues and Solutions

### 1. Clear Postman Cache
- Go to **Settings** (gear icon) → **General**
- Click **Clear Cache and Reload**
- Restart Postman

### 2. Check Request Configuration
Make sure your POST request has:

**Headers:**
```
Content-Type: application/json
Accept: application/json
```

**Body (raw JSON):**
```json
{
  "name": "Delta School",
  "address": "4th Street",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### 3. Common Postman Issues

#### Issue: "name" and "address" are undefined
**Solution:**
1. Make sure you're on the **Body** tab (not Params)
2. Select **raw** mode
3. Select **JSON** from the dropdown
4. Ensure no extra spaces or characters in the JSON

#### Issue: 400 Bad Request
**Solution:**
1. Check that the URL is exactly: `https://college-53qo.onrender.com/addSchool`
2. Verify the HTTP method is **POST**
3. Ensure the JSON is valid (no syntax errors)

### 4. Alternative Testing Methods

#### Using PowerShell (Windows):
```powershell
$body = @{
    name = "Test School"
    address = "Test Address"
    latitude = 12.9716
    longitude = 77.5946
} | ConvertTo-Json

Invoke-RestMethod -Uri "https://college-53qo.onrender.com/addSchool" -Method POST -Body $body -ContentType "application/json"
```

#### Using curl:
```bash
curl -X POST https://college-53qo.onrender.com/addSchool \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test School",
    "address": "Test Address",
    "latitude": 12.9716,
    "longitude": 77.5946
  }'
```

### 5. Import Updated Collection
1. Delete the old collection from Postman
2. Import the updated `postman_collection.json`
3. Try the requests again

### 6. Browser Testing
You can also test the API directly in your browser:
- Open: `https://college-53qo.onrender.com/listSchools?latitude=12.9716&longitude=77.5946`

## Expected Successful Response

When the POST request works correctly, you should get:
```json
{
  "id": 10,
  "name": "Delta School",
  "address": "4th Street",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

## Still Having Issues?

If Postman still doesn't work:
1. Try using a different tool (Insomnia, Thunder Client, etc.)
2. Use the PowerShell script: `.\test-curl.ps1`
3. Check if there are any browser extensions interfering with Postman
4. Try the Postman web version instead of the desktop app
