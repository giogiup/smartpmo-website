# Save as: D:\PMO-Brain-2.0-Modular\website\deploy.ps1

param(
    [string]$msg = "deploy"
)

# Stage everything (CSS, HTML, images, etc.)
git add .

# Commit
git commit -m $msg

# Grab short SHA
$sha = (git rev-parse --short HEAD)

# Inject SHA into <link> tag
(Get-Content index.html) -replace 'styles-v2\.css\?v=[^"]*', "styles-v2.css?v=$sha" |
 Set-Content index.html

# Amend commit with updated HTML
git add index.html
git commit --amend --no-edit

# Push
git push

Write-Host "✅ Deployed with cache-bust: v=$sha" -ForegroundColor Green