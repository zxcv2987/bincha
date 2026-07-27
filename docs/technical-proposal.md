# Bincha 기술 제안서

## 1. 문서 목적

이 문서는 기존 Bincha 코드베이스에 다음 기능을 안전하게 추가하기 위한 기술 방향을 정의한다.

```text
Todo 완료
→ 실행 결과 기록
→ 여러 결과를 성과로 연결
→ 성과 측정
→ 기간별 회고
```

현재 애플리케이션 구조를 최대한 유지하면서 단계적으로 확장하는 것을 원칙으로 한다.

> 이 문서는 Bincha의 **최종 기술 방향(전체 아키텍처)**을 정의한다.
> 1차로 구현할 범위는 [[mvp-technical-plan|MVP 기술 계획]] 문서를 따른다.
> Achievement / Measurement / Evidence 관련 구현(11~12장, 24장 3~5단계)은 MVP 범위가 아니다.

---

## 2. 현재 시스템 요약

### 2.1 기술 스택

현재 Bincha는 다음 기술을 사용한다.

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- Prisma ORM 6
- PostgreSQL
- Supabase
- Zustand
- Server Actions
- JWT 기반 자체 인증

### 2.2 코드 구조

현재 코드는 기능 단위로 분리되어 있다.

```text
features/
├─ auth/
├─ category/
├─ modal/
├─ shared/
└─ todo/
```

Todo 기능은 다음 계층으로 나뉜다.

```text
todo.actions.ts
todo.service.ts
todo.queries.ts
types.ts
components/
```

신규 기능도 동일한 Feature 기반 구조를 유지한다.

### 2.3 현재 주요 모델

```text
user
category
todos
```

현재 관계는 다음과 같다.

```text
category
└─ todos
```

`user`와 `category`, `todos` 사이에는 직접적인 소유 관계가 없다.

### 2.4 현재 Todo 모델

Todo에는 이미 다음 완료 필드가 존재한다.

```prisma
completed Boolean @default(false)
```

하지만 현재 Todo 타입, Server Action, Service, UI에서는 완료 상태를 사용하지 않는다.

따라서 신규 도메인 구현 전 Todo 완료 기능을 먼저 복원해야 한다.

---

## 3. 현재 구조의 주요 문제

## 3.1 사용자별 데이터 경계 부재

현재 Todo와 Category 조회에서 사용자 조건이 적용되지 않는다.

다중 사용자가 존재하면 모든 사용자가 같은 데이터를 조회하거나 수정할 가능성이 있다.

신규 Result와 Achievement 모델을 추가하기 전에 사용자별 데이터 소유 관계를 먼저 구성해야 한다.

목표 관계:

```text
user
├─ categories
├─ todos
├─ taskResults
└─ achievements
```

---

## 3.2 완료 기능이 도메인에 연결되지 않음

데이터베이스에는 `completed`가 존재하지만 다음 영역에서 사용되지 않는다.

- Todo Type
- Todo 생성 및 수정 Action
- Todo Service
- Todo Card
- Todo List Filter
- 완료 시각 기록

Bincha 2.0에서 완료는 Result 생성 흐름의 진입점이므로 우선 구현해야 한다.

---

## 3.3 전역 캐시

현재 Todo와 Category는 사용자 구분 없이 전역 캐시를 사용한다.

사용자별 데이터가 추가되면 전역 캐시는 다음 문제를 만들 수 있다.

- 다른 사용자의 데이터가 같은 캐시 키를 사용함
- 한 사용자의 수정이 전체 캐시를 무효화함
- 인증 정보가 캐시 함수 내부에서 안전하게 분리되지 않을 수 있음

초기에는 정확성을 위해 사용자 데이터 Query에서 전역 캐시를 제거하는 방안을 우선 고려한다.

이후 필요하면 사용자별 키를 사용한다.

```text
todos:{userId}
categories:{userId}
results:{userId}
achievements:{userId}
```

---

## 3.4 Cascade 삭제 위험

현재 Category 삭제 시 연결된 Todo도 Cascade 삭제된다.

Result와 Achievement가 추가되면 Category 하나를 삭제하면서 다음 기록이 연쇄적으로 손실될 수 있다.

```text
Category
→ Todo
→ TaskResult
→ Achievement 연결
→ Evidence
```

Category 삭제 정책을 변경해야 한다.

---

## 3.5 인증 사용자 ID 함수의 위치

현재 인증된 사용자 ID를 조회하는 함수가 인증 Action 파일 내부에 존재한다.

다른 Feature에서 사용자 ID가 필요해지므로 공통 인증 모듈로 분리해야 한다.

제안:

```text
lib/auth/session.ts
```

제공 함수:

```ts
getCurrentUserId();
requireCurrentUserId();
```

---

## 4. 목표 아키텍처 (최종 그림)

