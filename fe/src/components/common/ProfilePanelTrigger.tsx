'use client';

import MyInfo from '@/components/my-info/MyInfo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ResponsivePanel from '../panel/ResponsivePanel';
import Image from 'next/image';
import { useAuth } from '@/providers/AuthProvider';

export default function ProfilePanelTrigger() {
  const { profile } = useAuth();

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
