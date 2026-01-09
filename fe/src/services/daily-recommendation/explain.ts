import { SpendingPatternWeights } from '@/types/dailyRec';

type PaceStatus = 'ahead' | 'behind' | 'onTrack';

const EPSILON = 1000; // 허용 오차(원)

export const getPaceStatus = (diff: number): PaceStatus => {
  if (Math.abs(diff) < EPSILON) return 'onTrack';
  return diff < 0 ? 'ahead' : 'behind';
};

export const getPaceExplanation = (status: PaceStatus) => {
  switch (status) {
    case 'ahead':
      return {
        title: '조금 빠른 소비 페이스예요',
        desc: '기준보다 사용이 많아, 남은 기간을 고려해 오늘 권장액을 조정했어요.',
      };
    case 'behind':
      return {
        title: '여유 있는 소비 페이스예요',
        desc: '기준보다 사용이 적어, 오늘 사용할 수 있는 금액이 조금 늘었어요.',
      };
    case 'onTrack':
      return {
        title: '안정적인 소비 페이스예요',
        desc: '지금 흐름을 유지하면 무리 없이 사용할 수 있어요.',
      };
  }
};

export const getPatternExplanation = (
  weights?: SpendingPatternWeights
): string => {
  if (!weights || weights.combinedWeight == null) {
    return '최근 소비 패턴과 비슷한 수준으로 계산했어요.';
  }

  const rate = Math.round((weights.combinedWeight - 1) * 100);
  if (rate === 0) {
    return '최근 소비 패턴과 비슷한 수준으로 계산했어요.';
  }

  const segmentLabel =
    weights.basis.todaySegment === 'early'
      ? '월초'
      : weights.basis.todaySegment === 'mid'
        ? '월중'
        : '월말';

  const dayLabel = weights.basis.todayIsWeekend ? '주말' : '평일';

  const reason = `${dayLabel} · ${segmentLabel}`;

  return rate > 0
    ? `${reason} 소비 경향을 반영해 오늘 권장액이 조금 늘었어요.`
    : `${reason} 소비 경향을 반영해 오늘 권장액이 조금 줄었어요.`;
};
