# Migration Guide

## From 0.0.0 ~ 1.4.0

### Wildcard (deprecated)

Previously, you could use `*` wildcard to match all `.po` files within the directory and convert to the equivalent filename.

```json
{
  "files": [
    {
      "input": "./locale/ko/*",
      "output": "./locale/ko/*"
    }
  ]
}
```

Also, you could use `**` wildcard to match all `.po` files recursively within the directory and convert to the equivalent filename.

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

### New

Now, the entry to the directory automatically matches all `.po` files within the directory and convert to the equivalent filename. Not requiring the output path also.

```json
{
  "files": [
    {
      "input": "./locale/ko"
    }
  ]
}

```

For recursive matching, you can use the `recursive` option.

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
