/** * 지출 그룹 식별자
 * - 필수 지출(essential) 또는 유연 지출(flexible)
 */
export type CategoryGroupId = 'essential' | 'flexible';

/** * 월별 지출 요약
 * - 특정 월의 총 지출과 그룹별 합계 데이터
 */
export type MonthlySummary = {
  month: string;
  total: number;
  essential: number;
  flexible: number;
};

/** * 그룹 기본 정보
 * - 그룹의 이름, 색상, 설명 등 UI 표현을 위한 고정 정보
 */
export type GroupInfo = {
  id: CategoryGroupId;
  label: string;
  color: string;
  description: string;
};

/** * 그룹 화면 표시용 데이터
 * - 기본 정보에 계산된 금액(amount)과 비중(percent)이 포함된 형태
 */
export type GroupDisplayInfo = GroupInfo & {
  amount: number;
  percent: number;
};

/** * 카테고리 기본 구조
 * - 카테고리명, 소속 그룹, 누적 총액
 */
export type CategoryBase = {
  name: string;
  groupId: CategoryGroupId;
  total: number;
};

/** * 카테고리별 통계 데이터 (과거 분석 결과)
 * - 예산 배분의 기준이 되는 '최근 3개월 평균 지출액(avgAmount)' 포함
 */
export type CategoryStat = CategoryBase & {
  avgAmount: number;
};

/** * 예산 가이드 전체 데이터 구조
 * - 분석 단계부터 예산 수립까지 필요한 모든 정보를 담는 컨테이너
 */
export type BudgetGuideData = {
  lastMonthIncome: number; // 전월 총 수입
  monthlyData: MonthlySummary[]; // 월별 지출 추이
  summary: {
    avgTotal: number; // 3개월 전체 평균 지출
    groupAverages: Record<CategoryGroupId, number>; // 그룹별 평균 지출
  };
  categoryStats: Record<string, CategoryStat>; // 카테고리 ID별 상세 통계
  targetSaving: number; // 사용자가 설정한 저축 목표액
  spendableBudget: number; // 가용 예산 = (Income - Saving)
};

/** * 예산 템플릿 식별자
 */
export type TemplateId = 'keep-pattern' | 'save-flexible' | 'extreme-save';

/** * 예산 수립 규칙(템플릿) 정의
 */
export type BudgetTemplate = {
  id: TemplateId;
  title: string;
  description: string;
  subtitle: string;
  flexibleLimitRatio?: number; // Flexible 그룹의 최대 비중 (0.3 = 30%)
};

/** * 예산 수립 결과
 * - 계산된 예산 초안의 개별 카테고리 정보
 */
export type CalculatedBudgetItem = {
  categoryId: string;
  name: string;
  groupId: CategoryGroupId;
  amount: number;
  weight: number;
};
