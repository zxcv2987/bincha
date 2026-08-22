---
name: Bincha
description: 완료한 일을 결과와 성과로 남기는 개인 작업 관리 도구
colors:
  taxi-vacancy-amber-50: "oklch(97% 0.025 55)"
  taxi-vacancy-amber-100: "oklch(93% 0.06 55)"
  taxi-vacancy-amber-400: "oklch(74% 0.15 55)"
  taxi-vacancy-amber-500: "oklch(64% 0.19 48)"
  taxi-vacancy-amber-600: "oklch(54% 0.19 45)"
  taxi-vacancy-amber-700: "oklch(44% 0.17 42)"
  neutral-white: "#ffffff"
  neutral-50: "#fafafa"
  neutral-100: "#f4f4f5"
  neutral-200: "#e4e4e7"
  neutral-300: "#d4d4d8"
  neutral-400: "#a1a1aa"
  neutral-500: "#71717a"
  neutral-600: "#52525b"
  neutral-700: "#3f3f46"
  neutral-800: "#27272a"
  danger-50: "#fef2f2"
  danger-400: "#f87171"
  danger-500: "#ef4444"
  danger-600: "#dc2626"
  danger-700: "#b91c1c"
typography:
  display:
    fontFamily: "LINESeedKR, system-ui, sans-serif"
    fontSize: "clamp(1.5rem, 4vw, 2.25rem)"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "normal"
  title:
    fontFamily: "LINESeedKR, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "normal"
  body:
    fontFamily: "LINESeedKR, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: "normal"
  label:
    fontFamily: "LINESeedKR, system-ui, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
    lineHeight: 1.4
    letterSpacing: "0.05em"
rounded:
  sm: "0.375rem"
  md: "0.5rem"
  lg: "0.75rem"
  full: "9999px"
spacing:
  xs: "0.375rem"
  sm: "0.5rem"
  md: "0.75rem"
  lg: "1rem"
  xl: "1.5rem"
components:
  button-primary:
    backgroundColor: "{colors.taxi-vacancy-amber-600}"
    textColor: "{colors.neutral-white}"
    rounded: "{rounded.md}"
    padding: "0.75rem 2.5rem"
  button-primary-hover:
    backgroundColor: "{colors.taxi-vacancy-amber-700}"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.neutral-500}"
    rounded: "{rounded.md}"
    padding: "0.375rem 0.75rem"
  button-ghost-hover:
    backgroundColor: "{colors.neutral-50}"
    textColor: "{colors.neutral-800}"
  input:
    backgroundColor: "{colors.neutral-white}"
    textColor: "{colors.neutral-700}"
    rounded: "{rounded.md}"
    padding: "0.5rem"
---

# Design System: Bincha

## Overview

**Creative North Star: "The Vacancy Light"**

빈차(空車)의 빈차등처럼, 이 시스템은 대부분 조용한 흑백에 가까운 회색조 화면이다. 따뜻한 오렌지(Taxi Vacancy Amber)는 화면 전체를 채우지 않고, "지금 반응해야 할 지점" — 선택된 카테고리, 완료된 할 일, 주요 액션 버튼 — 에만 드문드문 켜진다. 색이 귀할수록 그 색이 가리키는 곳이 명확해진다.

톤은 담백하고 절제되어 있으며 실용적이다. 이 앱은 성과를 과장하지 않는다는 제품 원칙([[PRODUCT.md]] 참고)을 화면에서도 그대로 지킨다 — 장식적인 그라디언트, 화려한 애니메이션, 과시적인 카드형 UI가 없다. 인터랙티브 요소는 평소엔 존재감을 드러내지 않다가(테두리도 배경도 없이 텍스트만) hover·focus 순간에만 반응한다("조용하다가 닿으면 반응하는" 컴포넌트 철학).

**Key Characteristics:**
- 배경은 거의 항상 흰색 또는 zinc-50, 색은 브랜드 컬러 하나로 제한
- 인터랙티브 요소는 정지 상태에서 무테두리·무배경(ghost)이고 hover/focus에서만 색이 켜짐
- 그림자는 거의 쓰지 않고, 쓰더라도 일시적 상태(드래그 중, 모달)에만 등장
- 둥근 모서리(rounded-lg 기본)로 부드럽지만 장식은 없는 형태

## Colors

배경은 거의 항상 흰색과 옅은 zinc 톤이고, 브랜드 오렌지는 화면의 극히 일부(선택·완료·강조 액션)에만 배치된다.

### Primary
- **Taxi Vacancy Amber 600** (`oklch(54% 0.19 45)`): 주요 액션 버튼 배경(`.btn-primary`), 완료된 체크박스 배경/테두리. white on brand-600 대비 5.45:1(AA 통과)
- **Taxi Vacancy Amber 500** (`oklch(64% 0.19 48)`): 포커스 링 전용(불투명도 40%로만 사용). 자체 대비 3.6:1이라 텍스트에는 쓰지 않는다
- **Taxi Vacancy Amber 700** (`oklch(44% 0.17 42)`): 주요 버튼 hover, 선택된 카테고리 텍스트. 대비 8.3:1(white 기준) / 7.5:1(brand-50 기준)
- **Taxi Vacancy Amber 50 / 100** (`oklch(97% 0.025 55)` / `oklch(93% 0.06 55)`): 선택/hover된 칩·행의 옅은 배경

