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

const getDayLabel = (weights: SpendingPatternWeights) =>
  weights.basis.todayIsWeekend ? '주말' : '평일';

const getSegmentLabel = (weights: SpendingPatternWeights) => {
  switch (weights.basis.todaySegment) {
    case 'early':
      return '월초';
    case 'mid':
      return '월중';
    case 'late':
      return '월말';
  }
};

export type PatternExplanation = {
  reasonLabel: string;
  ratePercent: number;
  message: string;
};

export const getPatternExplanation = (
  weights?: SpendingPatternWeights
): PatternExplanation => {
  if (!weights || weights.combinedWeight == null) {
    return {
      reasonLabel: '소비 패턴',
      ratePercent: 0,
      message: '최근 소비 패턴과 비슷한 수준으로 계산했어요.',
    };
  }

  const ratePercent = Math.round((weights.combinedWeight - 1) * 100);

  const reasonLabel = `${getDayLabel(weights)} · ${getSegmentLabel(weights)}`;

  if (ratePercent === 0) {
    return {
      reasonLabel,
      ratePercent,
      message: `${reasonLabel} 소비 패턴을 반영해 계산했어요.`,
    };
  }

  return {
    reasonLabel,
    ratePercent,
    message:
      ratePercent > 0
        ? `${reasonLabel} 소비 경향을 반영해 오늘 권장액을 조금 더 여유 있게 계산했어요.`
        : `${reasonLabel} 소비 경향을 반영해 오늘 권장액을 조금 보수적으로 계산했어요.`,
  };
};
