import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="fixed inset-0 z-100 flex items-center justify-center bg-black/20 backdrop-blur-[2px]">
      <div className="bg-muted flex flex-col items-center gap-6 rounded-2xl p-10 shadow-2xl ring-1 ring-black/5">
        <div className="relative">
          <Spinner className="text-brand h-12 w-12" />
        </div>

        <div className="text-center">
          <p className="text-lg font-bold">소비 패턴 분석 중</p>
          <p className="text-muted-foreground mt-1 animate-pulse text-sm">
            잠시만 기다려 주세요...
          </p>
        </div>
      </div>
    </div>
  );
}
