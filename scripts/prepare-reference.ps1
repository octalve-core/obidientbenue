# Build a small reference-source archive without dependencies, secrets or build output.
param(
    [Parameter(Mandatory=$true)][string]$ProjectPath,
    [string]$OutputPath = "$HOME\Desktop\IAMimpact-reference-source.zip"
)
$ErrorActionPreference = 'Stop'
$root = (Resolve-Path -LiteralPath $ProjectPath).Path
if (Test-Path -LiteralPath $OutputPath) { Remove-Item -LiteralPath $OutputPath -Force }
$allowed = @('app','components','content','features','lib','docs','prisma','public','tests','package.json','pnpm-lock.yaml','pnpm-workspace.yaml','next.config.ts','postcss.config.mjs','tsconfig.json','eslint.config.mjs','.gitignore','.env.example','README.md')
$temp = Join-Path $env:TEMP ('IAMimpact-export-' + [guid]::NewGuid().ToString('N'))
New-Item -Type Directory -Path $temp | Out-Null
try {
  foreach ($entry in $allowed) {
    $src = Join-Path $root $entry
    if (Test-Path -LiteralPath $src) { Copy-Item -LiteralPath $src -Destination $temp -Recurse -Force }
  }
  Get-ChildItem -LiteralPath $temp -Recurse -File -Force | Where-Object {
    $_.Name -match '(^\.env(?!\.example)|\.pem$|\.key$|\.p12$|\.sqlite$|\.db$|\.log$)' -or $_.FullName -match '(\\|/)(node_modules|\.next|\.git|\.vercel|coverage|dist|build|\.turbo)(\\|/)'
  } | Remove-Item -Force
  Compress-Archive -Path (Join-Path $temp '*') -DestinationPath $OutputPath -Force
  Write-Host "Archive created: $OutputPath"
} finally { Remove-Item -LiteralPath $temp -Recurse -Force -ErrorAction SilentlyContinue }