> Category/Todo/TaskResult까지가 MVP(P0~P2). Achievement/Measurement는 MVP 이후(P3~P4). 상세는 [[mvp-technical-plan|MVP 기술 계획]] 참고.

### 4.1 도메인 구조

```text
User
├─ Category
│  └─ Todo
│     └─ TaskResult
│        ├─ Evidence
│        └─ AchievementResult
│
└─ Achievement
   ├─ AchievementResult
   ├─ Measurement
   └─ Evidence
```

### 4.2 핵심 관계

```text
User 1 ─ N Category
User 1 ─ N Todo
User 1 ─ N TaskResult
User 1 ─ N Achievement

Category 1 ─ N Todo
Todo 1 ─ 0..1 TaskResult

TaskResult N ─ N Achievement
Achievement 1 ─ N Measurement
```

Todo 하나에는 대표 실행 결과 하나를 연결한다.

성과 하나에는 여러 실행 결과를 연결할 수 있다.

실행 결과 하나도 여러 성과를 뒷받침할 수 있으므로 중간 모델을 사용한다.

---

## 5. 데이터 모델 제안 (최종 그림)

> 5.2~5.5 (User/Category/Todo/TaskResult)는 MVP. 5.6~5.11 (Achievement/Measurement/Evidence)은 MVP 이후.

## 5.1 공통 명명 규칙

현재 Prisma 모델에 소문자 이름과 복수형 이름이 혼재되어 있다.

신규 모델부터 다음 규칙을 적용하는 것을 권장한다.

```text
Prisma Model: PascalCase 단수형
Database Table: snake_case
Field: snake_case 또는 camelCase 중 하나로 통일
```

기존 모델을 한 번에 변경하면 마이그레이션 위험이 있으므로 MVP에서는 기존 명명을 유지하면서 신규 모델만 일관성 있게 추가할 수 있다.

장기적으로는 다음과 같이 정리한다.

```text
user       → User
category   → Category
todos      → Todo
```

아래 스키마 예시는 기존 모델명을 최대한 유지하는 방향으로 작성한다.

---

## 5.2 User

```prisma
model user {
  id            BigInt   @id @default(autoincrement())
  created_at    DateTime @default(now()) @db.Timestamptz(6)
  password      String   @db.VarChar
  username      String   @unique @default("")
  refresh_token String   @default("")

  categories    category[]
  todos         todos[]
  task_results  task_result[]
  achievements  achievement[]
}
```

---

## 5.3 Category

```prisma
model category {
  id            BigInt   @id @default(autoincrement())
  created_at    DateTime @default(now()) @db.Timestamptz(6)
  category_name String   @default("")
  user_id       BigInt

  user          user     @relation(fields: [user_id], references: [id])
  todos         todos[]

  @@index([user_id])
  @@unique([user_id, category_name])
}
```

사용자별로 같은 카테고리 이름을 사용할 수 있다.

같은 사용자가 중복 이름을 생성하는 것은 제한한다.

---

## 5.4 Todo

```prisma
model todos {
  id           BigInt      @id @default(autoincrement())
  created_at   DateTime    @default(now()) @db.Timestamptz(6)
  updated_at   DateTime    @updatedAt @db.Timestamptz(6)

  title        String      @default("")
  text         String      @default("")
  completed    Boolean     @default(false)
  completed_at DateTime?   @db.Timestamptz(6)

  user_id      BigInt
  category_id  BigInt

  user         user        @relation(fields: [user_id], references: [id])
  category     category    @relation(fields: [category_id], references: [id])
  result       task_result?

  @@index([user_id, completed])
  @@index([category_id])
}
```

### Todo 입력 규칙

```text
title: 필수
text: 선택
category_id: 필수
```

기존에는 `text`를 필수로 검사하지만 UI는 내용이 없는 상태를 지원하고 있다.

기획과 UI 동작을 일치시키기 위해 `text`는 선택 필드로 변경한다.

---

## 5.5 Task Result

```prisma
model task_result {
  id                BigInt   @id @default(autoincrement())
  created_at        DateTime @default(now()) @db.Timestamptz(6)
  updated_at        DateTime @updatedAt @db.Timestamptz(6)

  todo_id           BigInt   @unique
  user_id           BigInt

  summary           String
  change_summary    String   @default("")
  unexpected        String   @default("")
  next_action       String   @default("")
  needs_measurement Boolean  @default(false)

  todo              todos   @relation(fields: [todo_id], references: [id], onDelete: Cascade)
  user              user    @relation(fields: [user_id], references: [id])

  achievements      achievement_result[]
  evidence          evidence[]

  @@index([user_id])
  @@index([needs_measurement])
}
```

### 정책

- Todo 하나에 Task Result 하나만 허용한다.
- Todo가 삭제되면 Result도 삭제할 수 있다.
- Result가 Achievement에 연결된 경우 Todo 삭제를 애플리케이션 계층에서 제한한다.

---

## 5.6 Achievement Status

