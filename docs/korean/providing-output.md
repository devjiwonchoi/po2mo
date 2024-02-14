# 아웃풋 설정

> :bulb: 꿀팁: 인풋을 디렉토리로, 아웃풋을 파일로 설정하면 에러 납니다! :x:

다음과 같은 폴더 트리가 있다고 가정해봅시다:

```sh
.
└── locale/
    ├── a.po
    ├── b.po
    └── c.po
```

아웃풋 경로를 `--output` (또는 `-o` 별칭) 옵션으로 지정할 수 있습니다.

아웃풋을 파일이름 `a-converted.mo`으로 지정한다면:

```sh
po2mo ./locale/a.po --output ./locale/a-converted.mo
```

아웃풋 파일이름 또한 지정 할 수 있습니다:

```sh
.
└── locale/
    ├── a.po
    ├── a-converted.mo <-- new!
    ├── b.po
    └── c.po
```

만약 `output` 디렉토리로 아웃풋을 지정하고 싶다면:

```sh
po2mo ./locale --output ./output
```

`.mo` 파일들이 `output` 디렉토리에 저장 됩니다:

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

그렇다면 중첩된 디렉토리를 대상으로 하는 `--recursive`는 어떨까요?

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

걱정 마세요, 중첩된 `.po` 파일들의 폴더 구조는 보존 됩니다!

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
