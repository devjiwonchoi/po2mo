#!/usr/bin/env pwsh

# Stop executing script on any error
$ErrorActionPreference = 'Stop'
# Do not show download progress
$ProgressPreference = 'SilentlyContinue'

# Taken from https://stackoverflow.com/a/34559554/6537420
function New-TemporaryDirectory {
  $parent = [System.IO.Path]::GetTempPath()
  [string] $name = [System.Guid]::NewGuid()
  New-Item -ItemType Directory -Path (Join-Path $parent $name)
}

$platform = $null
# $architecture = $null
$po2moName = $null

# PowerShell versions before 6.* were only for Windows OS
if ($PSVersionTable.PSVersion.Major -eq 5) {
  $platform = 'win'
}

if ($PSVersionTable.PSVersion.Major -ge 6) {
  if ($PSVersionTable.Platform -eq 'Unix') {
    if ($PSVersionTable.OS -like 'Darwin*') {
      $platform = 'macos'
    }

    if ($PSVersionTable.OS -like 'Linux*') {
      $platform = 'linux'
    }

    # PowerShell does not seem to have normal cmdlets for retrieving system information, so we use UNAME(1) for this.
    # $arch = uname -m
    # switch -Wildcard ($arch) {
    #   'x86_64' { $architecture = 'x64'; Break }
    #   'amd64' { $architecture = 'x64'; Break }
    #   'armv*' { $architecture = 'arm'; Break }
    #   'arm64' { $architecture = 'arm64'; Break }
    #   'aarch64' { $architecture = 'arm64'; Break }
    # }

    # 'uname -m' in some cases mis-reports 32-bit OS as 64-bit, so double check
    # if ([System.Environment]::Is64BitOperatingSystem -eq $false) {
    #   if ($architecture -eq 'x64') {
    #     $architecture = 'i686'
    #   }

    #   if ($architecture -eq 'arm64') {
    #     $architecture = 'arm'
    #   }
    # }

    $po2moName = "po2mo"
  }

  if ($PSVersionTable.Platform -eq 'Win32NT') {
    $platform = 'win'
  }
}

if ($platform -eq 'win') {
  # if ([System.Environment]::Is64BitOperatingSystem -eq $true) {
  #   $architecture = 'x64'
  # }

  # if ([System.Environment]::Is64BitOperatingSystem -eq $false) {
  #   $architecture = 'i686'
  # }

  $po2moName = "po2mo.exe"
}

if ($null -eq $platform) {
  Write-Error "Platform could not be determined! Only Windows, Linux and MacOS are supported."
}

# switch ($architecture) {
#   'x64' { ; Break }
#   'arm64' { ; Break }
#   Default {
#     Write-Error "Sorry! po2mo currently only provides pre-built binaries for x86_64/arm64 architectures."
#   }
# }

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

$versionJson = Invoke-RestMethod -Uri "https://raw.githubusercontent.com/devjiwonchoi/po2mo/main/package.json"
$version = $versionJson.version

$preferredVersion = $null

if ($null -ne $env:po2mo_VERSION -and $env:po2mo_VERSION -ne "") {
  $preferredVersion = $env:po2mo_VERSION
}

if ($null -ne $preferredVersion) {
  $version = $preferredVersion
}

Write-Host "==> " -NoNewline -ForegroundColor Blue
Write-Host "Downloading po2mo binaries v$version" -ForegroundColor White

$po2moHome = $HOME + "/.po2mo"
$po2moFile = (Join-Path $po2moHome $po2moName)
$archiveUrl="https://github.com/devjiwonchoi/po2mo/releases/download/v$version/po2mo-$platform"
if ($platform -eq 'win') {
  $archiveUrl="$archiveUrl.exe"
}

Invoke-WebRequest $archiveUrl -OutFile $po2moFile -UseBasicParsing

if ($platform -ne 'win') {
  chmod +x $po2moFile
}

if ($platform -eq 'win') {
  $envPath = [System.Environment]::GetEnvironmentVariable("Path", "User")
  $envPath += ";$po2moHome"
  [System.Environment]::SetEnvironmentVariable("Path", $envPath, "User")
}

Start-Process -FilePath $po2moFile -ArgumentList "-h" -NoNewWindow -Wait -ErrorAction Continue

Write-Host "Thank you for downloading po2mo!" -ForegroundColor Blue
