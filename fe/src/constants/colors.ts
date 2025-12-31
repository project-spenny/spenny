/**
 * 차트 시각화를 위한 색상 팔레트
 * - TOP_5: 지출/수입 비중이 높은 상위 5개 항목용 색상
 * - GRAY: 비중이 낮은 기타 항목용 회색 (라이트/다크 대응)
 * - BORDER: 선택된 조각의 테두리 색상 (라이트/다크 대응)
 */
export const CHART_COLORS = {
  TOP_5: ['#6366f1', '#10b981', '#3b82f6', '#f59e0b', '#f43f5e'],
  GRAY: {
    LIGHT: '#cecece',
    DARK: '#aaaaaa',
  },
  BORDER: {
    LIGHT: '#e9e9e9',
    DARK: '#4d4d4d',
  },
};
