# Installs the ToSnip terminal helper from this site.
# Run from PowerShell: irm https://tosnip.com/install.ps1 | iex
$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'
if ($PSVersionTable.PSVersion.Major -lt 5) { throw 'PowerShell 5.1 or newer is required' }
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

$origin = 'https://tosnip.com'
$dir = Join-Path $env:LOCALAPPDATA 'ToSnip'
New-Item -ItemType Directory -Force -Path $dir | Out-Null
$dest = Join-Path $dir 'tosnip-paste.ps1'
$tmp = $dest + '.download'

Invoke-WebRequest -UseBasicParsing -Uri ($origin + '/tosnip-paste.ps1') -OutFile $tmp
$raw = Get-Content -LiteralPath $tmp -Raw -Encoding UTF8
if ($raw -notlike '*namespace ToSnip*') {
  Remove-Item -LiteralPath $tmp -Force
  throw 'download was not the ToSnip helper'
}
Move-Item -LiteralPath $tmp -Destination $dest -Force

$drive = $env:SystemDrive
if (-not $drive) { $drive = 'C:' }
$store = $drive + '\ToSnip'
try {
  New-Item -ItemType Directory -Force -Path $store | Out-Null
  $marker = Join-Path $store 'tosnip.txt'
  if (-not (Test-Path -LiteralPath $marker)) {
    Set-Content -LiteralPath $marker -Value 'tosnip' -Encoding ASCII
  }
} catch {
  try {
    $store = Join-Path $env:LOCALAPPDATA 'ToSnip\images'
    New-Item -ItemType Directory -Force -Path $store | Out-Null
    $marker = Join-Path $store 'tosnip.txt'
    if (-not (Test-Path -LiteralPath $marker)) {
      Set-Content -LiteralPath $marker -Value 'tosnip' -Encoding ASCII
    }
  } catch {}
}

Get-CimInstance Win32_Process -Filter "Name = 'powershell.exe' OR Name = 'pwsh.exe'" | ForEach-Object {
  $line = $_.CommandLine
  if ($line -and ($line.IndexOf('\ToSnip\tosnip-paste.ps1') -ge 0 -or $line.IndexOf('\Spaceur\spaceur-paste.ps1') -ge 0)) {
    Stop-Process -Id $_.ProcessId -Force -ErrorAction SilentlyContinue
  }
}
Start-Sleep -Milliseconds 600

$exe = Join-Path $env:WINDIR 'System32\WindowsPowerShell\v1.0\powershell.exe'
$arguments = '-NoProfile -STA -WindowStyle Hidden -ExecutionPolicy Bypass -File "' + $dest + '"'
$startup = [Environment]::GetFolderPath('Startup')
$shell = New-Object -ComObject WScript.Shell
$shortcut = $shell.CreateShortcut((Join-Path $startup 'ToSnip paste.lnk'))
$shortcut.TargetPath = $exe
$shortcut.Arguments = $arguments
$shortcut.WorkingDirectory = $dir
$shortcut.WindowStyle = 7
$shortcut.Description = 'ToSnip paste'
$shortcut.Save()
$oldShortcut = Join-Path $startup 'Spaceur paste.lnk'
if (Test-Path -LiteralPath $oldShortcut) { Remove-Item -LiteralPath $oldShortcut -Force }

$command = '"' + $exe + '" ' + $arguments
$started = $false
try {
  $result = Invoke-CimMethod -ClassName Win32_Process -MethodName Create -Arguments @{
    CommandLine = $command
    CurrentDirectory = $dir
  }
  if ($result.ReturnValue -eq 0) { $started = $true }
} catch {}
if (-not $started) {
  $startInfo = New-Object System.Diagnostics.ProcessStartInfo
  $startInfo.FileName = $exe
  $startInfo.Arguments = $arguments
  $startInfo.WorkingDirectory = $dir
  $startInfo.UseShellExecute = $true
  $startInfo.WindowStyle = [System.Diagnostics.ProcessWindowStyle]::Hidden
  [System.Diagnostics.Process]::Start($startInfo) | Out-Null
}
Write-Output ([string]::Concat(
  [char]0x0E15, [char]0x0E34, [char]0x0E14, [char]0x0E15, [char]0x0E31, [char]0x0E49, [char]0x0E07, [char]0x0E41, [char]0x0E25, [char]0x0E49, [char]0x0E27,
  ' ',
  [char]0x0E08, [char]0x0E31, [char]0x0E1A, [char]0x0E20, [char]0x0E32, [char]0x0E1E, [char]0x0E41, [char]0x0E25, [char]0x0E49, [char]0x0E27, [char]0x0E01, [char]0x0E14,
  ' Ctrl+V ',
  [char]0x0E43, [char]0x0E19, ' CMD, PowerShell ',
  [char]0x0E2B, [char]0x0E23, [char]0x0E37, [char]0x0E2D, ' Windows Terminal'
))
