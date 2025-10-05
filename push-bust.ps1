param(
    [string]$msg = "deploy"
)

# stage everything (CSS, HTML, images, etc.)
git add .

# commit
git commit -m $msg

# grab short SHA
$sha = (git rev-parse --short HEAD)

# inject SHA into <link> tag
(Get-Content index.html) -replace 'styles-v2\.css\?v=[^"]*', "styles-v2.css?v=$sha" |
 Set-Content index.html

# amend commit with updated HTML
git add index.html
git commit --amend --no-edit

# push
git push