# 실행 가이드

## 1. 의존성 설치

이 프로젝트는 기본 패키지 매니저로 `pnpm`을 사용합니다. (Next 16 + React 19 조합을 위해 npm/yarn보다 안정적입니다.)

```bash
pnpm install
```

> **참고:** `npm install`을 실행하면 `vaul` 패키지가 React 18 이하만 지원한다고 판단하여 `ERESOLVE` 오류가 발생합니다. 반드시 `pnpm`을 사용하거나, 불가피할 경우 `npm install --legacy-peer-deps`를 사용하세요.

## 2. 개발 서버 실행

```bash
pnpm dev
```

브라우저에서 http://localhost:3000 으로 접속하면 실시간으로 변경 사항을 확인할 수 있습니다.

## 3. 프로덕션 빌드

```bash
pnpm build
pnpm start
```

`build`가 성공하면 `start`로 프로덕션 모드 서버를 실행할 수 있습니다.

## 4. 코드 품질 검사

```bash
pnpm lint
```

현재 리포지터리에는 ESLint가 아직 설치되어 있지 않으므로, 필요하다면 아래 명령으로 설정을 추가한 뒤 다시 실행하세요.

```bash
pnpm add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin eslint-config-next
```

## 5. 기타

- QR 코드 기능을 사용하려면 브라우저 클립보드/다운로드 권한이 필요합니다.
- 토핑/프리뷰 기능은 Web Canvas API를 사용하므로, iOS 사파리 등 일부 환경에서는 성능 저하가 있을 수 있습니다.
