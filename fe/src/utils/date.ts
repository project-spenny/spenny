/** 선택된 날짜를 바탕으로 해당 월의 시작일과 종료일을 YYYY-MM-DD 형식으로 반환 */
export const getMonthRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const formatMonth = String(month).padStart(2, '0');
  const lastDay = new Date(year, month, 0).getDate(); // 해당 월의 마지막 날짜(숫자)

  // 'YYYY-MM-DD' 형식의 문자열 생성
  const startDate = `${year}-${formatMonth}-01`;
  const endDate = `${year}-${formatMonth}-${lastDay}`;

  return { startDate, endDate };
};
