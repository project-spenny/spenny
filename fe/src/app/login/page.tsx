"use client";

import { supabase } from "@/utils/supabase/client";

type Provider = "google" | "kakao";

export default function LoginPage() {

    // OAuth 로그인 처리 함수
  const signInWithProvider = async (provider: Provider) => {
    await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <button
        onClick={() => signInWithProvider("google")}
        className="rounded-md border px-4 py-2 hover:bg-gray-100"
      >
        Google 로그인
      </button>
      <button
        onClick={() => signInWithProvider("kakao")}
        className="rounded-md border px-4 py-2 hover:bg-gray-100"
      >
        Kakao 로그인
      </button>
    </div>
  );
}
