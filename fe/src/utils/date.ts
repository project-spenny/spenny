import { startOfWeek, endOfWeek } from 'date-fns';

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

// 선택된 날짜 기준 주 범위 (월요일 시작)
export const getWeekRange = (date: Date) => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });

  return {
    startDate: formatLocalDate(start),
    endDate: formatLocalDate(end),
  };
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

// YYYY-MM-DD 형식 문자열 날짜 비교 (사전순 비교 = 날짜 비교)
export const minDate = (a: string, b: string) => (a < b ? a : b);

// 월 기준 일자 통계
export type MonthDayStats = {
  daysInMonth: number; // 이번 달 총 일수
  dayOfMonth: number; // 오늘이 이번 달의 몇 번째 날인지
  elapsedDays: number; // 어제까지 경과한 일수
  remainingDays: number; // 오늘 포함 남은 일수
};

export const getMonthDayStats = (today: Date): MonthDayStats => {
  const year = today.getFullYear();
  const monthIndex = today.getMonth();
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const dayOfMonth = today.getDate(); // (1~말일)
  const elapsedDays = Math.max(dayOfMonth - 1, 0);
  const remainingDays = Math.max(daysInMonth - dayOfMonth + 1, 1);

  return { daysInMonth, dayOfMonth, elapsedDays, remainingDays };
};
