# Script to capture high-resolution screenshots for client manual
$chrome = "C:\Program Files\Google\Chrome\Application\chrome.exe"
$outDir = "C:\Users\Acer\coding\Noor_journey\docs\screenshots"

$routes = @(
    @{ Name = "01_home"; Url = "http://localhost:8080/" },
    @{ Name = "02_journey"; Url = "http://localhost:8080/journey" },
    @{ Name = "03_curriculum"; Url = "http://localhost:8080/curriculum" },
    @{ Name = "04_tajweed"; Url = "http://localhost:8080/tajweed" },
    @{ Name = "05_games"; Url = "http://localhost:8080/games" },
    @{ Name = "06_collection"; Url = "http://localhost:8080/collection" },
    @{ Name = "07_practice"; Url = "http://localhost:8080/practice" },
    @{ Name = "08_leaderboard"; Url = "http://localhost:8080/leaderboard" },
    @{ Name = "09_parent"; Url = "http://localhost:8080/parent" },
    @{ Name = "10_admin"; Url = "http://localhost:8080/admin" }
)

foreach ($r in $routes) {
    $outFile = Join-Path $outDir "$($r.Name).png"
    Write-Host "Capturing $($r.Name) from $($r.Url)..."
    Start-Process $chrome -ArgumentList "--headless=new", "--window-size=1280,850", "--hide-scrollbars", "--virtual-time-budget=3000", "--screenshot=$outFile", $r.Url -Wait
}

Write-Host "All screenshots captured successfully!"
Get-ChildItem -Path $outDir -Filter "*.png" | Select-Object Name, Length
