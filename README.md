# 스티커 메모 (Sticker Memo)

포스트잇 스타일의 메모 앱입니다. 메모 추가·수정·삭제, 카테고리 필터, 드래그로 순서 변경, 다크/라이트 모드를 지원하며, 데이터는 **로컬 스토리지**에 저장됩니다.

## 주요 기능

- **메모 CRUD** — 제목·내용·카테고리 입력, 수정, 삭제(확인 다이얼로그)
- **포스트잇 스타일** — 메모마다 랜덤 색상(6종), 살짝 기울어진 카드 + 그림자
- **추가 애니메이션** — 새 메모 저장 시 "착" 붙는 듯한 scale 애니메이션
- **호버·버튼** — 카드 호버 시 확대/그림자, 수정·삭제 버튼 페이드인
- **드래그 앤 드롭** — 메모 순서 변경, 필터 적용 중에도 동작, 순서 자동 저장
- **카테고리** — 미분류·업무·개인·기타 선택, 카테고리별 필터 드롭다운
- **다크/라이트 모드** — 헤더 토글로 전환, 로컬 스토리지 + 시스템 설정 폴백
- **로컬 저장** — 메모·순서·테마 모두 브라우저에 저장, 새로고침 후에도 유지

## 기술 스택

| 구분 | 기술 |
|------|------|
| 프레임워크 | Next.js 15 (App Router, Turbopack), React 19, TypeScript 5 |
| 스타일 | Tailwind CSS 4, shadcn/ui 스타일(Button, Card, Dropdown), cva, clsx, tailwind-merge |
| UI/UX | Lucide React, @radix-ui/react-dropdown-menu, @hello-pangea/dnd |
| 기타 | tw-animate-css, localStorage |

## 프로젝트 구조

```
src/
├── app/                 # layout, page, globals.css
├── components/          # MemoCard, MemoForm, MemoList, ThemeToggle, CategoryFilterDropdown
├── components/ui/       # button, card, dropdown-menu
├── contexts/            # theme-context (다크/라이트)
├── hooks/               # use-memos (로컬 스토리지 연동)
├── lib/                 # utils (cn), postit-colors
└── types/               # memo (Memo, MEMO_CATEGORIES 등)
```

## 시작하기

### 설치

```bash
npm install
```

### 개발 서버

```bash
npm run dev
```

브라우저에서 [http://localhost:3000](http://localhost:3000) 을 엽니다.

### 빌드 & 실행

```bash
npm run build
npm start
```

### 린트

```bash
npm run lint
```

## 더 알아보기

- [docs/velog-post.md](./docs/velog-post.md) — 구현 하이라이트, 로컬 스토리지·드래그 앤 드롭·다크 모드·포스트잇 스타일 설명

## 라이선스

Private.