```prisma
enum AchievementStatus {
  DRAFT
  MEASURING
  CONFIRMED
  ON_HOLD
}
```

상태 의미:

```text
DRAFT:
성과 초안

MEASURING:
실제 변화 확인 중

CONFIRMED:
사용자가 성과를 확인함

ON_HOLD:
측정이 어렵거나 성과로 보기 어려워 보류
```

---

## 5.7 Achievement

```prisma
model achievement {
  id          BigInt            @id @default(autoincrement())
  created_at  DateTime          @default(now()) @db.Timestamptz(6)
  updated_at  DateTime          @updatedAt @db.Timestamptz(6)

  user_id     BigInt
  title       String
  problem     String            @default("")
  action      String            @default("")
  decision    String            @default("")
  outcome     String            @default("")
  status      AchievementStatus @default(DRAFT)

  user         user                 @relation(fields: [user_id], references: [id])
  results      achievement_result[]
  measurements measurement[]
  evidence     evidence[]

  @@index([user_id, status])
}
```

---

## 5.8 Achievement Result

```prisma
model achievement_result {
  achievement_id BigInt
  result_id      BigInt

  achievement achievement @relation(
    fields: [achievement_id],
    references: [id],
    onDelete: Cascade
  )

  result task_result @relation(
    fields: [result_id],
    references: [id],
    onDelete: Cascade
  )

  @@id([achievement_id, result_id])
  @@index([result_id])
}
```

다대다 중간 모델을 사용하는 이유:

- 여러 Result가 하나의 Achievement를 구성할 수 있다.
- 하나의 Result가 서로 다른 Achievement의 근거가 될 수 있다.
- 연결과 해제를 독립적으로 관리할 수 있다.

---

## 5.9 Measurement

```prisma
model measurement {
  id             BigInt   @id @default(autoincrement())
  created_at     DateTime @default(now()) @db.Timestamptz(6)
  updated_at     DateTime @updatedAt @db.Timestamptz(6)

  achievement_id BigInt

  metric_name    String
  baseline       String   @default("")
  target_value   String   @default("")
  actual_value   String   @default("")
  due_date       DateTime? @db.Timestamptz(6)
  measured_at    DateTime? @db.Timestamptz(6)
  note           String   @default("")

  achievement achievement @relation(
    fields: [achievement_id],
    references: [id],
    onDelete: Cascade
  )

  @@index([achievement_id])
  @@index([due_date])
}
```

MVP에서는 측정값을 문자열로 저장한다.

이유:

- 시간, 건수, 퍼센트, 정성 평가 등 단위가 다양하다.
- 복잡한 지표 타입 모델링을 초기부터 도입하지 않아도 된다.

향후 필요하면 다음 구조로 확장한다.

```text
value
unit
value_type
```

---

## 5.10 Evidence Type

```prisma
enum EvidenceType {
  GITHUB_PR
  GITHUB_ISSUE
  DOCUMENT
  DEPLOYMENT
  IMAGE
  TEST_RESULT
  OTHER
}
```

---

## 5.11 Evidence

```prisma
model evidence {
  id             BigInt       @id @default(autoincrement())
  created_at     DateTime     @default(now()) @db.Timestamptz(6)

  type           EvidenceType
  title          String
  url            String       @default("")

  task_result_id BigInt?
  achievement_id BigInt?

  task_result task_result? @relation(
    fields: [task_result_id],
    references: [id],
    onDelete: Cascade
  )

  achievement achievement? @relation(
    fields: [achievement_id],
    references: [id],
    onDelete: Cascade
  )

  @@index([task_result_id])
  @@index([achievement_id])
}
```

### Evidence 연결 정책

Evidence는 Result 또는 Achievement 중 하나에 연결한다.

애플리케이션 검증에서 다음 규칙을 적용한다.

```text
task_result_id와 achievement_id 중 하나는 반드시 존재
두 값이 동시에 존재하는 것은 허용하지 않음
```

Prisma만으로 정확한 XOR 제약을 표현하기 어려우면 데이터베이스 Check Constraint 또는 Service 검증을 사용한다.

---

## 6. 사용자 인증과 데이터 소유권

## 6.1 공통 Session 유틸리티

제안 위치:

```text
lib/auth/session.ts
```

예시:

```ts
import { cookies } from "next/headers";
import { verifyAccessToken } from "@/lib/auth/tokens";

export async function getCurrentUserId(): Promise<bigint | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const payload = await verifyAccessToken(accessToken);
    return BigInt(payload.id as number);
  } catch {
    return null;
  }
}

export async function requireCurrentUserId(): Promise<bigint> {
  const userId = await getCurrentUserId();

  if (!userId) {
    throw new Error("AUTH_REQUIRED");
  }

  return userId;
}
```

---

## 6.2 조회 정책

모든 사용자 데이터 조회에 `user_id` 조건을 적용한다.

```ts
const userId = await requireCurrentUserId();

return prisma.todos.findMany({
  where: {
    user_id: userId,
  },
});
```

