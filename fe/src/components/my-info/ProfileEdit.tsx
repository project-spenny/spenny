'use client';

import { ProfileFormValues } from '@/schemas/profile';
import ProfileForm from '../onboarding/ProfileForm';

type Props = {
  profile: ProfileFormValues; // 기존 프로필 값
  onSave: (values: ProfileFormValues) => void;
};

export default function ProfileEdit({ profile, onSave }: Props) {
  return <ProfileForm defaultValues={profile} onSubmit={onSave} />;
}
