# Installation

## Using a standalone script

### On Windows

```sh
iwr https://github.com/devjiwonchoi/po2mo/raw/main/scripts/install.ps1 -useb | iex
```

### On POSIX systems

```sh
curl -fsSL https://github.com/devjiwonchoi/po2mo/raw/main/scripts/install.sh | sh -
```

If you don't have `curl` installed, you would like to use `wget`:

```sh
wget -qO- https://github.com/devjiwonchoi/po2mo/raw/main/scripts/install.sh | sh -
```

### Installing a specific version

Prior to running the install script, you may optionally set an env variable PO2MO_VERSION to install a specific version of po2mo:

```sh
curl -fsSL https://github.com/devjiwonchoi/po2mo/raw/main/scripts/install.sh | env PO2MO_VERSION=<version> sh -
```

## Using Node.js Package Managers

### npx

```sh
npx po2mo@latest
```

### npm

```sh
npm i -g po2mo
```

### yarn

```sh
yarn global add po2mo
```

### pnpm

```sh
pnpm i -g po2mo
```