### Neutral
- **Neutral White** (`#ffffff`): 기본 배경, 카드/다이얼로그 배경
- **Neutral 50** (`#fafafa`): 카테고리 행, hover된 리스트 아이템, 빈 상태 카드 배경
- **Neutral 300** (`#d4d4d8`): 입력창 기본 테두리, 미완료 체크박스 테두리
- **Neutral 400 / 500** (`#a1a1aa` / `#71717a`): 보조 텍스트(날짜, 빈 필드 안내, 섹션 라벨). **주의**: `neutral-400` on white는 대비 약 2.6:1로 WCAG AA(4.5:1) 미달 — 본문성 텍스트에는 `neutral-500` 이상을 쓴다
- **Neutral 700 / 800** (`#3f3f46` / `#27272a`): 제목, 본문 강조 텍스트

### Danger (경고/삭제)
- **Danger 600 / 700** (`#dc2626` / `#b91c1c`): 삭제 확인 버튼 배경과 hover
- **Danger 50** (`#fef2f2`): 삭제 액션 hover 배경

### Named Rules
**The One Voice Rule.** 브랜드 컬러(amber)는 화면당 한두 곳(선택 상태, 완료 표시, 주요 CTA)에만 켜진다. 여러 요소에 동시에 브랜드 색을 칠하지 않는다 — 희소성이 신호의 의미를 만든다.

## Typography

**Display/Body Font:** LINESeedKR (Regular 400 / Thin 300 / Bold 700, `public/fonts/LINESeedKR-*.woff2`)

**Character:** 한글 UI 전용 서체 하나로 전체 위계를 소화한다. 별도의 세리프/모노 폰트는 없다 — 무게(weight)와 크기만으로 위계를 만드는 절제된 타이포그래피.

### Hierarchy
- **Display** (600, `clamp(1.5rem, 4vw, 2.25rem)`/24–36px, 1.2 line-height): 페이지 정체성 헤드라인. "내가 해야 할 일" 하나에만 쓰인다
- **Title** (700, 1.5rem/24px, 1.3): 다이얼로그·모달 제목("카테고리 관리" 등)
- **Body** (400–600 가변, 0.875rem/14px, 1.5): 할 일 제목·설명, 폼 라벨, 대부분의 UI 텍스트. 제목류는 semibold(600)로 강조
- **Label** (600, 0.75rem/12px, uppercase, letter-spacing 0.05em): "진행 중"/"완료" 같은 섹션 구분 라벨

### Named Rules
**The Single-Face Rule.** 폰트는 LINESeedKR 하나뿐이다. 새 서체를 들여오지 말고 weight/size 조합으로 위계를 표현한다.

## Layout

컨테이너는 `max-w-6xl`로 중앙 정렬되고 좌우 패딩은 모바일 `px-6` → `md:px-0`(컨테이너 자체가 좁아지며 여백을 대신함). 상단 여백 `pt-16`, 하단 `pb-40`으로 콘텐츠가 화면 상단에 밀착하지 않는다.

리스트류(할 일, 카테고리)는 카드 없이 `flex flex-col gap-*`으로 이어 붙는 방식이 기본이고, 각 행은 자체 배경(`hover:bg-zinc-50` 또는 `bg-zinc-50`)으로만 구분된다 — 굵은 구분선이나 그림자로 나누지 않는다.

반응형은 `sm:`/`md:` 브레이크포인트로 헤더가 세로→가로로 전환되고(`AppHeader`), 사이드바 내비게이션이 가로 스크롤 탭→세로 리스트로 전환된다(`Sidebar`).

## Elevation & Depth

기본적으로 완전히 평평한(flat) 시스템이다. 그림자는 장식이 아니라 "이 요소가 일시적으로 레이어 위에 떠 있다"는 상태 신호로만 쓰인다.

### Shadow Vocabulary
- **드래그 중** (`shadow-lg`): 카테고리 행을 드래그로 재정렬하는 동안만 적용
- **모달/다이얼로그** (`shadow-xl`): `<dialog>` 요소가 백드롭(`zinc-700/20`) 위에 뜰 때

### Named Rules
**The Flat-By-Default Rule.** 그림자는 정지 상태의 UI에 쓰지 않는다. 드래그·모달처럼 실제로 레이어가 분리되는 순간에만 등장한다.

## Shapes

모서리는 세 단계로만 쓴다: 작은 인라인 버튼/뱃지는 `rounded-md`(6px), 카드형 요소(입력창, 버튼, 칩, 카테고리 행)는 기본값 `rounded-lg`(8px), 다이얼로그처럼 더 큰 표면은 `rounded-xl`(12px). 체크박스만 예외적으로 `rounded-full`(원형)이다.

