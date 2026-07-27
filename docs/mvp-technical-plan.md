# Bincha MVP 기술 계획

> 이 문서는 [[mvp-plan|MVP 계획]](P0 사용자 분리 + P1 할 일 완료 + P2 결과 기록)을 구현하기 위한 기술 범위만 정의한다.
> 전체 아키텍처와 Achievement/Measurement/Evidence 이후 단계는 [[technical-proposal|기술 제안서(최종 Plan)]]을 참고한다.

---

## 1. 현재 구조의 문제 (그대로 적용)

- **사용자 데이터 경계 부재**: Todo/Category 조회에 사용자 조건이 없다. Result를 추가하기 전에 반드시 먼저 고친다.
- **완료 기능 미연결**: `completed` 필드는 있지만 Type/Action/Service/UI 어디서도 쓰이지 않는다.
- **전역 캐시**: Todo/Category가 사용자 구분 없는 전역 캐시(`unstable_cache`)를 쓴다. 사용자별 데이터가 생기면 그대로 두면 안 된다.
- **Category cascade 삭제**: Category 삭제 시 Todo가 연쇄 삭제된다. Result가 생기면 결과 기록도 함께 사라질 위험이 있다.
- **인증 사용자 ID 조회 함수 위치**: 현재 auth action 파일 내부에 있다. `lib/auth/session.ts`로 분리해 다른 feature에서 재사용한다.

---

## 2. 목표 아키텍처 (MVP)

```text
User
├─ Category
│  └─ Todo
│     └─ TaskResult (0..1)
```

Achievement/Measurement/Evidence 모델은 만들지 않는다.

---

## 3. 데이터 모델

### 3.1 User (변경 없음)

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
}
```

### 3.2 Category

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

### 3.3 Todo

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
  category     category    @relation(fields: [category_id], references: [id], onDelete: Restrict)
  result       task_result?

  @@index([user_id, completed])
  @@index([category_id])
}
```

`text`는 선택 필드로 변경한다(기존엔 필수 검증하지만 UI는 빈 값을 이미 허용).
`category` FK는 `onDelete: Restrict`로 변경한다(Cascade 제거).

### 3.4 Task Result

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
  evidence_url      String   @default("")
  needs_measurement Boolean  @default(false)

  todo              todos    @relation(fields: [todo_id], references: [id], onDelete: Cascade)
  user              user     @relation(fields: [user_id], references: [id])

  @@index([user_id])
  @@index([needs_measurement])
}
```

Evidence는 별도 모델/enum 없이 `evidence_url` 텍스트 필드 하나로 시작한다.

---

## 4. 사용자 인증과 데이터 소유권

### 4.1 공통 Session 유틸리티

```text
lib/auth/session.ts
```

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

### 4.2 조회 정책

모든 사용자 데이터 조회에 `user_id` 조건을 적용한다.

```ts
const userId = await requireCurrentUserId();

return prisma.todos.findMany({
  where: { user_id: userId },
});
```

### 4.3 수정 및 삭제 정책

ID만으로 수정·삭제하지 않는다.

```ts
const deleted = await prisma.todos.deleteMany({
  where: { id, user_id: userId },
});

if (deleted.count === 0) {
  throw new Error("TODO_NOT_FOUND");
}
```

### 4.4 Category 소유권 검증

```ts
const category = await prisma.category.findFirst({
  where: { id: categoryId, user_id: userId },
});

if (!category) {
  throw new Error("CATEGORY_NOT_FOUND");
}
```

---

## 5. Feature 구조

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
├─ modal/
└─ shared/
```

`achievement/`, `measurement/`, `evidence/`, `review/`는 만들지 않는다.

---

## 6. 페이지 구조

```text
app/
├─ page.tsx           Todo 목록
├─ results/
│  └─ page.tsx        결과 기록 대기 및 결과 목록
├─ login/
│  └─ page.tsx
└─ readonly/
   └─ page.tsx
```

`/achievements`, `/review`는 만들지 않는다.

---

## 7. Todo 완료 기능

### 7.1 Action

```ts
export async function toggleTodoCompletedAction(todoId: number) {
  try {
    const userId = await requireCurrentUserId();
    const todo = await toggleTodoCompleted({ todoId, userId });
    return { ok: true, todo };
  } catch (error) {
    return { ok: false, error: "완료 상태를 변경하지 못했습니다." };
  }
}
```

