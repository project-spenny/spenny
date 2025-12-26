import { Button } from '@/components/ui/button';
import { DUMMY_TRANSACTIONS } from '@/constants/dummyData';
import ResponsivePanel from '@/components/panel/ResponsivePanel';
import TransactionSection from '@/components/transaction/TransactionSection';
import MyInfo from '@/components/my-info/MyInfo';

export default function Home() {
  return (
    <main>
      가계부 홈
      <ResponsivePanel trigger={<Button>거래 내역 보기</Button>}>
        <TransactionSection data={DUMMY_TRANSACTIONS} />
      </ResponsivePanel>
      <ResponsivePanel trigger={<Button>내 정보 보기</Button>}>
        <MyInfo />
      </ResponsivePanel>
    </main>
  );
}