테두리는 최소한으로만 쓴다 — 입력창(`border border-zinc-300`)과 다이얼로그 헤더 구분선(`border-b border-zinc-100`) 정도이고, 대부분의 구분은 배경색 차이로만 이루어진다.

## Components

### Buttons
- **Shape:** `rounded-lg`(8px)
- **Primary (`.btn.btn-primary`):** 배경 `taxi-vacancy-amber-600`, 텍스트 흰색, `font-semibold`, 패딩 `0.75rem 2.5rem`, 전체 너비 기본(`w-full`, 인라인일 땐 `w-auto`). Hover: `amber-700`
- **Ghost(대부분의 버튼):** 정지 상태에 배경·테두리 없음, 텍스트만 `neutral-500`~`neutral-700`. Hover에서 `neutral-50`/`neutral-100` 배경 + 텍스트 진하게. 브랜드 강조가 필요한 텍스트 버튼은 hover 시 `amber-50` 배경 + `amber-600` 텍스트
- **Destructive:** 삭제 확정 버튼만 `bg-danger-600` 채움, 나머지 삭제 트리거는 ghost + hover `danger-50`/`danger-600`
- **Hover / Focus:** `focus-visible:ring-2 ring-taxi-vacancy-amber-500/40 ring-offset-1~2` + `outline-none`. 불투명 링이 아니라 40% 알파로, `.input`의 은은한 포커스 글로우와 톤을 맞춘다

### Chips (카테고리 필터)
- **Style:** 정지 상태 투명 배경 + `neutral-500` 텍스트, `rounded-lg`, `px-3 py-1.5`
- **State:** 선택됨 → 배경 `amber-50` + 텍스트 `amber-700` + `font-semibold`. 미선택 hover → `neutral-50` 배경 + `neutral-800` 텍스트. 포커스 → amber 링 (offset 1)

### Inputs / Fields (`.input`)
- **Style:** 테두리 `1px solid neutral-300`, `rounded-lg`, 패딩 `0.5rem`, 배경 흰색
- **Focus:** 테두리가 `amber-500`으로 바뀌고, `0 0 0 3px oklch(amber-500 25%)` 글로우가 번짐(불투명 링이 아니라 은은한 shadow) — 이 프로젝트에서 가장 부드러운 포커스 처리이며 다른 컴포넌트의 기준점

### Custom Checkbox (Signature Component)
할 일 완료 토글은 네이티브 체크박스를 `sr-only`로 숨기고, `size-5 rounded-full border-2` 원으로 대체한다. 미완료는 `neutral-300` 테두리 + 흰 배경, 완료되면 `amber-600` 테두리+배경으로 채워지고 내부의 체크 아이콘이 `scale-0 → scale-100`으로 트랜지션되며 그려진다. 포커스는 `ring-2 amber-500/40 ring-offset-2`.

### Dialog / Modal
- **Corner Style:** `rounded-xl`(12px)
- **Background:** 흰색, 백드롭 `zinc-700` 20% 알파
- **Shadow Strategy:** `shadow-xl` (Elevation 참고 — 모달일 때만 등장하는 유일한 강한 그림자)
- **Border:** 헤더-본문 사이 `border-b border-zinc-100`만 존재
- **구조:** 네이티브 `<dialog>` + `showModal()`. 제목(`title`, 2xl bold) + 닫기(`✖`, `font-thin`) 헤더, 콘텐츠는 `pt-4`로 분리

### Navigation (Sidebar)
- **Style:** `rounded-lg`, `px-3 py-2`, `text-sm font-semibold`
- **State:** 활성 경로 → `amber-50` 배경 + `amber-700` 텍스트. 비활성 → `neutral-500`, hover 시 `neutral-50` 배경 + `neutral-800` 텍스트
- **Mobile:** 세로 스택 대신 가로 스크롤 탭(`overflow-x-auto`)으로 전환

## Do's and Don'ts

### Do:
- **Do** 브랜드 색(amber)은 선택/완료/주요 CTA 등 "지금 반응해야 할 지점"에만 쓴다 (The One Voice Rule)
- **Do** 인터랙티브 요소는 정지 상태에서 조용하게(무배경/무테두리) 두고 hover·focus에서만 색을 켠다
- **Do** 포커스 표시는 `ring-2 ring-taxi-vacancy-amber-500/40` + `ring-offset` + `outline-none`으로 통일한다
- **Do** 그림자는 드래그 중·모달처럼 레이어가 실제로 분리되는 순간에만 쓴다

### Don't:
- **Don't** `neutral-400`(zinc-400)을 흰 배경 위 본문성 텍스트에 쓰지 않는다 — 대비 2.6:1로 AA 미달. 보조 텍스트는 `neutral-500` 이상
- **Don't** 정지 상태의 버튼/카드에 그림자나 테두리를 기본으로 깔지 않는다 — 이 시스템은 flat이 기본값이다
- **Don't** 브랜드 색을 여러 요소에 동시에 칠해 화면을 화려하게 만들지 않는다 — 희소성이 신호다
- **Don't** LINESeedKR 외의 서체를 섞지 않는다
