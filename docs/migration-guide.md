# Migration Guide

> This guide targets migration of the `po2mo.json` configuration to the latest version.

## `v1.4.0` and below

Breaking Changes:

- [Renamed Entry `files` to `tasks`](#renamed-entry-files-to-tasks)
- [Deprecated Wildcard `*`](#deprecated-wildcard-)

### Renamed Entry `files` to `tasks`

#### Before

```json
{
  "files": [
    {
      "input": "./input.po",
      "output": "./output.mo"
    }
  ]
}
```

#### After

```json
{
  "tasks": [
    {
      "input": "./input.po",
      "output": "./output.mo"
    }
  ]
}
```

### Deprecated Wildcard `*`

Drop the `*` wildcard to match all PO files inside a directory.

#### Before

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

#### After

```json
{
  "tasks": [
    {
      "input": "./locale/ko"
    }
  ]
}
```

Set `recursive` to `true` to match all PO files recursively.

#### Before

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

#### After

```json
{
  "tasks": [
    {
      "input": "./locale",
      "recursive": true
    }
  ]
}
```
