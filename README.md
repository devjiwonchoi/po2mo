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
npm i -D po2mo
```

### Executable

You can download the executable files from the [exec](https://github.com/devjiwonchoi/po2mo/tree/main/exec) directory.

## po2mo.json

Create a `po2mo.json` file at the root of your project.

```bash
touch po2mo.json
```

Set a relative path from the root of your project to the input and output files.

By default, po2mo will convert every `.po` files under the directory as the equivalent filename.

```json
{
  "files": [
    {
      "input": "./locale/ko",
      "output": "./locale/ko"
    },
    {
      "input": "./locale/fr",
      "output": "./locale/fr"
    }
  ]
}
```

You can specify the input and output files.

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

## Usage

```bash
npm run po2mo
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
