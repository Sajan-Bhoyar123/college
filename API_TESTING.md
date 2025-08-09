# API Testing Guide

## Local Testing

1. **Start the server locally:**
   ```bash
   npm install
   npm start
   ```

2. **Test using the HTML page:**
   - Open `http://localhost:3000/test.html` in your browser
   - Click the test buttons to verify the API endpoints

3. **Test using the Node.js script:**
   ```bash
   node test-api.js
   ```

## Postman Testing

1. **Import the Postman collection:**
   - Import `postman_collection.json` into Postman

2. **Add School Request:**
   - Method: POST
   - URL: `https://college-53qo.onrender.com/addSchool`
   - Headers: `Content-Type: application/json`
   - Body (raw JSON):
   ```json
   {
     "name": "Delta School",
     "address": "4th Street",
     "latitude": 12.9716,
     "longitude": 77.5946
   }
   ```

3. **List Schools Request:**
   - Method: GET
   - URL: `https://college-53qo.onrender.com/listSchools?latitude=12.9716&longitude=77.5946`

## Common Issues and Solutions

### 400 Bad Request - Validation Error
If you get a validation error saying "name" and "address" are undefined:

1. **Check Content-Type header:** Make sure it's set to `application/json`
2. **Check request body:** Ensure the JSON is properly formatted
3. **Check for extra spaces:** Remove any trailing spaces in the JSON
4. **Try the local version:** Test with `http://localhost:3000/addSchool` first

### Database Connection Issues
If you get database-related errors on the deployed version:
- The deployed version may have database configuration issues
- Test locally first to verify the API works

## Expected Responses

### Successful Add School Response:
```json
{
  "id": 1,
  "name": "Delta School",
  "address": "4th Street",
  "latitude": 12.9716,
  "longitude": 77.5946
}
```

### Successful List Schools Response:
```json
{
  "items": [
    {
      "id": 1,
      "name": "Delta School",
      "address": "4th Street",
      "latitude": 12.9716,
      "longitude": 77.5946,
      "distanceKm": 0
    }
  ],
  "page": 1,
  "limit": 50,
  "total": 1
}
```
