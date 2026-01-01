import { CHART_COLORS } from '@/constants/colors';
import { CategoryAnalysis } from '@/types/analysis';
import { cn } from '@/lib/utils';

type CategoryAnalysisListProps = {
  data: CategoryAnalysis[];
  selectedIndex: number;
  onSelect: (index: number) => void;
};

const CategoryAnalysisList = ({
  data,
  selectedIndex,
  onSelect,
}: CategoryAnalysisListProps) => {
  return (
    <div className="space-y-2 px-2 pt-6">
      {data.map((item, i) => {
        const isSelected = i === selectedIndex;
        const color = i < 5 ? CHART_COLORS.TOP_5[i] : CHART_COLORS.GRAY.LIGHT;

        return (
          <div
            key={item.name}
            onClick={() => onSelect(i)}
            className={cn(
              'group cursor-pointer rounded-xl p-3 transition-all duration-200',
              'hover:bg-muted/50',
              isSelected && 'bg-secondary shadow-sm'
            )}
          >
            <div className="flex items-center justify-between">
              {/* 왼쪽: 차트 색상 매칭 + 이름 + 퍼센트 */}
              <div className="flex items-center gap-4">
                {/* TODO: 추후 차트 색생과 매칭 예정 */}
                <div
                  className={cn(
                    'w-2 rounded-full transition-all duration-300',
                    isSelected ? 'h-6' : 'h-4' // 선택 시 바가 살짝 길어짐
                  )}
                  style={{ backgroundColor: color }}
                />

                <div className="flex flex-col md:flex-row md:items-center md:gap-2">
                  <span
                    className={cn(
                      'text-sm transition-colors md:text-base',
                      isSelected
                        ? 'text-primary font-bold'
                        : 'text-primary/90 font-medium'
                    )}
                  >
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
        );
      })}
    </div>
  );
};

export default CategoryAnalysisList;
