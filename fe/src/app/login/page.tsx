"use client";

import { createClient } from "@/utils/supabase/client";

export default function LoginPage() {
  const supabase = createClient();

  // Google OAuth 로그인
  const signInWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  };


  // Kakao OAuth 로그인
  const signInWithKakao = async () => {
  await supabase.auth.signInWithOAuth({
    provider: "kakao",
    options: {
      redirectTo: `${location.origin}/auth/callback`,
    },
  });
};

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4">
      <button
        onClick={signInWithGoogle}
        className="rounded-md border px-4 py-2 hover:bg-gray-100"
      >
        Google 로그인
      </button>
      <button
        onClick={signInWithKakao}
        className="rounded-md border px-4 py-2 hover:bg-gray-100"
      >
        Kakao 로그인
      </button>
    </div>
  );
}
