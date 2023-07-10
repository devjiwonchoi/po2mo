# po2mo

Inspired by [po2mo.net](https://po2mo.net/), props to [Sam Hauglustaine](https://github.com/smhg) for creating an awesome module, [gettext-parser](https://github.com/smhg/gettext-parser).

## Installation

### npm

```bash
npm install --save-dev po2mo
```

### yarn

```bash
yarn add -D po2mo
```

### pnpm

```bash
pnpm add -D po2mo
```

### executables

Download the executable file from the [exec](https://github.com/devjiwonchoi/po2mo/tree/main/exec) directory.

```bash
/exec/po2mo-<platform>
```

## Config

Create a `po2mo.json` file at the root of your project.

```bash
touch po2mo.json
```

Set a relative path from the root of your project to the input and output files.

By default, po2mo will convert every `.po` files under the directory to same filename.

```json
{
  "files": [
    {
      "input": "Locale/kr",
      "output": "Locale/kr"
    },
    {
      "input": "Locale/fr",
      "output": "Locale/fr"
    }
  ]
}
```

You can specify the input and output files.

```json
{
  "files": [
    {
      "input": "Locale/kr/before.po",
      "output": "Locale/kr/after.mo"
    },
    {
      "input": "Locale/fr/before.po",
      "output": "Locale/fr/after.mo"
    }
  ]
}
```

## Usage

### npm

```bash
npm run po2mo
```

### yarn

```bash
yarn po2mo
```

### pnpm

```bash
pnpm po2mo
```

### executables

```bash
./po2mo-<platform>
```
