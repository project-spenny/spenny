'use client';

import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { Profile, ProfilePatchValues } from '@/schemas/profile';
import { Separator } from '@/components/ui/separator';
import LogoutButton from './LogoutButton';
import ProfileEdit from './ProfileEdit';
import ProfileView from './ProfileView';
import MyInfoSkeleton from './MyInfoSkeleton';
import { toast } from 'sonner';
import ModeToggle from '../common/ModeToggle';
import { useAuth } from '@/providers/AuthProvider';

// 프로필 수정 함수
async function updateProfile(values: ProfilePatchValues): Promise<Profile> {
  const res = await fetch('/api/profile', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(values),
  });

  if (!res.ok) throw new Error('프로필 수정 실패');
  return res.json();
}

export default function MyInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const { userId, profile, isLoading, error, setProfile } = useAuth();

  // 프로필 수정 뮤테이션
  const { mutateAsync } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      setProfile(updated);
      toast.success('프로필이 저장되었어요.');
    },
    onError: () => {
      toast.error('프로필 저장에 실패했어요. 잠시 후 다시 시도해주세요.');
    },
  });

  // 프로필 저장 핸들러
  const handleSave = async (values: ProfilePatchValues) => {
    await mutateAsync(values);
    setIsEditing(false);
  };

  if (!userId) return null;
  if (!profile) return null;

  if (isLoading) {
    return <MyInfoSkeleton />;
  }

  if (error) {
    return (
      <div className="p-4 text-sm text-red-500">
        프로필을 불러오지 못했습니다.
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* 사용자 정보 영역 */}
      <div className="flex flex-col gap-6 p-4">
        {isEditing ? (
          <ProfileEdit
            profile={profile}
            onSave={handleSave}
            onCancel={() => setIsEditing(false)}
          />
        ) : (
          <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
        )}
      </div>

      <Separator />

      {/* 설정 영역 */}
      <div className="flex items-center justify-between p-4">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">다크 모드</p>
          <p className="text-muted-foreground text-xs">
            화면 테마를 변경할 수 있어요.
          </p>
        </div>

        <ModeToggle />
      </div>

      {/* 로그아웃 */}
      <div className="mt-auto ml-auto">
        <LogoutButton />
      </div>
    </div>
  );
}
