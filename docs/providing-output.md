# Providing Output

> :bulb: Tip: input as directory, output as file won't work! :x:

Let's say we have a folder tree like this:

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
po2mo ./locale/a.po --output ./locale/a-converted.mo
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
po2mo ./locale --output ./output
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
po2mo ./locale --output ./output --recursive
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