---

## 6.3 수정 및 삭제 정책

ID만으로 수정하거나 삭제하지 않는다.

잘못된 예:

```ts
prisma.todos.delete({
  where: { id },
});
```

권장 방식:

```ts
const deleted = await prisma.todos.deleteMany({
  where: {
    id,
    user_id: userId,
  },
});

if (deleted.count === 0) {
  throw new Error("TODO_NOT_FOUND");
}
```

복합 Unique Key를 사용할 수도 있다.

```prisma
@@unique([id, user_id])
```

다만 `id`가 이미 전역 Unique이므로 Service에서 소유권을 함께 검증하는 방식이 더 명확할 수 있다.

---

## 6.4 Category 소유권 검증

Todo 생성 또는 수정 시 전달된 Category가 현재 사용자의 것인지 검증한다.

```ts
const category = await prisma.category.findFirst({
  where: {
    id: categoryId,
    user_id: userId,
  },
});

if (!category) {
  throw new Error("CATEGORY_NOT_FOUND");
}
```

---

## 6.5 Result와 Achievement 연결 검증

성과에 Result를 연결할 때 Achievement와 Result가 같은 사용자 소유인지 확인한다.

가능하면 트랜잭션 내부에서 검증한다.

```ts
await prisma.$transaction(async (tx) => {
  const achievement = await tx.achievement.findFirst({
    where: {
      id: achievementId,
      user_id: userId,
    },
  });

  const results = await tx.task_result.findMany({
    where: {
      id: { in: resultIds },
      user_id: userId,
    },
  });

  if (!achievement || results.length !== resultIds.length) {
    throw new Error("INVALID_ACHIEVEMENT_RESULT_LINK");
  }

  await tx.achievement_result.createMany({
    data: resultIds.map((resultId) => ({
      achievement_id: achievementId,
      result_id: resultId,
    })),
    skipDuplicates: true,
  });
});
```

---

## 7. Feature 구조 (최종 그림)

> `result/`까지는 MVP. `achievement/`, `measurement/`, `evidence/`, `review/`는 MVP 이후.

기존 역할별 분리 방식을 유지한다.

```text
features/
├─ auth/
├─ category/
├─ todo/
│  ├─ components/
│  ├─ todo.actions.ts
│  ├─ todo.service.ts
│  ├─ todo.queries.ts
│  ├─ todo.errors.ts
│  └─ types.ts
│
├─ result/
│  ├─ components/
│  ├─ result.actions.ts
│  ├─ result.service.ts
│  ├─ result.queries.ts
│  ├─ result.errors.ts
│  └─ types.ts
│
├─ achievement/
│  ├─ components/
│  ├─ achievement.actions.ts
│  ├─ achievement.service.ts
│  ├─ achievement.queries.ts
│  ├─ achievement.errors.ts
│  └─ types.ts
│
├─ measurement/
│  ├─ components/
│  ├─ measurement.actions.ts
│  ├─ measurement.service.ts
│  └─ types.ts
│
├─ evidence/
│  ├─ evidence.actions.ts
│  ├─ evidence.service.ts
│  └─ types.ts
│
├─ review/
│  ├─ components/
│  └─ review.queries.ts
│
├─ modal/
└─ shared/
```

---

## 8. 페이지 구조 (최종 그림)

> `/results`까지는 MVP. `/achievements`, `/review`는 MVP 이후.

```text
app/
├─ page.tsx
│
├─ results/
│  └─ page.tsx
│
├─ achievements/
│  ├─ page.tsx
│  ├─ new/
│  │  └─ page.tsx
│  └─ [achievementId]/
│     ├─ page.tsx
│     └─ edit/
│        └─ page.tsx
│
├─ review/
│  └─ page.tsx
│
└─ login/
   └─ page.tsx
```

### 페이지 역할

```text
/:
Todo 목록

/results:
결과 기록 대기 및 결과 목록

/achievements:
성과 목록

/achievements/new:
성과 생성

/achievements/[id]:
성과 상세

/review:
주간 회고
```

---

## 9. Todo 완료 기능

## 9.1 Action

```ts
export async function toggleTodoCompletedAction(todoId: number) {
  try {
    const userId = await requireCurrentUserId();

    const todo = await toggleTodoCompleted({
      todoId,
      userId,
    });

    return {
      ok: true,
      todo,
    };
  } catch (error) {
    return {
      ok: false,
      error: "완료 상태를 변경하지 못했습니다.",
    };
  }
}
```

---

## 9.2 Service

```ts
export async function toggleTodoCompleted({
  todoId,
  userId,
}: {
  todoId: number;
  userId: bigint;
}) {
  return prisma.$transaction(async (tx) => {
    const todo = await tx.todos.findFirst({
      where: {
        id: todoId,
        user_id: userId,
      },
    });

    if (!todo) {
      throw new Error("TODO_NOT_FOUND");
    }

    const completed = !todo.completed;

    return tx.todos.update({
      where: {
        id: todo.id,
      },
      data: {
        completed,
        completed_at: completed ? new Date() : null,
      },
    });
  });
}
```

