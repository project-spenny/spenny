import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div className="no-scrollbar fixed inset-0 z-100 flex items-center justify-center overflow-auto bg-black/50">
      <div className="bg-background flex h-[800px] w-full max-w-[calc(100%-2rem)] flex-col items-center justify-center gap-6 rounded-2xl p-10 shadow-2xl ring-1 ring-black/5 md:max-w-2xl">
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
