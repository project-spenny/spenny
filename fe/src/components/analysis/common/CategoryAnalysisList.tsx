import { CategoryAnalysis } from '@/types/analysis';

type CategoryAnalysisListProps = {
  data: CategoryAnalysis[];
};

const CategoryAnalysisList = ({ data }: CategoryAnalysisListProps) => {
  return (
    <div className="md: space-y-6 px-2 pt-6">
      {data.map((item) => (
        <div key={item.name} className="group">
          <div className="flex items-center justify-between">
            {/* 왼쪽: 차트 색상 매칭 + 이름 + 퍼센트 */}
            <div className="flex items-center gap-4">
              {/* TODO: 추후 차트 색생과 매칭 예정 */}
              <div className="bg-primary/40 group-hover:bg-primary h-4 w-2 rounded-full transition-colors" />

              <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                <span className="text-primary/90 text-sm font-medium md:text-base">
                  {item.name}
                </span>
                <span className="text-muted-foreground text-xs font-medium md:text-sm">
                  {item.percentage.toFixed(1)}%
                </span>
              </div>
            </div>

            {/* 오른쪽: 금액 */}
            <div className="flex flex-col items-end">
              <span className="text-primary/90 text-sm md:text-base">
                {item.amount.toLocaleString()}원
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryAnalysisList;
