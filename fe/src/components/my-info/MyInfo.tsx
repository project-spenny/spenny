'use client';

import { Separator } from '@/components/ui/separator';
import LogoutButton from './LogoutButton';
import { useState } from 'react';
import { ProfileFormValues } from '@/schemas/profile';
import ProfileEdit from './ProfileEdit';
import ProfileView from './ProfileView';

export default function MyInfo() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<ProfileFormValues>({
    nickname: '짱구',
    birth_date: '2000-01-01',
    gender: 'male',
  });

  const handleSaveProfile = async (values: ProfileFormValues) => {
    // 이후 supabase 연결 예정
    setProfile(values);
    setIsEditing(false);
  };

  return (
    <div className="flex flex-col gap-6 p-4">
      {/* 사용자 정보 영역 */}
      {isEditing ? (
        <ProfileEdit profile={profile} onSave={handleSaveProfile} />
      ) : (
        <ProfileView profile={profile} onEdit={() => setIsEditing(true)} />
      )}
      <Separator />
      {/* 로그아웃 */}
      <section className="flex flex-col gap-2">
        <LogoutButton />
      </section>
    </div>
  );
}
