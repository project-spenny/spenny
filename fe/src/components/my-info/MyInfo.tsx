'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import { Profile, ProfilePatchValues } from '@/schemas/profile';
import { Separator } from '@/components/ui/separator';
import LogoutButton from './LogoutButton';
import ProfileEdit from './ProfileEdit';
import ProfileView from './ProfileView';

// 프로필 조회 함수
async function fetchProfile(): Promise<Profile> {
  const res = await fetch('/api/profile', { method: 'GET' });
  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
}

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

  // 프로필 데이터 조회
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    retry: false,
  });

  const queryClient = useQueryClient();

  // 프로필 수정 뮤테이션
  const { mutateAsync } = useMutation({
    mutationFn: updateProfile,
    onSuccess: (updated) => {
      queryClient.setQueryData(['profile'], updated);
    },
  });

  // 프로필 저장 핸들러
  const handleSave = async (values: ProfilePatchValues) => {
    await mutateAsync(values);
    setIsEditing(false);
  };

  if (isLoading) {
    return <div className="p-4">로딩 중…</div>;
  }

  if (isError || !profile) {
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

      {/* 로그아웃 */}
      <div className="mt-auto ml-auto">
        <LogoutButton />
      </div>
    </div>
  );
}
