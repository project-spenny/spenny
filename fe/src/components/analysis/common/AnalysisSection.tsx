import { Card } from '@/components/ui/card';

type AnalysisSectionProps = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

const AnalysisSection = ({ title, children, icon }: AnalysisSectionProps) => {
  return (
    <section>
      <Card className="gap-0 px-6 py-4">
        {title && (
          <div className="flex items-center gap-2">
            {icon}
            <h2 className="py-2 text-xl font-bold tracking-tight">{title}</h2>
          </div>
        )}

        <div className="w-full px-2 py-4">{children}</div>
      </Card>
    </section>
  );
};

export default AnalysisSection;
