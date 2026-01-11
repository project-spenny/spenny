'use client';

import MyInfo from '@/components/my-info/MyInfo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ResponsivePanel from '../panel/ResponsivePanel';
import { useQuery } from '@tanstack/react-query';
import { Profile } from '@/schemas/profile';
import Image from 'next/image';

async function fetchProfile(): Promise<Profile> {
  const res = await fetch('/api/profile', { method: 'GET' });
  if (!res.ok) throw new Error('프로필 조회 실패');
  return res.json();
}

export default function ProfilePanelTrigger() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchProfile,
    retry: false,
  });
  return (
    <ResponsivePanel
      trigger={
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src={profile?.profile_image_url ?? undefined}
              alt="프로필"
            />
            <AvatarFallback className="flex items-center justify-center bg-white">
              <Image src="/logo_pig.svg" alt="" width={20} height={20} />
            </AvatarFallback>
          </Avatar>
        </Button>
      }
    >
      <MyInfo />
    </ResponsivePanel>
  );
}