### 7.2 Service

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
      where: { id: todoId, user_id: userId },
    });

    if (!todo) {
      throw new Error("TODO_NOT_FOUND");
    }

    const completed = !todo.completed;

    return tx.todos.update({
      where: { id: todo.id },
      data: {
        completed,
        completed_at: completed ? new Date() : null,
      },
    });
  });
}
```

### 7.3 UI 동작

완료 처리 후 다음 CTA를 노출한다.

```text
할 일을 완료했습니다.
[결과 기록] [실행 취소]
```

완료 상태 자체는 Result 생성 여부와 독립적으로 저장한다.

---

## 8. Result 구현

### 8.1 생성 조건

Result는 완료된 Todo에만 생성하도록 제한한다.

```ts
const todo = await prisma.todos.findFirst({
  where: { id: todoId, user_id: userId, completed: true },
});

if (!todo) {
  throw new Error("COMPLETED_TODO_REQUIRED");
}
```

Todo 하나에 Result 하나만 생성한다. 중복 생성 시 기존 Result 수정 화면으로 이동시키거나 명시적 오류를 반환한다.

### 8.2 주요 Action

```text
createTaskResultAction
updateTaskResultAction
deleteTaskResultAction
```

입력값: `todoId, summary, changeSummary, unexpected, nextAction, needsMeasurement, evidenceUrl`

Validation: Todo 소유권 확인 / Todo 완료 여부 확인 / Result 중복 여부 확인 / Summary 필수 / URL 형식 검증

### 8.3 결과 기록 대기 Query

```ts
prisma.todos.findMany({
  where: {
    user_id: userId,
    completed: true,
    result: null,
  },
  orderBy: { completed_at: "desc" },
});
```

---

## 9. Query 설계

```ts
export async function getTodoBoardData(userId: bigint) {
  const [categories, todos] = await Promise.all([
    getCategoriesByUser(userId),
    getTodosByUser(userId),
  ]);

  return { categories, todos };
}
```

```ts
export default async function Home() {
  const userId = await requireCurrentUserId();
  const result = await getTodoBoardData(userId);
  // ...
}
```

---

## 10. 캐시 정책

인증 사용자 데이터 Query에서는 `unstable_cache`를 제거한다. 이유: 사용자별 캐시 키 구성 필요, 인증 Cookie 함수와 캐시 결합 복잡, MVP 데이터 규모가 작음, 정확성이 성능보다 중요.

초기에는 `revalidatePath`로 충분하다.

```ts
revalidatePath("/");
revalidatePath("/results");
```

사용자별 캐시 태그(`todos:{userId}` 등)는 필요성이 확인된 뒤(MVP 이후) 도입한다.

---

## 11. 삭제 정책

### Category
Cascade 삭제를 제거하고 `onDelete: Restrict`로 변경한다. Todo가 있으면 다른 Category로 이동시키거나 삭제를 취소하게 한다.

### Todo
```text
Result 없음: 삭제 가능
Result 있음: 경고 후 Todo와 Result 함께 삭제 가능
```

### Result
Hard Delete로 시작한다(Soft Delete는 MVP 이후 검토).

---

## 12. 읽기 전용 페이지

`/readonly`는 현재 실제 Todo 데이터를 조회한다. 사용자 데이터 분리 이후 인증되지 않은 사용자가 실제 데이터를 보지 않도록, 하드코딩된 정적 데모로 전환한다.

---

## 13. 에러 처리

```ts
export class TodoNotFoundError extends Error {}
export class CategoryNotFoundError extends Error {}
export class ResultAlreadyExistsError extends Error {}
export class CompletedTodoRequiredError extends Error {}
```

```ts
try {
  // ...
} catch (error) {
  if (error instanceof CompletedTodoRequiredError) {
    return { ok: false, error: "완료한 작업에만 결과를 기록할 수 있습니다." };
  }
  return { ok: false, error: "결과를 저장하지 못했습니다." };
}
```

---

## 14. BigInt 직렬화

기존 `serializeBigInt` 방식을 그대로 유지한다. DTO Mapper 전환은 MVP 이후 검토.

---

## 15. UI 상태 관리

Zustand는 Category 필터, 전역 Modal 용도로만 제한 사용한다. 서버 데이터는 Zustand에 복제하지 않는다. Result 다중 선택 상태(Achievement 연결용)는 MVP 범위가 아니므로 만들지 않는다.

---

## 16. 데이터 마이그레이션

### 16.1 마이그레이션 도구

`prisma migrate`를 도입한다. 현재 `prisma/migrations/`가 없어 스키마 변경 이력이 남지 않는 상태이며, MVP 3개 PR에 걸쳐 스키마가 계속 바뀌므로 이력 관리가 필요하다.

```bash
# 현재 스키마를 baseline으로 등록
prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma \
  --script > prisma/migrations/0_init/migration.sql