---

## 9.3 UI 동작

Todo 카드에 Checkbox를 추가한다.

```text
진행 중:
체크되지 않음

완료:
체크됨
완료일 표시
결과 상태 표시
```

완료 처리 후 다음 CTA를 노출한다.

```text
할 일을 완료했습니다.

[결과 기록] [실행 취소]
```

완료 상태 자체는 Result 생성 여부와 독립적으로 저장한다.

---

## 10. Result 구현

## 10.1 생성 조건

Result는 완료된 Todo에만 생성하도록 제한한다.

```ts
const todo = await prisma.todos.findFirst({
  where: {
    id: todoId,
    user_id: userId,
    completed: true,
  },
});

if (!todo) {
  throw new Error("COMPLETED_TODO_REQUIRED");
}
```

Todo 하나에 Result 하나만 생성한다.

중복 생성 시 기존 Result 수정 화면으로 이동시키거나 명시적 오류를 반환한다.

---

## 10.2 주요 Action

```text
createTaskResultAction
updateTaskResultAction
deleteTaskResultAction
```

### 입력값

```text
todoId
summary
changeSummary
unexpected
nextAction
needsMeasurement
evidenceUrls
```

### Validation

- Todo 소유권 확인
- Todo 완료 여부 확인
- Result 중복 여부 확인
- Summary 필수
- URL 형식 검증

---

## 10.3 결과 기록 대기 Query

```ts
prisma.todos.findMany({
  where: {
    user_id: userId,
    completed: true,
    result: null,
  },
  orderBy: {
    completed_at: "desc",
  },
});
```

---

## 11. Achievement 구현 (MVP 이후)

## 11.1 생성 방식

성과 생성은 다음 두 흐름을 지원한다.

### Result에서 시작

```text
Result 선택
→ 성과 만들기
→ Achievement 생성
→ AchievementResult 생성
```

### 빈 성과에서 시작

```text
성과 생성
→ 내용 작성
→ 나중에 Result 연결
```

MVP에서는 Result에서 시작하는 흐름을 우선 구현한다.

---

## 11.2 주요 Action

```text
createAchievementAction
updateAchievementAction
deleteAchievementAction
changeAchievementStatusAction
linkResultsToAchievementAction
unlinkResultFromAchievementAction
```

---

## 11.3 생성 트랜잭션

```ts
await prisma.$transaction(async (tx) => {
  const results = await tx.task_result.findMany({
    where: {
      id: {
        in: resultIds,
      },
      user_id: userId,
    },
  });

  if (results.length !== resultIds.length) {
    throw new Error("RESULT_NOT_FOUND");
  }

  const achievement = await tx.achievement.create({
    data: {
      user_id: userId,
      title,
      problem,
      action,
      decision,
      outcome,
    },
  });

  await tx.achievement_result.createMany({
    data: resultIds.map((resultId) => ({
      achievement_id: achievement.id,
      result_id: resultId,
    })),
  });

  return achievement;
});
```

---

## 12. Measurement 구현 (MVP 이후)

## 12.1 생성 조건

Measurement는 Achievement에만 연결한다.

Achievement 소유권을 확인한 뒤 생성한다.

## 12.2 상태 변경

측정 항목이 추가됐다고 자동으로 상태를 변경하지 않는다.

사용자가 성과 상태를 직접 선택한다.

다만 UI에서 다음 제안을 제공할 수 있다.

```text
측정 항목을 추가했습니다.
성과 상태를 '측정 중'으로 변경할까요?
```

## 12.3 확인 예정 Query

```ts
prisma.measurement.findMany({
  where: {
    achievement: {
      user_id: userId,
    },
    due_date: {
      lte: new Date(),
    },
    measured_at: null,
  },
  include: {
    achievement: true,
  },
});
```

---

## 13. Query 설계

## 13.1 Todo Board Query

현재 Category와 Todo를 병렬 조회하는 방식을 유지할 수 있다.

```ts
export async function getTodoBoardData(userId: bigint) {
  const [categories, todos] = await Promise.all([
    getCategoriesByUser(userId),
    getTodosByUser(userId),
  ]);

  return {
    categories,
    todos,
  };
}
```

페이지에서 사용자 ID를 확인하고 Query에 전달한다.

```ts
export default async function Home() {
  const userId = await requireCurrentUserId();
  const result = await getTodoBoardData(userId);

  // ...
}
```

---

## 13.2 Achievement 상세 Query

```ts
prisma.achievement.findFirst({
  where: {
    id: achievementId,
    user_id: userId,
  },
  include: {
    results: {
      include: {
        result: {
          include: {
            todo: true,
            evidence: true,
          },
        },
      },
    },
    measurements: true,
    evidence: true,
  },
});
```

