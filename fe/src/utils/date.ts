/** 선택된 날짜를 바탕으로 해당 월의 시작일과 종료일을 YYYY-MM-DD 형식으로 반환 */
export const getMonthRange = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const formatMonth = String(month).padStart(2, '0');
  const lastDay = new Date(year, month, 0).getDate(); // 해당 월의 마지막 날짜(숫자)

  // 'YYYY-MM-DD' 형식의 문자열 생성
  const startDate = `${year}-${formatMonth}-01`;
  const endDate = `${year}-${formatMonth}-${String(lastDay).padStart(2, '0')}`;

  return { startDate, endDate };
};

// Date 객체를 'YYYY-MM-DD' 문자열로 변환
export const formatLocalDate = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Date 객체를 'YYYY-MM' 문자열로 변환
export const formatMonth = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

// 년-월-일 변환
export const formatDateKR = (date: Date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}년 ${month}월 ${day}일`;
};
// 'YYYY-MM-DD' 문자열을 로컬 Date로 변환 (시간 00:00 고정)

export const parseLocalDate = (value?: string | null): Date | undefined => {
  if (!value) return undefined;

  const [year, month, day] = value.split('-').map(Number);
  return new Date(year, (month ?? 1) - 1, day ?? 1, 0, 0, 0, 0);
};
