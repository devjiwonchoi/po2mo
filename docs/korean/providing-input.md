# 인풋 설정

다음과 같은 폴더 트리가 있다고 가정해봅시다:

```sh
.
└── locale/
    ├── a.po
    ├── b.po
    └── c.po
```

`a.po` 파일을 인풋으로 제공하면:

```sh
po2mo ./locale/a.po
```

`a.mo` 파일이 `a.po` 파일과 동일한 디렉토리에 생성됩니다.

```sh
.
└── locale/
    ├── a.po
    ├── a.mo <-- new!
    ├── b.po
    └── c.po
```

만약 `locale` 디렉토리 자체를 인풋으로 제공한다면:

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

만약 `locale` 디렉토리 안에 중첩된 디렉토리가 있다면:

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

`--recursive` (또는 `-r` 별칭) 옵션을 사용하여 중첩된 디렉토리를 대상으로도 할 수 있습니다.

```sh
po2mo ./locale --recursive
```

> 폴더 트리를 보여 드리진 않을게요.. 어떻게 생겼을지 아시죠? ;)
