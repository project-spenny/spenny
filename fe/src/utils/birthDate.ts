// 생년월일 입력값 포맷팅
export function formatBirthDateInput(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8); // yyyymmdd
  const y = digits.slice(0, 4);
  const m = digits.slice(4, 6);
  const d = digits.slice(6, 8);

  if (digits.length <= 4) return y;
  if (digits.length <= 6) return `${y}-${m}`;
  return `${y}-${m}-${d}`;
}

// 생년월일 입력값 보정
export function padBirthDateOnBlur(value: string) {
  // 예: 1999-11-1 -> 1999-11-01
  const match = value.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
  if (!match) return value;

  const [, y, mm, dd] = match;
  return `${y}-${mm.padStart(2, '0')}-${dd.padStart(2, '0')}`;
}
