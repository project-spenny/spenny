import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

const AnalysisLoading = () => {
  return (
    <div className="flex animate-pulse flex-col items-center justify-center gap-4 py-12">
      <Button variant="ghost" disabled className="text-muted-foreground">
        <Spinner className="size-6" />
        <span className="text-base">Loading...</span>
      </Button>

      <p className="text-muted-foreground/80 text-sm">
        잠시만 기다려 주시면 결과를 보여드릴게요.
      </p>
    </div>
  );
};

export default AnalysisLoading;
