// 임시 데이터(dummyData) 타입

export interface Transaction {
  id: string; // 고유 키
  title: string; // 거래 명칭
  amount: number; // 금액
  type: 'expense' | 'income'; // 지출/수입 구분
  category_id: string; // 카테고리 아이콘이나 이름을 가져오기 위한 ID
  date: string; // "2024-12-24"
}
