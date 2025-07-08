# Test Production API Script

# Set JWT Secret
$env:JWT_SECRET = "c13dc78e31b861b8020265d7472c4388e6f247b8fe36afabb19d11f314c8226ef035019979c5dbeb91ac430bd9a23f7f02f2f8fdc60dbaf67f8428f0ca924d60"

# Generate JWT Token
Write-Host "Generating JWT token..." -ForegroundColor Green
$jwtToken = node scripts/generate-production-jwt.js

Write-Host "`nYour JWT Token:" -ForegroundColor Yellow
Write-Host $jwtToken

# Test availability endpoint
Write-Host "`n📅 Testing Get Availability..." -ForegroundColor Cyan
$headers = @{
    "Authorization" = "Bearer $jwtToken"
}

try {
    $response = Invoke-RestMethod -Uri "https://chattyai-calendar-bot-1.onrender.com/get-availability" -Headers $headers -Method Get
    Write-Host "✅ Success! Available slots:" -ForegroundColor Green
    $response.slots | ConvertTo-Json -Depth 10
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

# Test booking endpoint
Write-Host "`n📝 Testing Book Appointment..." -ForegroundColor Cyan
$bookingHeaders = @{
    "Authorization" = "Bearer $jwtToken"
    "Content-Type" = "application/json"
}

$bookingBody = @{
    start = "2025-07-10T15:00:00Z"
    end = "2025-07-10T15:30:00Z"
    summary = "Production test from ChattyAI"
} | ConvertTo-Json

try {
    $bookResponse = Invoke-RestMethod -Uri "https://chattyai-calendar-bot-1.onrender.com/book-appointment" -Method Post -Headers $bookingHeaders -Body $bookingBody
    Write-Host "✅ Success! Appointment booked:" -ForegroundColor Green
    $bookResponse | ConvertTo-Json
} catch {
    Write-Host "❌ Error: $_" -ForegroundColor Red
}

Write-Host "`n🎉 Testing complete!" -ForegroundColor Green 