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
$architecture = $null
$pnpmName = $null

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
    $arch = uname -m
    switch -Wildcard ($arch) {
      'x86_64' { $architecture = 'x64'; Break }
      'amd64' { $architecture = 'x64'; Break }
      'armv*' { $architecture = 'arm'; Break }
      'arm64' { $architecture = 'arm64'; Break }
      'aarch64' { $architecture = 'arm64'; Break }
    }

    # 'uname -m' in some cases mis-reports 32-bit OS as 64-bit, so double check
    if ([System.Environment]::Is64BitOperatingSystem -eq $false) {
      if ($architecture -eq 'x64') {
        $architecture = 'i686'
      }

      if ($architecture -eq 'arm64') {
        $architecture = 'arm'
      }
    }

    $pnpmName = "pnpm"
  }

  if ($PSVersionTable.Platform -eq 'Win32NT') {
    $platform = 'win'
  }
}

if ($platform -eq 'win') {
  if ([System.Environment]::Is64BitOperatingSystem -eq $true) {
    $architecture = 'x64'
  }

  if ([System.Environment]::Is64BitOperatingSystem -eq $false) {
    $architecture = 'i686'
  }

  $pnpmName = "pnpm.exe"
}

if ($null -eq $platform) {
  Write-Error "Platform could not be determined! Only Windows, Linux and MacOS are supported."
}

switch ($architecture) {
  'x64' { ; Break }
  'arm64' { ; Break }
  Default {
    Write-Error "Sorry! pnpm currently only provides pre-built binaries for x86_64/arm64 architectures."
  }
}

[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# $pkgInfo = Invoke-WebRequest "https://raw.githubusercontent.com/devjiwonchoi/po2mo/main/package.json" -UseBasicParsing
# $versionJson = $pkgInfo.Content | ConvertFrom-Json
# $versions = Get-Member -InputObject $versionJson.versions -Type NoteProperty | Select-Object -ExpandProperty Name
# $distTags = Get-Member -InputObject $versionJson.'dist-tags' -Type NoteProperty | Select-Object -ExpandProperty Name

# $version = $null
# $preferredVersion = "latest"

# if ($null -ne $env:PNPM_VERSION -and $env:PNPM_VERSION -ne "") {
#   $preferredVersion = $env:PNPM_VERSION
# }

# if ($null -eq $version -and $preferredVersion -in $distTags) {
#   $version = $versionJson.'dist-tags' | Select-Object -ExpandProperty $preferredVersion
# }

# if ($null -eq $version -and $preferredVersion -in $versions) {
#   $version = $preferredVersion
# }

# if ($null -eq $version) {
#   Write-Host "Current tags:" -ForegroundColor Yellow -NoNewline
#   $versionJson.'dist-tags' | Format-List

#   Write-Host "Versions:" -ForegroundColor Yellow -NoNewline
#   $versionJson.versions | Get-Member -Type NoteProperty | Format-Wide -Property Name -AutoSize

#   Write-Error "Sorry! pnpm '$preferredVersion' version could not be found. Use one of the tags or published versions from the provided list"
# }

Write-Host "Downloading pnpm from GitHub...`n" -ForegroundColor Green

$po2mo_home = $HOME + "/.po2mo"
$tempFile = (Join-Path $po2mo_home $pnpmName)
$archiveUrl="https://github.com/devjiwonchoi/po2mo/releases/download/v1.7.0/po2mo-$platform"
if ($platform -eq 'win') {
  $archiveUrl="$archiveUrl.exe"
}
Invoke-WebRequest $archiveUrl -OutFile $tempFile -UseBasicParsing

Write-Host "Running setup...`n" -ForegroundColor Green

if ($platform -ne 'win') {
  chmod +x $tempFile
}

Start-Process -FilePath $tempFile -ArgumentList "-h" -NoNewWindow -Wait -ErrorAction Continue

Write-Host "Thank you for downloading po2mo!" -ForegroundColor Cyan