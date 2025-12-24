import { DrawerBottom } from '@/components/DrawerBottom';
import LogoutButton from '@/components/LogoutButton';
import SheetSide from '@/components/SheetSide';

export default function Home() {
  return (
    <div>
      Home
      <LogoutButton />
      <div className="flex flex-col gap-2">
        <DrawerBottom />
        <SheetSide />
      </div>
    </div>
  );
}
