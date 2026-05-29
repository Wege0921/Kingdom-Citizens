# Setup Google OAuth in Supabase via Management API
# Requires: SUPABASE_ACCESS_TOKEN and SUPABASE_PROJECT_REF env vars
# And: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET from Google Cloud Console

$ErrorActionPreference = "Stop"

$accessToken = $env:SUPABASE_ACCESS_TOKEN
$projectRef = $env:SUPABASE_PROJECT_REF
$googleClientId = $env:GOOGLE_CLIENT_ID
$googleClientSecret = $env:GOOGLE_CLIENT_SECRET

if (-not $accessToken) {
    Write-Host "ERROR: Set SUPABASE_ACCESS_TOKEN environment variable" -ForegroundColor Red
    Write-Host "Get it from: https://supabase.com/dashboard/account/tokens" -ForegroundColor Yellow
    exit 1
}

if (-not $projectRef) {
    Write-Host "ERROR: Set SUPABASE_PROJECT_REF environment variable" -ForegroundColor Red
    Write-Host "Find it in your Supabase dashboard URL: https://supabase.com/dashboard/project/<PROJECT_REF>" -ForegroundColor Yellow
    exit 1
}

if (-not $googleClientId -or -not $googleClientSecret) {
    Write-Host "ERROR: Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables" -ForegroundColor Red
    Write-Host "Get them from: https://console.cloud.google.com/apis/credentials" -ForegroundColor Yellow
    exit 1
}

$headers = @{
    "Authorization" = "Bearer $accessToken"
    "Content-Type"  = "application/json"
}

Write-Host "Enabling Google OAuth provider..." -ForegroundColor Cyan

try {
    $response = Invoke-RestMethod `
        -Uri "https://api.supabase.com/v1/projects/$projectRef/config/auth" `
        -Method GET `
        -Headers $headers

    # Update the external provider config
    $providers = $response.external_providers
    $providers.google = @{
        enabled = $true
        client_id = $googleClientId
        secret = $googleClientSecret
    }

    $updateBody = @{
        external_providers = $providers
    } | ConvertTo-Json -Depth 5

    Invoke-RestMethod `
        -Uri "https://api.supabase.com/v1/projects/$projectRef/config/auth" `
        -Method PATCH `
        -Headers $headers `
        -Body $updateBody | Out-Null

    Write-Host "Google OAuth enabled successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Go to Supabase Dashboard > Authentication > URL Configuration" -ForegroundColor White
    Write-Host "2. Add these redirect URLs:" -ForegroundColor White
    Write-Host "   - http://localhost:3000/auth/callback" -ForegroundColor Yellow
    Write-Host "   - https://your-production-domain.com/auth/callback" -ForegroundColor Yellow
    Write-Host "3. In Google Cloud Console, add the same URLs to Authorized redirect URIs" -ForegroundColor White

} catch {
    Write-Host "ERROR: $($_.Exception.Message)" -ForegroundColor Red
    if ($_.Exception.Response) {
        $reader = New-Object System.IO.StreamReader($_.Exception.Response.GetResponseStream())
        $reader.BaseStream.Position = 0
        $reader.DiscardBufferedData()
        $body = $reader.ReadToEnd()
        Write-Host "Response: $body" -ForegroundColor Red
    }
    exit 1
}
