# Next.js + React로 만든 스티커 메모 앱 개발 후기

포스트잇 스타일의 메모 앱을 Next.js 15와 React 19로 구현하면서 적용한 기능과 사용한 라이브러리를 정리했습니다.

---

## 프로젝트 소개

**스티커 메모**는 브라우저에서 동작하는 간단한 메모 앱입니다. 포스트잇처럼 알록달록한 카드로 메모를 추가·수정·삭제하고, 카테고리별로 필터링하며, 드래그로 순서를 바꿀 수 있습니다. 데이터는 모두 **로컬 스토리지**에 저장되어 탭을 닫았다 켜도 유지됩니다.

---

## 주요 기능

| 기능 | 설명 |
|------|------|
| **메모 CRUD** | 제목·내용 입력, 수정, 삭제 (삭제 시 확인 다이얼로그) |
| **포스트잇 스타일** | 메모마다 랜덤 색상(노랑·핑크·민트·라벤더·피치·스카이), 살짝 기울어진 카드 + 부드러운 그림자 |
| **추가 애니메이션** | 새 메모 저장 시 "착" 붙는 듯한 scale 인 애니메이션 |
| **호버 효과** | 카드 호버 시 살짝 확대·그림자 강화, 수정/삭제 버튼 페이드인 + 스태거 |
| **드래그 앤 드롭** | 메모 순서 변경, 필터 적용 중에도 드래그 가능, 순서 변경 시 자동 저장 |
| **카테고리** | 미분류·업무·개인·기타 중 선택, 카테고리별 필터 드롭다운 |
| **다크/라이트 모드** | 헤더 토글 버튼으로 전환, 선택값 로컬 스토리지 저장 + 시스템 설정 폴백 |
| **로컬 스토리지 저장** | 메모·순서·테마 모두 브라우저에 저장, 새로고침·앱 재실행 후에도 유지 |

---

## 사용 기술 스택 & 라이브러리

### 프레임워크 & 언어

- **Next.js 15** (App Router, Turbopack)
- **React 19**
- **TypeScript 5**

### 스타일링

- **Tailwind CSS 4** — 유틸리티 클래스, `@theme` 기반 CSS 변수
- **shadcn/ui 스타일** — New York 스타일 기준으로 Button, Card, Dropdown Menu 등을 직접 구현
- **class-variance-authority (cva)** — 버튼 variant/size 조합
- **clsx + tailwind-merge** — `cn()` 헬퍼로 조건부·중복 클래스 정리

### UI & UX

- **Lucide React** — 아이콘 (Sun, Moon, Pencil, Trash2, Plus, Filter, ChevronDown 등)
- **@radix-ui/react-dropdown-menu** — 접근성 지원 드롭다운 (카테고리 필터·선택)
- **@hello-pangea/dnd** — 드래그 앤 드롭 (react-beautiful-dnd API 호환 포크, React 18+ 대응)

### 기타

- **tw-animate-css** — CSS 애니메이션 유틸
- **localStorage** — 메모 배열·테마 저장 (별도 백엔드 없음)

---

## 구현 하이라이트

### 1. 로컬 스토리지 동기화

메모 배열은 `useMemos` 훅 하나에서 관리합니다.

- **초기 로드**: `useEffect` 한 번으로 `localStorage.getItem()` → `JSON.parse()` → `setMemos`
- **저장**: `memos`가 바뀔 때마다 `useEffect`에서 `localStorage.setItem(JSON.stringify(memos))` 호출
- **hydrated 플래그**: SSR 직후 한 번이라도 클라이언트에서 불러온 뒤에만 저장하도록 해서, 불필요한 덮어쓰기 방지

추가·수정·삭제·순서 변경이 모두 같은 `memos` 상태를 바꾸기 때문에, 별도 “저장 버튼” 없이 자동으로 로컬 스토리지에 반영됩니다.

### 2. 드래그 앤 드롭 + 필터

- 리스트는 `DragDropContext` → `Droppable` → `Draggable` 구조
- **필터 적용 시**: 화면에는 `filteredMemos`만 보이지만, 드롭 시 `filteredMemos`의 source/destination 인덱스를 전체 `memos`의 인덱스로 변환해 `reorderMemos(fullFrom, fullTo)` 호출
- 그래서 “업무”만 보이는 상태에서 순서를 바꿔도, 전체 메모 순서가 올바르게 갱신되고 그대로 저장됩니다.

### 3. 다크 모드

- **초기 스크립트**: `layout.tsx`의 `<head>` 안 인라인 스크립트로, 첫 페인트 전에 `localStorage` + `prefers-color-scheme`을 읽어 `document.documentElement.classList.add('dark')` 여부 결정 → 깜빡임 감소
- **ThemeProvider**: 클라이언트에서 테마 상태 관리, 토글 시 `document` 클래스 + `localStorage` 동기화
- **스타일**: `globals.css`의 `:root` / `.dark`에 각각 CSS 변수 정의, Tailwind `@theme`에서 참조

### 4. 포스트잇 색상 & 애니메이션

- **색상**: 6가지 팔레트를 두고, 새 메모는 `Math.random()`으로 인덱스 결정 후 `colorIndex`로 저장해 메모마다 고정
- **회전**: `getPostitStyle(memo, index)`에서 인덱스 기반으로 -1.2° ~ 1.4° 회전 적용
- **추가 애니메이션**: 새로 추가된 메모만 `animate-stick` 클래스로 scale 0.35 → 1.08 → 1 + cubic-bezier로 “착” 붙는 느낌

---

## 프로젝트 구조 (요약)

```
src/
├── app/              # layout, page, globals.css
├── components/       # MemoCard, MemoForm, MemoList, ThemeToggle, CategoryFilterDropdown
├── components/ui/    # button, card, dropdown-menu (shadcn 스타일)
├── contexts/         # theme-context (다크/라이트)
├── hooks/            # use-memos (로컬 스토리지 연동)
├── lib/              # utils (cn), postit-colors
└── types/            # memo (Memo, MEMO_CATEGORIES 등)
```

---

## 마치며

- **Next.js App Router + 클라이언트 훅**으로 데이터 흐름을 단순하게 가져가고,
- **로컬 스토리지**만으로도 껐다 켜도 유지되는 메모 앱을 만들 수 있었습니다.
- **@hello-pangea/dnd**로 드래그 앤 드롭을 넣고, **Radix 기반 드롭다운**으로 카테고리 필터/선택을 맞추면서, 접근성과 키보드 조작도 함께 고려할 수 있었습니다.

추가로 붙이고 싶다면 **검색**, **태그**, **메모 내 보관(아카이브)** 같은 기능을 이어서 확장할 수 있을 것 같습니다.

---

**태그:** `Next.js` `React` `TypeScript` `Tailwind CSS` `로컬스토리지` `드래그앤드롭` `다크모드` `메모앱`
