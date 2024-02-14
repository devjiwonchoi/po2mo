#!/bin/sh

# From https://github.com/Homebrew/install/blob/master/install.sh
abort() {
  printf "%s\n" "$@"
  exit 1
}

# string formatters
if [ -t 1 ]; then
  tty_escape() { printf "\033[%sm" "$1"; }
else
  tty_escape() { :; }
fi
tty_mkbold() { tty_escape "1;$1"; }
tty_blue="$(tty_mkbold 34)"
tty_bold="$(tty_mkbold 39)"
tty_reset="$(tty_escape 0)"

ohai() {
  printf "${tty_blue}==>${tty_bold} %s${tty_reset}\n" "$1"
}

# End from https://github.com/Homebrew/install/blob/master/install.sh

download() {
  if command -v curl >/dev/null 2>&1; then
    curl -fsSL "$1"
  else
    wget -qO- "$1"
  fi
}

is_glibc_compatible() {
  getconf GNU_LIBC_VERSION >/dev/null 2>&1 || ldd --version >/dev/null 2>&1 || return 1
}

detect_platform() {
  local platform
  platform="$(uname -s | tr '[:upper:]' '[:lower:]')"

  case "${platform}" in
  linux)
    if is_glibc_compatible; then
      platform="linux"
    else
      platform="linuxstatic"
    fi
    ;;
  darwin) platform="macos" ;;
  windows) platform="win" ;;
  esac

  printf '%s' "${platform}"
}

detect_arch() {
  local arch
  arch="$(uname -m | tr '[:upper:]' '[:lower:]')"

  case "${arch}" in
  x86_64 | amd64) arch="x64" ;;
  armv*) arch="arm" ;;
  arm64 | aarch64) arch="arm64" ;;
  esac

  # `uname -m` in some cases mis-reports 32-bit OS as 64-bit, so double check
  if [ "${arch}" = "x64" ] && [ "$(getconf LONG_BIT)" -eq 32 ]; then
    arch=i686
  elif [ "${arch}" = "arm64" ] && [ "$(getconf LONG_BIT)" -eq 32 ]; then
    arch=arm
  fi

  case "$arch" in
  x64*) ;;
  arm64*) ;;
  *) return 1 ;;
  esac
  printf '%s' "${arch}"
}

download_and_install() {
  local platform arch version_json version archive_url po2mo_home
  platform="$(detect_platform)"
  # arch="$(detect_arch)" || abort "Sorry! po2mo currently only provides pre-built binaries for x86_64/arm64 architectures."
  if [ -z "${PO2MO_VERSION}" ]; then
    version_json="$(download "https://raw.githubusercontent.com/devjiwonchoi/po2mo/main/package.json")" || abort "Download Error!"
    version="$(printf '%s' "${version_json}" | tr '{' '\n' | awk -F '"' '/version/ { print $4 }')"
  else
    version="${PO2MO_VERSION}"
  fi

  archive_url="https://github.com/devjiwonchoi/po2mo/releases/download/v${version}/po2mo-${platform}"
  if [ "${platform}" = "win" ]; then
    archive_url="${archive_url}.exe"
  fi

  # install to PO2MO_HOME, defaulting to ~/.po2mo
  po2mo_home="$HOME/.po2mo"
  mkdir -p "$po2mo_home" || abort "Mkdir Error!"
  trap 'rm -rf "$po2mo_home"' EXIT INT TERM HUP

  ohai "Downloading po2mo binaries ${version}"
  # download the binary to the specified directory
  download "$archive_url" >"$po2mo_home/po2mo" || return 1
  chmod +x "$po2mo_home/po2mo"
  SHELL="$SHELL" "$po2mo_home/po2mo" -h || return 1

  printf "${tty_blue}Thank you for downloading po2mo!${tty_reset}\n"
}

download_and_install || abort "Install Error!"
