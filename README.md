# po2mo

<p align="left">
  <a href="https://npm.im/po2mo">
    <img src="https://badgen.net/npm/v/po2mo">
  </a>

  <a href="https://github.com/devjiwonchoi/po2mo/actions?workflow=CI">
    <img src="https://github.com/devjiwonchoi/po2mo/actions/workflows/node_ci.yml/badge.svg">
  </a>
</p>

> Note: wildcard `*` is no longer supported in v1.5.0 and above. Please check the [migration guide](./migration.md).

## Usage

Create a `po2mo.json` file at the root of your project.

```bash
touch po2mo.json
```

Set a relative path from the root of your project to the input and expected output files.

```json
{
  "files": [
    {
      "input": "./locale/ko/messages.po",
    }
  ]
}
```

Run `po2mo` via [npx](https://docs.npmjs.com/cli/v10/commands/npx).

```bash
npx po2mo
```

This will generate a `.mo` file in the same directory as the input file.

```bash
./locale/ko/messages.mo
```

To convert all `.po` files within the directory, set the input path to the directory.

```json
{
  "files": [
    {
      "input": "./locale/ko"
    }
  ]
}

```

To convert all `.po` files recursively within the directory, set the `recursive` option to `true`.

```json
{
  "files": [
    {
      "input": "./locale",
      "recursive": true
    }
  ]
}
```
