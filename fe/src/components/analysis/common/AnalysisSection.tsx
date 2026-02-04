import { Card } from '@/components/ui/card';

type AnalysisSectionProps = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

const AnalysisSection = ({ title, children, icon }: AnalysisSectionProps) => {
  return (
    <section>
      <Card className="gap-0 px-4 py-4 md:px-6">
        {title && (
          <div className="flex items-center gap-2">
            {icon && (
              <div className="flex shrink-0 items-center [&>svg]:h-5 [&>svg]:w-5 md:[&>svg]:h-6 md:[&>svg]:w-6">
                {icon}
              </div>
            )}
            <h2 className="py-2 text-base font-bold tracking-tight md:text-lg">
              {title}
            </h2>
          </div>
        )}

        <div className="w-full px-2 py-2">{children}</div>
      </Card>
    </section>
  );
};

export default AnalysisSection;
