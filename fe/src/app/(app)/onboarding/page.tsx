'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';

export default function OnboardingPage() {
  return (
    <div className="fixed inset-0 z-50">
      {/* 배경 클릭 방지 */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

      <div className="relative flex min-h-dvh items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* 기본 정보 입력 영역 */}
          <Card>
            <CardHeader className="space-y-2">
              <CardTitle className="text-xl">기본 정보 설정</CardTitle>
              <CardDescription>
                서비스를 시작하기 위해 필수 정보만 먼저 입력해주세요.
              </CardDescription>
            </CardHeader>

            <CardContent></CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
