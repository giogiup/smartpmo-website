param(
    [string]$msg = "deploy"
)

# Stage and commit everything
git add .
git commit -m $msg

# Get short SHA
$sha = (git rev-parse --short HEAD)

# Robust CSS cache-busting:
# Matches the ENTIRE href="..." value containing the css filename anywhere.
# Handles: bare filename, already-versioned, or any previously corrupted state.
$html = Get-Content index.html -Raw -Encoding UTF8

$cssFiles = @(
    'styles-v2.css',
    'hero.css',
    'header-styles.css',
    'section-votes.css',
    'mobile-fixes.css'
)

foreach ($css in $cssFiles) {
    $escapedCss = [regex]::Escape($css)
    # Match href="...FILENAME..." (entire value) and replace wholesale
    $html = $html -replace ('href="[^"]*' + $escapedCss + '[^"]*"'), ('href="' + $css + '?v=' + $sha + '"')
}

$html | Set-Content index.html -Encoding UTF8

# Amend commit with updated index.html
git add index.html
git commit --amend --no-edit

# Push
git push
