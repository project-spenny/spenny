'use client';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

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

            <CardContent>
              <form className="space-y-6">
                <div className="space-y-2">
                  <Label>닉네임</Label>
                  <Input id="nickname" placeholder="닉네임을 입력해주세요." />
                </div>

                <div className="space-y-2">
                  <Label>생년월일</Label>
                  <Input id="birth" placeholder="YYYY-MM-DD" />
                </div>

                <div className="flex items-center gap-6">
                  <Label>성별</Label>
                  <RadioGroup defaultValue="none" className="flex gap-6">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="male" id="male" />
                      <Label>남</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="female" id="female" />
                      <Label>여</Label>
                    </div>
                  </RadioGroup>
                </div>

                <Button type="submit" className="w-full">
                  저장하고 시작하기
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
