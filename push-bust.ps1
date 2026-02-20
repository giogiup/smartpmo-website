param(
    [string]$msg = "deploy"
)

# stage everything
git add .

# commit
git commit -m $msg

# grab short SHA
$sha = (git rev-parse --short HEAD)

# bust ALL css file references (with or without existing ?v= param)
$html = Get-Content index.html -Raw
$cssFiles = @('styles-v2.css', 'hero.css', 'header-styles.css', 'assessment-flow.css', 'section-votes.css', 'mobile-fixes.css')
foreach ($css in $cssFiles) {
    $escaped = [regex]::Escape($css)
    $html = $html -replace "${escaped}\?v=[^""]*", "$css?v=$sha"
    $html = $html -replace "${escaped}(?!\?v=)", "$css?v=$sha"
}
$html | Set-Content index.html

# amend commit with updated HTML
git add index.html
git commit --amend --no-edit

# push
git push
