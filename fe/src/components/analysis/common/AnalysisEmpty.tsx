import { LucideIcon, ReceiptText } from 'lucide-react';

import { ReactNode } from 'react';

type AnalysisEmptyProps = {
  title: string;
  description?: string;
  icon?: LucideIcon;
  children?: ReactNode;
};

const AnalysisEmpty = ({
  title,
  description,
  icon: Icon = ReceiptText,
  children,
}: AnalysisEmptyProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-12">
      <div className="bg-primary/5 rounded-full p-4">
        <Icon className="text-muted-foreground/80 h-8 w-8" />
      </div>

      <div className="text-muted-foreground space-y-1 text-center">
        <p className="text-lg font-semibold tracking-tight">{title}</p>
        {description && <p className="text-sm break-keep">{description}</p>}
      </div>

      {children && <div className="mt-2">{children}</div>}
    </div>
  );
};

export default AnalysisEmpty;
