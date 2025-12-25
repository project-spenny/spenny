import { DUMMY_TRANSACTIONS } from '@/constants/dummyData';
import LogoutButton from '@/components/LogoutButton';
import TransactionPanel from '@/components/common/TransactionPanel';

export default function Home() {
  return (
    <main>
      가계부 홈
      <LogoutButton />
      <TransactionPanel data={DUMMY_TRANSACTIONS} />
    </main>
  );
}
