'use client';

import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Spinner } from '@/components/ui/spinner';

export default function SocialButton({
  label,
  icon,
  onClick,
  isLoading,
  disabled,
  className,
}: {
  onClick: () => void;
  isLoading: boolean;
  disabled: boolean;
  icon: string;
  label: string;
  className?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'relative flex h-11 w-full cursor-pointer items-center justify-center rounded-xl border text-sm font-semibold text-black disabled:opacity-50',
        className
      )}
    >
      <Image
        src={icon}
        alt={label}
        width={20}
        height={20}
        className="absolute left-5"
      />
      {isLoading && <Spinner />}
      <span className="ml-2">{label}</span>
    </button>
  );
}
