# po2mo

<p align="left">
  <a href="https://npm.im/po2mo">
    <img src="https://badgen.net/npm/v/po2mo">
  </a>

  <a href="https://github.com/devjiwonchoi/po2mo/actions?workflow=CI">
    <img src="https://github.com/devjiwonchoi/po2mo/actions/workflows/node_ci.yml/badge.svg">
  </a>
</p>

**This project is rapidly developed for stable version 2. Please be aware of the breaking changes.**

> Please checkout the [v2 backlog](https://github.com/devjiwonchoi/po2mo/issues/37)

:kr: [한국어 문서](./docs/korean/README.md)도 지원합니다!

---

## Installation

See [Installation](./docs/installation.md) for details.

## Default Behavior

By default, `po2mo` **will convert any created, modified, or staged .po files found in the local Git repository**.

You can change the current working directory with the [`--cwd`](#current-working-directory---cwd) option.

```sh
Usage: po2mo [options]

Options:
  <path>                 specify input path
  -v, --version          output the version number
  -h, --help             output usage information
  -o, --output <path>    specify output path
  -r, --recursive        convert po files recursively
  --config <path>        specify config file path
  --cwd <cwd>            specify current working directory
```

## Providing Input (`<path>`)

See [Providing Input](./docs/providing-input.md) for details.

## Providing Output (`--output`)

See [Providing Output](./docs/providing-output.md) for details.

## Current Working Directory (`--cwd`)

Sometimes you need to specify the current working directory. Send it!

## Configuration (`--config`)

We recommend you to be config-free, but most of the time there are edge cases where you need a work-around.

`po2mo` supports configuration for multiple tasks by providing the path to config file named `po2mo.json` with the option `--config`.

Each objects inside the `tasks` array are equal to a single conversion task, which takes the three values: `input`, `output`, `recursive`.

### `po2mo.json`

```json
{
  "tasks": [
    {
      "input": "./locale/a.po"
    },
    {
      "input": "./locale",
      "output": "./output"
    },
    {
      "input": "./locale",
      "output": "./output",
      "recursive": true,
    }
  ]
}
```
