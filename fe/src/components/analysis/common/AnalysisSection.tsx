type AnalysisSectionProps = {
  title?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
};

const AnalysisSection = ({ title, children, icon }: AnalysisSectionProps) => {
  return (
    <section className="bg-primary-foreground rounded-2xl border p-6 shadow-sm">
      {title && (
        <div className="flex items-center gap-2">
          {icon}
          <h2 className="py-2 text-xl font-bold tracking-tight">{title}</h2>
        </div>
      )}

      <div className="w-full">{children}</div>
    </section>
  );
};

export default AnalysisSection;
