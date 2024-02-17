# 설치방법

## Standalone 스크립트

### 윈도우

```sh
iwr https://github.com/devjiwonchoi/po2mo/raw/main/scripts/install.ps1 -useb | iex
```

### POSIX 시스템

```sh
curl -fsSL https://github.com/devjiwonchoi/po2mo/raw/main/scripts/install.sh | sh -
```

만약 `curl`이 설치 되어있지 않다면, `wget` 사용을 권장 드립니다:

```sh
wget -qO- https://github.com/devjiwonchoi/po2mo/raw/main/scripts/install.sh | sh -
```

### 특정 버전 설치

설치 스크립트를 실행하기 전에, `PO2MO_VERSION` 환경 변수를 설정하여 특정 버전의 po2mo를 설치할 수 있습니다:

```sh
curl -fsSL https://github.com/devjiwonchoi/po2mo/raw/main/scripts/install.sh | env PO2MO_VERSION=<version> sh -
```

## Node.js 패키지 매니저를 사용할 경우

### npx

```sh
npx po2mo@latest
```

### npm

```sh
npm i -g po2mo
```

### yarn

```sh
yarn global add po2mo
```

### pnpm

```sh
pnpm i -g po2mo
```