---

## 14. 캐시 정책

## 14.1 1차 구현

인증 사용자 데이터 Query에서는 `unstable_cache`를 제거한다.

이유:

- 사용자별 캐시 키 구성이 필요함
- 인증 Cookie를 사용하는 함수와 캐시의 결합이 복잡함
- 초기 MVP에서는 데이터 규모가 작음
- 정확성이 성능보다 중요함

## 14.2 향후 사용자별 캐시

필요성이 확인되면 사용자 ID 기반 태그를 사용한다.

```ts
const todoTag = (userId: bigint) => `todos:${userId.toString()}`;
const categoryTag = (userId: bigint) => `categories:${userId.toString()}`;
```

Mutation 이후 해당 사용자 태그만 무효화한다.

```ts
revalidateTag(todoTag(userId), "max");
```

## 14.3 페이지 단위 갱신

초기에는 `revalidatePath`를 사용하는 것도 가능하다.

```ts
revalidatePath("/");
revalidatePath("/results");
```

다만 기능이 늘어나면 사용자별 Tag 방식이 더 명확하다.

---

## 15. 삭제 정책

## 15.1 Category

기존 Cascade 삭제를 제거한다.

권장 Relation:

```prisma
category category @relation(
  fields: [category_id],
  references: [id],
  onDelete: Restrict
)
```

Category 삭제 전 Todo 존재 여부를 확인한다.

```text
Todo 없음:
삭제

Todo 있음:
다른 Category로 이동 필요
```

초기에는 기본 `미분류` Category를 생성해 이동시키는 방법도 가능하다.

---

## 15.2 Todo

다음 조건에 따라 처리한다.

```text
Result 없음:
삭제 가능

Result 있음, Achievement 연결 없음:
경고 후 Todo와 Result 함께 삭제 가능

Result 있음, Achievement 연결 있음:
삭제 제한
```

성과 기록을 보존하기 위해 연결된 Result를 먼저 해제하도록 한다.

---

## 15.3 Result

```text
Achievement 연결 없음:
삭제 가능

Achievement 연결 있음:
연결 해제 후 삭제
```

대안으로 Result를 Soft Delete 처리할 수도 있지만 MVP에서는 Hard Delete와 삭제 제한 정책으로 시작한다.

---

## 15.4 Achievement

Achievement를 삭제해도 Result와 Todo는 유지한다.

중간 연결 데이터, Measurement, Achievement Evidence만 Cascade 삭제한다.

---

## 16. 읽기 전용 페이지

`/readonly` 정적 데모는 계획만 있었고 구현되지 않았다. 이후 `isReadOnly` 분기 및 관련 라우트를 정리하면서 범위에서 제외했다.

대안으로 검토했던 안:

```text
/share/[token]:
공유 토큰 기반 읽기 전용 보드
```

공유 기능은 MVP 이후로 미룬다.

---

## 17. 에러 처리

도메인 오류를 명시적으로 구분한다.

예시:

```ts
export class TodoNotFoundError extends Error {}
export class CategoryNotFoundError extends Error {}
export class ResultAlreadyExistsError extends Error {}
export class CompletedTodoRequiredError extends Error {}
export class AchievementNotFoundError extends Error {}
```

Action에서는 사용자용 메시지로 변환한다.

```ts
try {
  // ...
} catch (error) {
  if (error instanceof CompletedTodoRequiredError) {
    return {
      ok: false,
      error: "완료한 작업에만 결과를 기록할 수 있습니다.",
    };
  }

  return {
    ok: false,
    error: "결과를 저장하지 못했습니다.",
  };
}
```

---

## 18. Validation

현재 FormData 값을 직접 검사하는 방식을 사용하고 있다.

MVP에서는 기존 방식을 유지할 수 있다.

기능이 늘어나면 Zod 도입을 고려한다.

예시:

```ts
const CreateResultSchema = z.object({
  todoId: z.coerce.bigint(),
  summary: z.string().trim().min(1),
  changeSummary: z.string().trim(),
  unexpected: z.string().trim(),
  nextAction: z.string().trim(),
  needsMeasurement: z.coerce.boolean(),
});
```

Zod 도입은 Result 기능부터 적용하고 기존 Todo Action은 점진적으로 이전할 수 있다.

---

## 19. BigInt 직렬화

현재 Prisma BigInt 값을 별도 Serialize 함수로 변환한다.

신규 모델에서도 동일한 문제가 발생하므로 다음 중 하나로 통일한다.

### 기존 방식 유지

Service 반환 전에 `serializeBigInt` 적용

### DTO 명시

```ts
export interface TaskResultDto {
  id: number;
  todoId: number;
  summary: string;
}
```

Service 또는 Mapper에서 Prisma 객체를 DTO로 변환한다.

장기적으로는 DTO Mapper 방식이 타입 안정성과 API 경계를 명확히 하는 데 유리하다.

