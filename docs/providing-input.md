# Providing Input

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
po2mo ./locale/a.po
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
po2mo ./locale
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
po2mo ./locale --recursive
```

> Won't provide a folder tree.. You know how it goes ;)
