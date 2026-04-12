$ErrorActionPreference = "Stop"

function Convert-ToWslPath {
  param(
    [Parameter(Mandatory = $true)]
    [string]$WindowsPath
  )

  $resolvedPath = (Resolve-Path -LiteralPath $WindowsPath).Path

  if ($resolvedPath.Length -lt 3 -or $resolvedPath[1] -ne ":") {
    throw "Expected a drive-letter path, got: $resolvedPath"
  }

  $driveLetter = $resolvedPath.Substring(0, 1).ToLowerInvariant()
  $relativePath = $resolvedPath.Substring(2) -replace "\\", "/"

  return "/mnt/$driveLetter$relativePath"
}

$repoRoot = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "..\..")
$repoWslPath = Convert-ToWslPath -WindowsPath $repoRoot
$launcherScript = Resolve-Path -LiteralPath (Join-Path $PSScriptRoot "start-jekyll-wsl.sh")
$launcherScriptWslPath = Convert-ToWslPath -WindowsPath $launcherScript

Write-Host "Starting Jekyll in WSL from $repoWslPath"
& wsl.exe -e bash $launcherScriptWslPath $repoWslPath
exit $LASTEXITCODE
