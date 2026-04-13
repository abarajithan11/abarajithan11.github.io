$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")

$candidatePaths = @(
  "C:\Ruby34-x64\bin\bundle.bat",
  "C:\Ruby34-x64\bin\bundle"
)

$bundleCommand = $null

foreach ($candidate in $candidatePaths) {
  if (Test-Path -LiteralPath $candidate) {
    $bundleCommand = $candidate
    break
  }
}

if (-not $bundleCommand) {
  $cmd = Get-Command bundle.bat -ErrorAction SilentlyContinue
  if ($cmd) {
    $bundleCommand = $cmd.Source
  }
}

if (-not $bundleCommand) {
  $cmd = Get-Command bundle -ErrorAction SilentlyContinue
  if ($cmd) {
    $bundleCommand = $cmd.Source
  }
}

if (-not $bundleCommand) {
  throw "Could not find bundle or bundle.bat. Install RubyInstaller with DevKit, then reopen VS Code."
}

Set-Location -LiteralPath $repoRoot
$rubyBin = Split-Path -Parent $bundleCommand

if (-not ($env:Path -split ";" | Where-Object { $_ -eq $rubyBin })) {
  $env:Path = "$rubyBin;$env:Path"
}

Write-Host "Starting Jekyll with $bundleCommand"
& $bundleCommand exec jekyll serve --livereload --force_polling --host localhost --port 4000
exit $LASTEXITCODE
