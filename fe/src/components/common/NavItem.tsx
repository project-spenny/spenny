import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { cn } from '@/lib/utils';

const NavItem = ({
  label,
  href,
  isActive,
}: {
  label: string;
  href: string;
  isActive: boolean;
}) => {
  return (
    <Button
      asChild
      variant="ghost"
      className={cn(
        'hover:bg-brand/10 active:bg-brand/20 dark:hover:bg-brand/10 dark:active:bg-brand/20 duration-200 md:h-20 md:w-24',
        isActive ? 'bg-brand/10 font-bold' : 'font-normal'
      )}
    >
      <Link href={href}>{label}</Link>
    </Button>
  );
};

export default NavItem;
