import { DrawerBottom } from '@/components/DrawerBottom';
import SheetSide from '@/components/SheetSide';
import { Transaction } from '@/types/testTransaction';

const ResponsivePanel = ({ data }: { data: Transaction[] }) => {
  return (
    <>
      {/* mobile: 768px 미만에서만 보임 */}
      <div className="md:hidden">
        <DrawerBottom data={data} />
      </div>

      {/* desktop: 768px 이상에서만 보임 */}
      <div className="hidden md:block">
        <SheetSide data={data} />
      </div>
    </>
  );
};

export default ResponsivePanel;
