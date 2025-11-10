# Pepero Factory

커스텀 빼빼로를 디자인하고 공유할 수 있는 Next.js 16 + React 19 애플리케이션입니다. 3D 미리보기, QR 공유, 메시지 카드 템플릿 등을 제공하며 Cloudflare Pages로 배포됩니다.

## 주요 기능
- **Pepero Maker**: 초콜릿·토핑·포장 꾸미기와 실시간 WebGL 프리뷰
- **Gift Share**: 디자인을 Base64 URL로 인코딩하여 링크/QR/네이티브 공유
- **Gift Viewer**: Edge 런타임에서 동작하는 `/gift/[payload]` 페이지와 BGM, 리액션 UI

## 기술 스택
Next.js 16, React 19, TypeScript, Tailwind CSS, shadcn/ui, html-to-image, Cloudflare Pages.

## 프로젝트 구조
```
app/                 # Next.js routes (maker, gift viewer, layout)
components/          # UI 컴포넌트 및 shadcn primitives
lib/                 # design schema/util, fortune helpers, 공용 util
public/              # 정적 에셋 (아이콘, 이미지)
styles/              # Tailwind 및 글로벌 스타일 시트
AGENTS.md            # Contributor 가이드
RUN_GUIDE.md         # CLI 실행 팁 (한국어)
```

## 시작하기
1. `pnpm install` – 필수. npm/yarn은 peer dependency 문제 발생 가능.
2. (선택) `.env.local`에 `NEXT_PUBLIC_SITE_URL=https://pepero-factory.pages.dev` 등 환경 변수를 설정.
3. `pnpm dev` 실행 후 http://localhost:3000 접속.

### 스크립트
- `pnpm dev`: 개발 서버 + HMR
- `pnpm build`: 프로덕션 빌드 (Edge 타깃 확인)
- `pnpm start`: 빌드 결과 실행
- `pnpm lint`: ESLint (설치 필요 시 `pnpm add -D eslint ...`)

## 환경 변수
| 변수 | 설명 | 기본값 |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | 공유 링크 기본 도메인. Cloudflare 프리뷰 도메인 보정에 사용 | `https://pepero-factory.pages.dev` |

## 배포
1. `pnpm build`가 성공해야 Cloudflare Pages 배포가 통과합니다.
2. Cloudflare Pages Project → `Build command: pnpm build`, `Output: .next`.
3. Edge Runtime이므로 Node 전용 API 사용 시 `if (typeof window !== "undefined")` 같은 가드를 두세요.
4. 배포 후 카카오톡/메신저 공유 링크가 올바른지 실제 URL로 검증하세요.

## 테스트 & 품질
- 현재 자동화 테스트는 없으므로 기능 추가 시 수동 QA 단계를 PR 설명에 기록하세요.
- 공유 링크, QR 생성, 이미지 다운로드 등 브라우저 권한이 필요한 기능은 데스크톱/모바일에서 직접 확인합니다.
