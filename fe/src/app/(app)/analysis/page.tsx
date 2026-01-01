import AnalysisClient from '@/components/analysis/AnalysisClient';
import { Suspense } from 'react';

const AnalysisPage = () => {
  return (
    <Suspense fallback={<div>로딩 중...</div>}>
      <AnalysisClient />;
    </Suspense>
  );
};

export default AnalysisPage;
