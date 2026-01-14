export const INTRO_STEPS = [
  {
    title: '오늘의 권장 소비 금액을 확인해요',
    description:
      '캘린더 상단에서 오늘 권장 금액을 보고, 자세히 보기로 계산 근거와 소비 페이스를 확인할 수 있어요.',
    media: [{ src: '/intro/step-1.gif', alt: '오늘 권장 소비 금액' }],
  },
  {
    title: '캘린더에서 바로 기록해요',
    description:
      '날짜를 선택해 일자별 거래를 확인하고 필요한 항목만 빠르게 수정하거나 삭제할 수 있어요.',
    media: [{ src: '/intro/step-2.gif', alt: '캘린더 기록' }],
  },
  {
    title: '월별 거래 내역을 한눈에 봐요',
    description:
      '한 달 거래를 한 화면에서 모아보고, 직접 입력 또는 영수증 업로드로 간편하게 기록할 수 있어요.',
    media: [
      {
        src: '/intro/step-3-1.gif',
        alt: '월별 거래 내역 리스트 및 직접 추가',
      },
      {
        src: '/intro/step-3-2.gif',
        alt: '영수증 업로드',
      },
    ],
  },
  {
    title: '수입·지출을 분석해요',
    description:
      '카테고리별 흐름을 한눈에 보고 내 소비 패턴을 쉽게 파악할 수 있어요.',
    media: [{ src: '/intro/step-4.gif', alt: '수입·지출 분석 화면' }],
  },
  {
    title: '월간 예산을 계획해요',
    description:
      '소비 내역을 바탕으로 예산 템플릿을 적용하거나, 총 예산과 카테고리 예산을 직접 설정할 수 있어요.',
    media: [{ src: '/intro/step-5.gif', alt: '월간 예산 설정 화면' }],
  },
  {
    title: '고정비를 관리해요',
    description:
      '매달·매주 반복되는 고정비를 등록해두면, 거래가 자동으로 반영되어 관리가 편해져요.',
    media: [{ src: '/intro/step-6.gif', alt: '고정비 관리 화면' }],
  },
] as const;
