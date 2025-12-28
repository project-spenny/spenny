'use client';

import { Button } from '@/components/ui/button';
import { Profile } from '@/schemas/profile';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

type ProfileViewProps = {
  profile: Profile;
  onEdit: () => void;
};

const genderLabel = (gender: Profile['gender']) => {
  return gender === 'male' ? '남' : '여';
};

export default function ProfileView({ profile, onEdit }: ProfileViewProps) {
  return (
    <section className="flex gap-4">
      {/* 왼쪽: 프로필 이미지 */}
      <div className="shrink-0">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src={profile.profile_image_url ?? undefined}
            alt="프로필 이미지"
          />
          <AvatarFallback>
            {profile.nickname?.[0]?.toUpperCase() ?? 'ME'}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* 오른쪽: 정보 */}
      <div className="flex min-w-0 flex-1 flex-col gap-3">
        <div className="flex flex-col gap-1">
          {/* 닉네임 */}
          <p className="truncate text-base font-semibold">{profile.nickname}</p>

          {/* 생년월일 / 성별 */}
          <div className="text-muted-foreground flex flex-col gap-1 text-sm">
            <div className="flex gap-2">
              <span className="shrink-0">생년월일 :</span>
              <span className="text-foreground/80">{profile.birth_date}</span>
            </div>

            <div className="flex gap-2">
              <span className="shrink-0">성별 :</span>
              <span className="text-foreground/80">
                {genderLabel(profile.gender)}
              </span>
            </div>
          </div>
        </div>

        {/* 수정 버튼 */}
        <div className="flex justify-end">
          <Button size="sm" variant="outline" onClick={onEdit}>
            정보 수정
          </Button>
        </div>
      </div>
    </section>
  );
}
