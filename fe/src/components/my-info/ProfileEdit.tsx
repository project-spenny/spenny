'use client';

import { ProfileFormValues } from '@/schemas/profile';
import ProfileForm from '../onboarding/ProfileForm';
import { Button } from '@/components/ui/button';

type Props = {
  profile: ProfileFormValues; // 기존 프로필 값
  onSave: (values: ProfileFormValues) => void;
  onCancel: () => void;
};

export default function ProfileEdit({ profile, onSave, onCancel }: Props) {
  return (
    <ProfileForm defaultValues={profile} onSubmit={onSave}>
      {({ isDirty, isSubmitting }) => (
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="flex-1"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            취소
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={!isDirty || isSubmitting}
          >
            저장
          </Button>
        </div>
      )}
    </ProfileForm>
  );
}
