'use client';

import MyInfo from '@/components/my-info/MyInfo';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import ResponsivePanel from '../panel/ResponsivePanel';

export default function ProfilePanelTrigger() {
  return (
    <ResponsivePanel
      trigger={
        <Button variant="ghost" size="icon" className="rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage src="" alt="프로필" />
            <AvatarFallback>ME</AvatarFallback>
          </Avatar>
        </Button>
      }
    >
      <MyInfo />
    </ResponsivePanel>
  );
}