---

## 20. UI 상태 관리

Zustand는 다음 용도로만 제한적으로 사용한다.

- Category 필터
- 전역 Modal
- 다중 Result 선택 상태

서버 데이터 자체를 Zustand에 복제하지 않는다.

서버 데이터는 Server Component Query 결과를 기준으로 한다.

다중 선택 예시:

```text
features/result/provider.tsx

selectedResultIds
toggleResult
clearSelection
selectAll
```

성과 생성 페이지로 이동할 때 Query String을 사용할 수도 있다.

```text
/achievements/new?resultIds=1,2,3
```

Result 수가 많아질 경우 Session Store 또는 서버 Draft를 검토한다.

---

## 21. 모달 정책

현재 공통 Modal 구조를 유지한다.

모달에 적합한 기능:

- Todo 생성
- Todo 수정
- Result 생성
- Result 수정
- 간단한 Measurement 생성
- 삭제 확인

별도 페이지가 적합한 기능:

- Achievement 생성
- Achievement 상세
- Achievement 수정
- 주간 회고

성과 작성은 입력 항목이 많으므로 모달보다 페이지가 적합하다.

---

## 22. 테스트 전략

## 22.1 단위 테스트

우선 대상:

- Todo 완료 상태 변경
- Result 생성 조건
- Result 중복 생성 방지
- Achievement와 Result 소유권 검증
- 삭제 정책
- 상태 변경

## 22.2 통합 테스트

Prisma 테스트 데이터베이스 또는 별도 Supabase 테스트 환경을 사용한다.

시나리오:

```text
사용자 A는 사용자 B의 Todo를 조회할 수 없음
사용자 A는 사용자 B의 Todo를 수정할 수 없음
미완료 Todo에 Result 생성 불가
Todo 하나에 Result 두 개 생성 불가
다른 사용자 Result를 Achievement에 연결 불가
```

## 22.3 E2E 테스트

핵심 사용자 흐름:

```text
로그인
→ Todo 생성
→ Todo 완료
→ Result 기록
→ Result 여러 개 선택
→ Achievement 생성
→ Measurement 추가
→ Achievement 확인
```

추가 시나리오:

- 완료 취소
- 결과 기록 대기
- Category 삭제 제한
- 연결된 Result 삭제 제한
- 인증 만료 후 읽기 전용 또는 로그인 이동

---

## 23. 데이터 마이그레이션

## 23.1 사용자 ID 백필

기존 Category와 Todo에 `user_id`를 바로 필수로 추가하면 기존 데이터 때문에 마이그레이션이 실패할 수 있다.

다음 순서로 진행한다.

### 1단계

Nullable 필드 추가

```prisma
user_id BigInt?
```

### 2단계

기존 데이터에 기본 사용자 ID 입력

```sql
UPDATE category
SET user_id = :existing_user_id
WHERE user_id IS NULL;

UPDATE todos
SET user_id = :existing_user_id
WHERE user_id IS NULL;
```

### 3단계

Relation과 Index 추가

### 4단계

필수 필드로 변경

```prisma
user_id BigInt
```

---

## 23.2 Todo 완료 시각

기존 `completed = true` 데이터가 없다면 그대로 추가한다.

기존 완료 데이터가 있다면 다음 정책 중 하나를 선택한다.

- `completed_at = created_at`
- 마이그레이션 실행 시각
- `null` 유지

정확한 완료 시각을 알 수 없으므로 `null` 유지가 가장 정직하다.

---

## 23.3 Category Cascade 제거

Foreign Key 정책 변경 전에 기존 데이터를 확인한다.

모든 Todo에 Category가 연결되어 있으므로 Restrict 변경 자체는 문제없다.

이후 Category Service의 삭제 로직을 먼저 변경하고 Migration을 적용한다.

---

## 24. 구현 단계 (최종 그림)

> 0~2단계 = MVP. 3단계 이후는 [[mvp-plan|MVP 계획]]에서 실사용 검증 후 착수.

## 0단계: 기반 정리

작업:

1. `lib/auth/session.ts` 추가
2. 인증 사용자 ID 공통화
3. Category에 `user_id` 추가
4. Todo에 `user_id` 추가
5. 기존 데이터 백필
6. Query에 사용자 조건 추가
7. 수정 및 삭제 소유권 검증
8. 전역 캐시 제거 또는 사용자별 분리
9. Todo `text` 선택값으로 변경

완료 조건:

- 사용자는 자신의 데이터만 조회할 수 있다.
- 다른 사용자의 데이터 수정 및 삭제가 불가능하다.
- 기존 데이터가 유지된다.

---

## 1단계: Todo 완료

작업:

1. Todo Type에 `completed`, `completed_at` 추가
2. 완료 Action 추가
3. 완료 Service 추가
4. Todo 카드 Checkbox 추가
5. 진행 중 및 완료 필터 추가
6. 완료 CTA 추가
7. 완료 취소 구현

