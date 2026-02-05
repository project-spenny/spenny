/** * 패널 컴포넌트(Drawer, Sheet 등)의 공통 인터페이스
 ** T -> 패널 내부에서 사용할 데이터의 타입
 */
export interface PanelProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export interface ResponsivePanelProps {
  trigger?: React.ReactNode; // 패널을 열 버튼 등 트리거
  children: React.ReactNode; // 패널 내부에 들어갈 내용
}
