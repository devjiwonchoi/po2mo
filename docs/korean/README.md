# po2mo

<p align="left">
  <a href="https://npm.im/po2mo">
    <img src="https://badgen.net/npm/v/po2mo">
  </a>

  <a href="https://github.com/devjiwonchoi/po2mo/actions?workflow=CI">
    <img src="https://github.com/devjiwonchoi/po2mo/actions/workflows/node_ci.yml/badge.svg">
  </a>
</p>

**이 프로젝트는 안정적인 버전 2를 위해 빠르게 개발되고 있습니다. 변경되는 사항에 유의하시기 바랍니다.**

> [v2 백로그](https://github.com/devjiwonchoi/po2mo/issues/37)를 확인해주세요.

---

## 설치방법

자세한 내용은 [설치방법](./docs/installation.md)을 확인하세요.

## 디폴트

기본적으로 `po2mo`는 **로컬 Git 저장소에서 생성, 수정 또는 스테이징된 .po 파일을 변환합니다**.

[`-cwd`](#현재-작업-디렉토리---cwd) 옵션으로 현재 작업 디렉토리를 변경할 수 있습니다.

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

## 인풋 설정 (`<경로>`)

자세한 내용은 [Providing Input](./providing-input.md)을 확인 하세요.

## 아웃풋 설정 (`--output`)

자세한 내용은 [Providing Output](./providing-output.md)을 확인 하세요.

## 현재 작업 디렉토리 (`--cwd`)

때로는 현재 작업 디렉토리를 지정해야 할 때가 있죠. 레츠기릿!

## Configuration (`--config`)

저희는 설정파일을 사용하지 않는 것을 권장하지만, 상황에 따라서는 해결책이 필요할 때가 있습니다.

`po2mo`는 `po2mo.json` 설정파일에 대한 경로를 `--config` 옵션을 통해 지정하여 여러 `작업(task)`에 대한 설정을 지원합니다.

`tasks` 배열의 각 객체는 하나의 `작업`과 동일하며, CLI와 마찬가지로 `input`, `output`, `recursive` 값을 받습니다.

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
      "recursive": true
    }
  ]
}
```
