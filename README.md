# po2mo

<p align="left">
  <a href="https://npm.im/po2mo">
    <img src="https://badgen.net/npm/v/po2mo">
  </a>

  <a href="https://github.com/devjiwonchoi/po2mo/actions?workflow=CI">
    <img src="https://github.com/devjiwonchoi/po2mo/actions/workflows/node_ci.yml/badge.svg">
  </a>
</p>

## Installation

```bash
// npm
npm i -D po2mo

// yarn
yarn add -D po2mo

//pnpm
pnpm add -D po2mo
```

### Executable

You can download the executable files from the [releases](https://github.com/devjiwonchoi/po2mo/releases) or directly from the [exec](https://github.com/devjiwonchoi/po2mo/tree/main/exec) directory.

## po2mo.json

Create a `po2mo.json` file at the root of your project.

```bash
touch po2mo.json
```

Set a relative path from the root of your project to the input and expected output files.

```json
{
  "files": [
    {
      "input": "./locale/ko/before.po",
      "output": "./locale/ko/after.mo"
    },
    {
      "input": "./locale/fr/before.po",
      "output": "./locale/fr/after.mo"
    }
  ]
}
```

### Wildcard

Using `/*` wildcard will match all `.po` files in the directory and convert to the equivalent filename.

```json
{
  "files": [
    {
      "input": "./locale/ko/*",
      "output": "./locale/ko/*"
    },
    {
      "input": "./locale/fr/*",
      "output": "./locale/fr/*"
    }
  ]
}
```

Using `/**/*` wildcard will recursively match all `.po` files within the directory and convert to the equivalent filename.

```json
{
  "files": [
    {
      "input": "./locale/**/*",
      "output": "./locale/**/*"
    }
  ]
}
```

## Usage

```bash
// npm
npm exec po2mo

// yarn
yarn po2mo

// pnpm
pnpm po2mo
```

### Executables

```bash
./po2mo-<platform>

// Mac
./po2mo-macos

// Windows
./po2mo-win.exe

// Linux
./po2mo-linux
```
