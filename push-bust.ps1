param(
    [string]$msg = "deploy"
)

# Stage and commit everything
git add .
git commit -m $msg

# Get short SHA
$sha = (git rev-parse --short HEAD)

# ── B-75: Concatenate CSS into single bundle ──
$cssFiles = @(
    'styles-core.css',
    'styles-v2.css',
    'hero.css',
    'header-styles.css',
    'section-cards.css',
    'section-votes.css',
    'mobile-fixes.css'
)

$bundle = ""
foreach ($css in $cssFiles) {
    if (Test-Path $css) {
        $bundle += "/* === $css === */`n"
        $bundle += (Get-Content $css -Raw -Encoding UTF8)
        $bundle += "`n"
    } else {
        Write-Warning "Missing CSS file: $css"
    }
}
$bundle | Set-Content smartpmo-bundle.css -Encoding UTF8
Write-Host "CSS bundle created: smartpmo-bundle.css ($($cssFiles.Count) files)"

# ── B-78: Minify CSS bundle ──
Write-Host "Minifying smartpmo-bundle.css..."
npx --yes csso-cli smartpmo-bundle.css --output smartpmo-bundle.css
if ($LASTEXITCODE -eq 0) {
    Write-Host "CSS minified successfully"
} else {
    Write-Warning "CSS minification failed - deploying unminified bundle"
}

# ── Cache-bust the bundle in index.html ──
$html = Get-Content index.html -Raw -Encoding UTF8
$html = $html -replace 'href="[^"]*smartpmo-bundle\.css[^"]*"', ('href="smartpmo-bundle.css?v=' + $sha + '"')
$html | Set-Content index.html -Encoding UTF8

# Amend commit with updated bundle + index.html
git add smartpmo-bundle.css index.html
git commit --amend --no-edit

# Push
git push
