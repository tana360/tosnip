# Removes the ToSnip terminal helper from this PC.
# Run from PowerShell: irm https://tosnip.com/uninstall.ps1 | iex
$ErrorActionPreference = 'Stop'
if ($PSVersionTable.PSVersion.Major -lt 5) { throw 'PowerShell 5.1 or newer is required' }

$dir = Join-Path $env:LOCALAPPDATA 'ToSnip'
$oldDir = Join-Path $env:LOCALAPPDATA 'Spaceur'
Get-CimInstance Win32_Process | ForEach-Object {
  $name = $_.Name
  $line = $_.CommandLine
  if (($name -eq 'powershell.exe' -or $name -eq 'pwsh.exe') -and $line -and ($line.IndexOf('\ToSnip\tosnip-paste.ps1') -ge 0 -or $line.IndexOf('\Spaceur\spaceur-paste.ps1') -ge 0)) {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
}
Start-Sleep -Milliseconds 600

$startupDir = [Environment]::GetFolderPath('Startup')
foreach ($lnkName in @('ToSnip paste.lnk', 'Spaceur paste.lnk')) {
  $startup = Join-Path $startupDir $lnkName
  if (Test-Path -LiteralPath $startup) {
    Remove-Item -LiteralPath $startup -Force
  }
}
if (Test-Path -LiteralPath $dir) {
  Remove-Item -LiteralPath $dir -Recurse -Force
}
if (Test-Path -LiteralPath $oldDir) {
  Remove-Item -LiteralPath $oldDir -Recurse -Force
}

$drive = $env:SystemDrive
if (-not $drive) { $drive = 'C:' }
function Remove-MarkedPictures($store, $markName, $markValue) {
  $mark = Join-Path $store $markName
  if (-not (Test-Path -LiteralPath $mark)) { return }
  $text = Get-Content -LiteralPath $mark -Raw -ErrorAction SilentlyContinue
  if (-not ($text -and $text.Trim() -eq $markValue)) { return }
  Get-ChildItem -LiteralPath $store -Filter '*.jpg' -File | ForEach-Object {
    if ($_.Name -match '^[a-z0-9]{6}\.jpg$') {
      Remove-Item -LiteralPath $_.FullName -Force
    }
  }
  Remove-Item -LiteralPath $mark -Force
  $left = @(Get-ChildItem -LiteralPath $store -Force)
  if ($left.Length -eq 0) {
    Remove-Item -LiteralPath $store -Force
  }
}
Remove-MarkedPictures ($drive + '\ToSnip') 'tosnip.txt' 'tosnip'
Remove-MarkedPictures ($drive + '\Spaceur') 'spaceur.txt' 'spaceur'

Write-Output ([string]::Concat(
  [char]0x0E16, [char]0x0E2D, [char]0x0E19, [char]0x0E01, [char]0x0E32, [char]0x0E23, [char]0x0E15, [char]0x0E34, [char]0x0E14, [char]0x0E15, [char]0x0E31, [char]0x0E49, [char]0x0E07, [char]0x0E41, [char]0x0E25, [char]0x0E49, [char]0x0E27,
  ' ',
  [char]0x0E15, [char]0x0E31, [char]0x0E27, [char]0x0E0A, [char]0x0E48, [char]0x0E27, [char]0x0E22, [char]0x0E08, [char]0x0E30, [char]0x0E44, [char]0x0E21, [char]0x0E48, [char]0x0E40, [char]0x0E1B, [char]0x0E34, [char]0x0E14, [char]0x0E40, [char]0x0E2D, [char]0x0E07, [char]0x0E2D, [char]0x0E35, [char]0x0E01
))
