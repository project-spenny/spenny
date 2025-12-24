import { DUMMY_TRANSACTIONS } from '@/constants/dummyData';
import { DrawerBottom } from '@/components/common/DrawerBottom';
import LogoutButton from '@/components/LogoutButton';
import ResponsiveWrapper from '@/components/common/ResponsiveWrapper';
import SheetSide from '@/components/common/SheetSide';

export default function Home() {
  return (
    <div>
      Home
      <LogoutButton />
      <ResponsiveWrapper
        mobile={<DrawerBottom data={DUMMY_TRANSACTIONS} />}
        desktop={<SheetSide data={DUMMY_TRANSACTIONS} />}
      />
    </div>
  );
}
