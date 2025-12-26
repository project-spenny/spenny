/** * 패널 컴포넌트(Drawer, Sheet 등)의 공통 인터페이스
 ** T -> 패널 내부에서 사용할 데이터의 타입
 */
export interface PanelProps {
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export type PanelType = 'Sheet' | 'Drawer';
