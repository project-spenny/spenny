import { DUMMY_TRANSACTIONS } from '@/constants/dummyData';
import LogoutButton from '@/components/LogoutButton';
import ResponsivePanel from '@/components/common/ResponsivePanel';

export default function Home() {
  return (
    <div>
      Home
      <LogoutButton />
      <ResponsivePanel data={DUMMY_TRANSACTIONS} />
    </div>
  );
}
