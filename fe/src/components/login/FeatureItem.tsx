import type { ReactNode } from 'react';

export default function FeatureItem({
  icon,
  title,
  desc,
}: {
  icon: ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-4 text-white">
      <div className="text-brand-subtle flex h-11 w-11 items-center justify-center rounded-lg bg-white/10">
        {icon}
      </div>
      <div>
        <h4 className="flex items-center gap-2 font-bold text-white">
          {title}
        </h4>
        <p className="text-brand-subtle mt-0.5 text-sm opacity-80">{desc}</p>
      </div>
    </div>
  );
}
