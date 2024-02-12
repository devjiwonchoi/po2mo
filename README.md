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

```sh
npx po2mo [options]
```

```sh
Options:
  -v, --version          output the version number
  -h, --help             output usage information
  -o, --output <path>    specify output path
  -r, --recursive        convert po files recursively
  --config <path>        specify config file path
  --cwd <cwd>            specify current working directory
```

## Providing an Input

Let's say we have a folder tree like this:

```sh
.
└── locale/
    ├── a.po
    ├── b.po
    └── c.po
```

By providing the input `a.po` file:

```sh
npx po2mo ./locale/a.po
```

This will create an `a.mo` file on the same level of the `a.po` file we targeted.

```sh
.
└── locale/
    ├── a.po
    ├── a.mo <-- new!
    ├── b.po
    └── c.po
```

If we provided the input as the `locale` directory itself:

```sh
npx po2mo ./locale
```

```sh
.
└── locale/
    ├── a.po
    ├── a.mo <-- new!
    ├── b.po
    ├── b.mo <-- new!
    ├── c.po
    └── c.mo <-- new!
```

What if we had a nested directory inside the `locale` like:

```sh
.
└── locale/
    ├── nested/
    │   ├── aa.po
    │   ├── bb.po
    │   └── cc.po
    ├── a.po
    ├── b.po
    └── c.po
```

We can also target them as well by providing the `--recursive` (or `-r` alias) option.

```sh
npx po2mo ./locale --recursive
```

> Won't provide a folder tree.. You know how it goes ;)

## Providing an Output

> :bulb: Tip: input as directory, output as file won't work! :x:

Again, let's bring back the folder tree from the above:

```sh
.
└── locale/
    ├── a.po
    ├── b.po
    └── c.po
```

We can specify the output path with the `--output` (or `-o` alias) option.

By providing the output to a filename `a-converted.mo`:

```sh
npx po2mo ./locale/a.po --output ./locale/a-converted.mo
```

We can set the output filename as well:

```sh
.
└── locale/
    ├── a.po
    ├── a-converted.mo <-- new!
    ├── b.po
    └── c.po
```

What if we want the outputs to be in the `output` directory?

```sh
npx po2mo ./locale --output ./output
```

This will ensure the converted `.mo` files stored in the `output` directory:

```sh
.
├── locale/
│   ├── a.po
│   ├── b.po
│   └── c.po
└── output/  <-- new!
    ├── a.mo <-- new!
    ├── b.mo <-- new!
    └── c.mo <-- new!
```

What about the `--recursive` option for the nested folders?

```sh
.
└── locale/
    ├── nested/
    │   ├── aa.po
    │   ├── bb.po
    │   └── cc.po
    ├── a.po
    ├── b.po
    └── c.po
```

No worries, we preserve the folder structure of the nested `.po` files!

```sh
npx po2mo ./locale --output ./output --recursive
```

```sh
.
├── locale/
│   ├── nested/
│   │   ├── aa.po
│   │   ├── bb.po
│   │   └── cc.po
│   ├── a.po
│   ├── b.po
│   └── c.po
└── output/       <-- new!
    ├── nested/   <-- new!
    │   ├── aa.mo <-- new!
    │   ├── bb.mo <-- new!
    │   └── cc.mo <-- new!
    ├── a.mo      <-- new!
    ├── b.mo      <-- new!
    └── c.mo      <-- new!
```

## Current Working Directory (`--cwd`)

Sometimes you need to specify the current working directory. Send it!

## Conventions

### `locale` directory

If no input was provided, `po2mo` looks up for the `locale` directory on the current working directory (`cwd`), and convert all `.po` files recursively within the `locale` directory.

### `po2mo.json`

We recommend you to be config-free, but most of the time there are edge cases where you need a work-around.

`po2mo` supports configuration for multiple tasks by providing the path to config with the option `--config`.

Each objects inside the `tasks` array are equal to a single conversion task, which takes the three values: `input`, `output`, `recursive`.

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
