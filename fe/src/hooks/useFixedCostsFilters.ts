'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function useFixedCostsFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // all 또는 빈 값이면 query param 제거
    if (!value || value === 'all') params.delete(key);
    else params.set(key, value);

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  return { searchParams, updateFilter };
}
