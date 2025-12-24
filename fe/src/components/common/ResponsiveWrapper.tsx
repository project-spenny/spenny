interface ResponsiveWrapperProps {
  mobile: React.ReactNode; // 모바일용 컴포넌트
  desktop: React.ReactNode; // 데스크탑용 컴포넌트
}

const ResponsiveWrapper = ({ mobile, desktop }: ResponsiveWrapperProps) => {
  return (
    <>
      {/* mobile: 768px 미만에서만 보임 */}
      <div className="md:hidden">{mobile}</div>

      {/* desktop: 768px 이상에서만 보임 */}
      <div className="hidden md:block">{desktop}</div>
    </>
  );
};

export default ResponsiveWrapper;
