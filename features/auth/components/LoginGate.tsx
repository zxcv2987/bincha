import LoginFormContent from "@/features/auth/components/LoginFormContent";

export default function LoginGate() {
  return (
    <main className="flex w-full justify-center py-16">
      <section
        className="flex w-full max-w-xs flex-col gap-6"
        aria-labelledby="login-heading"
      >
        <div className="flex flex-col gap-1.5">
          <h2 id="login-heading" className="text-2xl font-bold text-zinc-700">
            로그인
          </h2>
          <p className="text-sm text-zinc-500">
            비밀번호를 입력하면 할 일과 결과 기록을 확인할 수 있습니다.
          </p>
        </div>
        <LoginFormContent className="w-full" />
      </section>
    </main>
  );
}
