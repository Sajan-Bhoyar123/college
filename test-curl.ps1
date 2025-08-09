Write-Host "Testing School Management API endpoints..." -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green

# Test JSON parsing endpoint
Write-Host "1. Testing JSON parsing endpoint..." -ForegroundColor Yellow
$testJsonBody = @{
    test = "data"
    number = 123
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://college-53qo.onrender.com/test-json" -Method POST -Body $testJsonBody -ContentType "application/json"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test Add School endpoint
Write-Host "`n2. Testing Add School endpoint..." -ForegroundColor Yellow
$addSchoolBody = @{
    name = "Test School via PowerShell"
    address = "Test Address via PowerShell"
    latitude = 12.9716
    longitude = 77.5946
} | ConvertTo-Json

try {
    $response = Invoke-RestMethod -Uri "https://college-53qo.onrender.com/addSchool" -Method POST -Body $addSchoolBody -ContentType "application/json"
    Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

# Test List Schools endpoint
Write-Host "`n3. Testing List Schools endpoint..." -ForegroundColor Yellow
try {
    $response = Invoke-RestMethod -Uri "https://college-53qo.onrender.com/listSchools?latitude=12.9716&longitude=77.5946" -Method GET
    Write-Host "Response: $($response | ConvertTo-Json -Depth 10)" -ForegroundColor Green
} catch {
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Red
}

Write-Host "`nTesting completed!" -ForegroundColor Green
