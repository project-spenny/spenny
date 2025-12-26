import { Button } from '@/components/ui/button';
import { DUMMY_TRANSACTIONS } from '@/constants/dummyData';
import LogoutButton from '@/components/LogoutButton';
import ResponsivePanel from '@/components/common/ResponsivePanel';
import TransactionSection from '@/components/common/TransactionSection';

export default function Home() {
  return (
    <main>
      가계부 홈
      <LogoutButton />
      <ResponsivePanel trigger={<Button>거래 내역 보기</Button>}>
        <TransactionSection data={DUMMY_TRANSACTIONS} />
      </ResponsivePanel>
    </main>
  );
}
