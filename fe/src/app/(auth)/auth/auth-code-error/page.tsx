import Link from 'next/link';

export default function AuthCodeErrorPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 p-6 text-center">
      <h1 className="text-lg font-semibold">로그인에 실패했습니다.</h1>
      <p className="text-sm text-gray-500">
        인증 과정에서 문제가 발생했습니다.
        <br />
        잠시 후 다시 시도해 주세요.
      </p>

      <div className="flex gap-2">
        <Link
          href="/login"
          className="rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          로그인 다시 시도
        </Link>
        <Link
          href="/"
          className="rounded-md border px-4 py-2 hover:bg-gray-100"
        >
          홈으로
        </Link>
      </div>
    </div>
  );
}
