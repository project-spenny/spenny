'use client';

import { Profile, ProfilePatchValues } from '@/schemas/profile';
import ProfileForm from '../onboarding/ProfileForm';
import { Button } from '@/components/ui/button';
import { Spinner } from '../ui/spinner';

type Props = {
  profile: Profile; // 기존 프로필 값
  onSave: (values: ProfilePatchValues) => Promise<void>;
  onCancel: () => void;
};

export default function ProfileEdit({ profile, onSave, onCancel }: Props) {
  return (
    <ProfileForm
      defaultValues={{
        nickname: profile.nickname,
        birth_date: profile.birth_date,
        gender: profile.gender,
      }}
      onSubmit={(data, dirtyFields) => {
        const payload: ProfilePatchValues = {
          ...(dirtyFields.nickname ? { nickname: data.nickname } : {}),
          ...(dirtyFields.birth_date ? { birth_date: data.birth_date } : {}),
          ...(dirtyFields.gender ? { gender: data.gender } : {}),
        };
        return onSave(payload);
      }}
    >
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
            {isSubmitting && <Spinner />}
            저장
          </Button>
        </div>
      )}
    </ProfileForm>
  );
}