prisma migrate resolve --applied 0_init
```

이후 스키마 변경은 `prisma migrate dev`로 진행한다.

### 16.2 사용자 ID 백필

보존할 기존 데이터가 없으므로 **백필 단계는 생략한다.** `user_id`를 처음부터 `NOT NULL`로 추가한다.

```prisma
user_id BigInt
```

기존 category/todos 레코드는 마이그레이션 시 삭제된다.

> 참고: 보존할 데이터가 있었다면 Nullable 추가 → `UPDATE` 백필 → `NOT NULL` 전환 순서가 필요하다. 향후 운영 데이터가 쌓인 뒤 유사한 필수 컬럼을 추가할 때는 이 순서를 지킨다.

### 16.3 완료일

기존 `completed = true` 데이터가 없으므로 `completed_at`을 그대로 추가한다.

---

## 17. 테스트

`node --test` + `tsx`로 서비스 계층을 직접 호출한다. 프로덕션 DB와 분리하기 위해 같은 Supabase 프로젝트의 `test` schema를 쓴다.

### 셋업

1. `.env`를 복사해 `.env.test`를 만든다 (gitignore 대상, 커밋하지 않음)
2. `.env.test`의 연결 문자열에 schema를 붙인다
   - `DATABASE_URL`: 기존 `?pgbouncer=true` 뒤에 `&schema=test`
   - `DIRECT_URL`: `?schema=test` (이미 쿼리가 있으면 `&schema=test`)
3. 테스트 스키마에 마이그레이션 배포:
   ```bash
   # dotenv-cli가 있으면
   pnpm exec dotenv -e .env.test -- prisma migrate deploy
   # 없으면 환경변수로 직접 로드
   set -a && source .env.test && set +a && pnpm exec prisma migrate deploy
   ```
4. 테스트 실행: `pnpm test`

### 커버 범위

- Todo 완료/완료 취소 상태 변경
- Result 생성 조건(완료 안 된 Todo 거부, 중복 생성 거부)
- 소유권 검증: 다른 사용자 Todo 조회/수정/삭제 불가

프레임워크 선택과 통합/E2E 테스트는 MVP 이후 검토([[technical-proposal]] 22장 참고).

---

## 18. 구현 단계

### 0단계: 기반 정리
1. `prisma migrate` baseline 등록 (16.1)
2. `lib/auth/session.ts` 추가, 인증 사용자 ID 공통화
3. Category/Todo에 `user_id` 추가 (NOT NULL, 백필 없음)
4. Query에 사용자 조건 추가, 수정/삭제 소유권 검증
5. 전역 캐시 제거 (`todo.queries.ts` / `category.queries.ts` 삭제)
6. `/readonly` 정적 데모 전환
7. Todo `text` 선택값으로 변경
8. Category FK `Restrict`로 변경

**완료 조건**: 사용자는 자신의 데이터만 조회할 수 있다. 다른 사용자의 데이터 수정/삭제 불가. 기존 데이터 유지.

### 1단계: Todo 완료
1. Type에 `completed`, `completed_at` 추가
2. 완료 Action/Service 추가
3. Todo 카드 Checkbox, 완료 CTA 추가
4. 진행 중/완료 필터 추가
5. 완료 취소 구현

**완료 조건**: 새로고침 후 완료 상태 유지, 완료 시각 기록, 완료 취소 가능, 필터 가능.

### 2단계: Result
1. `task_result` 모델 추가
2. Result Feature 추가 (`result.actions.ts`, `result.service.ts`, `result.queries.ts`, `types.ts`)
3. 완료 직후 Result CTA
4. 결과 기록 대기 Query
5. `/results` 페이지
6. Evidence URL 필드 추가

**완료 조건**: 완료 Todo에 Result 생성 가능, 미완료 Todo엔 생성 불가, Todo당 Result 하나, 결과 기록 대기 목록 확인 가능.

---

## 19. PR 분리

```text
PR 1: 사용자별 Category와 Todo 데이터 분리
PR 2: Todo 완료 및 완료일 기능
PR 3: Task Result 모델과 결과 기록 화면
```

각 PR은 독립적으로 배포 가능한 상태를 유지한다.

---

## 20. 기술적 위험

- **사용자 데이터 유출**: 가장 높은 위험. 모든 Query/Mutation에 사용자 조건을 적용하고 검증한다.
- **카테고리 이름 중복**: `@@unique([user_id, category_name])` 도입 시 같은 사용자에 중복 이름이 있으면 실패한다. 초기 데이터를 밀고 시작하므로 MVP에서는 문제되지 않지만, 생성 Action에서 중복 이름을 사용자 메시지로 처리해야 한다.
- **Cascade 삭제에 의한 기록 손실**: Category/Todo 삭제 정책을 먼저 바꾼 뒤에 Result를 추가한다(순서 중요).
- **캐시와 인증 충돌**: 사용자별 캐시를 적용하기 전까지 전역 캐시를 쓰지 않는다.