완료 조건:

- 새로고침 후 완료 상태 유지
- 완료 시각 기록
- 완료 취소 가능
- 완료 작업 필터 가능

---

## 2단계: Result

작업:

1. `task_result` 모델 추가
2. Result Feature 추가
3. Result 생성 및 수정 Action
4. 완료 직후 Result CTA
5. 결과 기록 대기 Query
6. `/results` 페이지
7. Evidence URL 추가

완료 조건:

- 완료 Todo에 Result 생성 가능
- 미완료 Todo에는 생성 불가
- Todo 하나에 Result 하나만 생성
- 결과 기록 대기 목록 확인 가능

---

## 3단계: Achievement

작업:

1. `AchievementStatus` 추가
2. `achievement` 모델 추가
3. `achievement_result` 모델 추가
4. Result 다중 선택
5. 성과 생성 페이지
6. 성과 목록
7. 성과 상세
8. Result 연결 및 해제

완료 조건:

- 여러 Result로 Achievement 생성 가능
- 다른 사용자 Result 연결 불가
- 연결된 Todo와 Result 확인 가능
- 상태 변경 가능

---

## 4단계: Measurement와 Review

작업:

1. `measurement` 모델
2. 측정 생성 및 수정
3. 예정일이 지난 측정 Query
4. `/review` 페이지
5. 주간 통계
6. 결과 기록 대기 요약

완료 조건:

- Achievement에 측정 항목 연결
- 확인 예정 항목 조회
- 주간 완료 및 성과 요약 확인

---

## 5단계: AI 보조

작업:

- Result 요약
- Achievement 초안 생성
- 부족한 근거 질문
- 측정 지표 추천
- 이력서 문장 생성
- 포트폴리오 문단 생성

AI 결과는 저장 전에 반드시 사용자가 확인한다.

---

## 25. Pull Request 분리 제안

변경 범위가 크므로 하나의 PR로 구현하지 않는다.

### PR 1

```text
사용자별 Category와 Todo 데이터 분리
```

### PR 2

```text
Todo 완료 및 완료일 기능
```

### PR 3

```text
Task Result 모델과 결과 기록 화면
```

### PR 4

```text
Achievement 모델과 Result 연결
```

### PR 5

```text
Measurement와 주간 회고
```

### PR 6

```text
테스트 및 삭제 정책 보강
```

각 PR은 독립적으로 배포 가능한 상태를 유지한다.

---

## 26. 기술적 위험

## 26.1 사용자 데이터 유출

가장 높은 위험이다.

모든 Query와 Mutation에 사용자 조건을 적용하고 통합 테스트로 검증해야 한다.

## 26.2 기존 데이터 마이그레이션 실패

Nullable 추가, 데이터 백필, Not Null 전환 순서를 지켜야 한다.

## 26.3 Cascade 삭제에 의한 기록 손실

Category와 Todo 삭제 정책을 변경하기 전에 Result를 추가하면 안 된다.

## 26.4 복잡한 UI 상태

Result 다중 선택과 Achievement 연결을 Zustand에 과도하게 저장하지 않는다.

## 26.5 AI 과장

AI가 Result를 실제로 확인된 Achievement처럼 표현하지 않도록 상태와 근거를 명확히 구분해야 한다.

## 26.6 캐시와 인증 충돌

인증 사용자 데이터에 전역 캐시를 적용하지 않는다.

사용자별 캐시를 적용하기 전까지는 정확성을 우선한다.

---

## 27. 최종 권장 우선순위

> 1~5 = MVP. 6~10 = MVP 이후.

```text
1. 사용자별 데이터 소유권
2. 전역 캐시 및 읽기 전용 페이지 정리
3. Todo 완료 기능
4. Result 기록
5. 결과함
6. Achievement 연결
7. Measurement
8. 주간 회고
9. AI 보조
10. GitHub 연동
```

Result나 Achievement 모델부터 먼저 추가하지 않는다.

현재 구조에서는 다음 기반이 먼저 보장되어야 한다.

```text
사용자 데이터 경계
완료 상태
삭제 정책
캐시 정책
```

---

## 28. 결론

기존 Bincha는 Todo CRUD, Category 필터, 인증, Prisma, Server Action, Feature 단위 구조를 이미 갖추고 있다.

따라서 신규 프로젝트를 다시 만드는 것보다 현재 구조를 점진적으로 확장하는 것이 적절하다.

기술적으로 가장 중요한 변화는 단순한 성과 모델 추가가 아니다.

```text
User별 데이터 분리
→ Todo 완료 도메인 복원
→ Result 추가
→ Achievement 연결
→ Measurement와 Review 확장
```

이 순서를 지키면 기존 Bincha의 단순함을 유지하면서도, 완료한 작업을 장기적인 성과 기록으로 전환하는 제품으로 안정적으로 발전시킬 수 있다.
