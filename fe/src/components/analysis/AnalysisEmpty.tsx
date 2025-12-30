import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ReceiptText } from 'lucide-react';

type AnalysisEmptyProps = {
  title: string;
  description?: string;
};

const AnalysisEmpty = ({ title, description }: AnalysisEmptyProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="bg-muted rounded-full p-4">
        <ReceiptText className="text-muted-foreground/60 h-8 w-8" />
      </div>

      <div className="text-muted-foreground space-y-1">
        <p className="text-lg font-semibold tracking-tight">{title}</p>
        {description && <p className="text-sm">{description}</p>}
      </div>

      <Button variant="secondary" className="mt-2" asChild>
        <Link href={'/'}>기록하러 가기</Link>
      </Button>
    </div>
  );
};

export default AnalysisEmpty;
